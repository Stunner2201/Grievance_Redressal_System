const db = require('../db');
const templates = require('../templates/messages');
const { generateTicketId } = require('../utils/messaging');

// Track user conversation state
const userStates = {};

const handleWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const normalizedMsg = message.trim().toLowerCase();

    if (normalizedMsg === 'hello' || normalizedMsg === 'hi') {
      return templates.welcomeMessage;
    }
    
    // Check if in middle of process
    if (userStates[phoneNumber]) {
      return continueUserProcess(phoneNumber, normalizedMsg);
    }

    // Handle main commands
    switch(normalizedMsg) {
      case '1':
      case 'complaint':
        return startComplaintProcess(phoneNumber);
      case '2':
      case 'status':
        return askForTicketId(phoneNumber);
      case '3':
      case 'faq':
        return templates.faqResponse;
      case '4':
      case 'help':
        return templates.helpMessage;
      default:
        return templates.welcomeMessage;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    return templates.errorMessage;
  }
};

// ========================
// REGISTRATION FLOW
// ========================
const startComplaintProcess = async (phoneNumber) => {
  const user = await getUser(phoneNumber);
  
  if (!user) {
    userStates[phoneNumber] = {
      process: 'registration',
      step: 'name',
      data: { phone: phoneNumber }
    };
    return templates.askForName;
  }
  
  userStates[phoneNumber] = {
    process: 'complaint',
    step: 'department',
    data: { 
      phone: phoneNumber,
      userId: user.user_id 
    }
  };
  return templates.departmentList;
};

const handleRegistration = async (phoneNumber, message) => {
  const state = userStates[phoneNumber];
  
  switch(state.step) {
    case 'name':
      state.data.name = message;
      state.step = 'email';
      return templates.askForEmail;
      
    case 'email':
      if (!validateEmail(message)) {
        return templates.invalidEmail;
      }
      state.data.email = message;
      state.step = 'area_type';
      return templates.askForAreaType;
      
    case 'area_type':
      if (message === '1') {
        state.data.areaType = 'urban';
        state.step = 'urban_ward';
        return templates.askForUrbanWard;
      } else if (message === '2') {
        state.data.areaType = 'rural';
        state.step = 'rural_block';
        return templates.askForRuralBlock;
      } else {
        return templates.invalidAreaSelection;
      }

    case 'urban_ward':
      const urbanWard = parseInt(message);
      if (isNaN(urbanWard) || urbanWard < 1 || urbanWard > 5) {
        return templates.invalidAreaSelection;
      }
      state.data.ward = urbanWard;
      state.step = 'urban_area';
      return templates.askForUrbanArea(urbanWard);

    case 'rural_block':
      const ruralBlock = parseInt(message);
      if (isNaN(ruralBlock) || ruralBlock < 1 || ruralBlock > 5) {
        return templates.invalidAreaSelection;
      }
      
      const blocks = ['Lakhan Majra', 'Sampla', 'Kalanaur', 'Meham', 'Rohtak'];
      state.data.block = blocks[ruralBlock - 1];
      state.step = 'rural_village';
      return templates.askForRuralVillage(state.data.block);

    case 'urban_area':
      const urbanArea = parseInt(message);
      if (isNaN(urbanArea) || urbanArea < 1 || urbanArea > 4) {
        return templates.invalidAreaSelection;
      }
      
      const areas = ['Sector', 'Market', 'Residential Colony', 'Industrial Area'];
      state.data.area = `${areas[urbanArea - 1]} ${state.data.ward}`;
      state.step = 'landmark';
      return templates.askForLandmark;

    case 'rural_village':
      const ruralVillage = parseInt(message);
      if (isNaN(ruralVillage) || ruralVillage < 1 || ruralVillage > 4) {
        return templates.invalidAreaSelection;
      }
      
      state.data.village = `${state.data.block} Village ${ruralVillage}`;
      state.step = 'landmark';
      return templates.askForLandmark;

    case 'landmark':
      state.data.landmark = message;
      
      // Construct full address based on area type
      if (state.data.areaType === 'urban') {
        state.data.location = `Urban: Ward ${state.data.ward}, ${state.data.area}, Landmark: ${message}`;
      } else {
        state.data.location = `Rural: ${state.data.block} Block, ${state.data.village}, Landmark: ${message}`;
      }

      try {
        console.log('Attempting to save user with data:', state.data);
        
        const savedUser = await saveUser(state.data);
        if (!savedUser || !savedUser.user_id) {
          throw new Error('Failed to save user or get user_id');
        }

        console.log('Transitioning to complaint flow for user:', savedUser.user_id);
        
        userStates[phoneNumber] = {
          process: 'complaint',
          step: 'department',
          data: {
            phone: phoneNumber,
            userId: savedUser.user_id,
            name: savedUser.name
          }
        };
        
        return templates.registrationComplete + '\n\n' + templates.departmentList;
        
      } catch (error) {
        console.error('Error in location handler:', error);
        delete userStates[phoneNumber];
        return `⚠️ Error processing your request. Please start again with COMPLAINT.\n\n${templates.errorMessage}`;
      }
  }
};

// ========================
// COMPLAINT FLOW (remain unchanged)
// ========================
const handleComplaint = async (phoneNumber, message) => {
  const state = userStates[phoneNumber];
  
  switch(state.step) {
    case 'department':
      const deptId = parseInt(message);
      if (isNaN(deptId)) {
        return templates.invalidDepartment;
      }
      state.data.departmentId = deptId;
      state.step = 'description';
      return templates.askForDescription;
      
    case 'description':
      state.data.description = message;
      state.step = 'location_details';
      return templates.askForExactLocation;
      
    case 'location_details':
      state.data.locationDetails = message;
      state.step = 'confirm';
      
      const dept = await getDepartment(state.data.departmentId);
      return templates.complaintConfirmation(
        dept.department_name,
        state.data.description,
        state.data.locationDetails
      );
      
   case 'confirm':
  const confirmation = message.toLowerCase().trim();
  
  if (confirmation === '1' || confirmation === 'yes' || confirmation === 'y') {
    try {
      const ticketId = await createComplaint({
        userId: state.data.userId,
        phone: state.data.phone,
        departmentId: state.data.departmentId,
        description: state.data.description,
        locationDetails: state.data.locationDetails
      });

      delete userStates[phoneNumber];
      const dept = await getDepartment(state.data.departmentId);
      return templates.complaintRegistered(
        ticketId,
        dept.department_name,
        state.data.locationDetails
      );
      
    } catch (error) {
      console.error('Error:', error);
      delete userStates[phoneNumber];
      return `⚠️ Failed to file complaint. Please try again.\n\n${templates.mainMenu}`;
    }
  } 
  else if (confirmation === '2' || confirmation === 'no' || confirmation === 'n') {
    delete userStates[phoneNumber];
    return templates.complaintCancelled;
  }
  else {
    // Show confirmation again if invalid response
    const dept = await getDepartment(state.data.departmentId);
    return templates.complaintConfirmation(
      dept.department_name,
      state.data.description,
      state.data.locationDetails
    );
  }
  }
};

// ========================
// DATABASE FUNCTIONS (remain unchanged)
// ========================
const getUser = async (phoneNumber) => {
  const { rows } = await db.pool.query(
    'SELECT * FROM users WHERE phone_number = $1',
    [phoneNumber]
  );
  return rows[0];
};

const saveUser = async (userData) => {
  try {
    console.log('Saving user:', userData);
    
    const { rows } = await db.pool.query(
      `INSERT INTO users (
        phone_number, name, email, location,
        area_type, ward, block, area, village, landmark
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (phone_number)
       DO UPDATE SET 
         name = $2, 
         email = $3, 
         location = $4,
         area_type = $5,
         ward = $6,
         block = $7,
         area = $8,
         village = $9,
         landmark = $10
       RETURNING user_id, phone_number, name`,
      [
        userData.phone, 
        userData.name, 
        userData.email, 
        userData.location,
        userData.areaType,
        userData.ward,
        userData.block,
        userData.area,
        userData.village,
        userData.landmark
      ]
    );
    
    console.log('User saved successfully:', rows[0]);
    return rows[0];
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

const getDepartment = async (deptId) => {
  const { rows } = await db.pool.query(
    'SELECT * FROM departments WHERE department_id = $1',
    [deptId]
  );
  return rows[0];
};

const createComplaint = async (complaintData) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    const ticketId = generateTicketId();
    const dept = await getDepartment(complaintData.departmentId);

    const result = await client.query(
      `INSERT INTO complaints (
        ticket_id, user_id, user_phone, department_id,
        category, description, location_details, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')
       RETURNING complaint_id, ticket_id`,
      [
        ticketId,
        complaintData.userId,
        complaintData.phone,
        complaintData.departmentId,
        dept.department_name,
        complaintData.description,
        complaintData.locationDetails
      ]
    );

    await client.query('COMMIT');
    console.log('Complaint successfully created:', result.rows[0]);
    return result.rows[0].ticket_id;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to create complaint:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ========================
// HELPER FUNCTIONS (remain unchanged)
// ========================
const continueUserProcess = async (phoneNumber, message) => {
  const state = userStates[phoneNumber];
  
  if (state.process === 'registration') {
    return handleRegistration(phoneNumber, message);
  }
  
  if (state.process === 'complaint') {
    return handleComplaint(phoneNumber, message);
  }
  
  if (state.process === 'status_check') {
    return handleStatusCheck(phoneNumber, message);
  }
  
  delete userStates[phoneNumber];
  return templates.errorMessage;
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const askForTicketId = (phoneNumber) => {
  userStates[phoneNumber] = {
    process: 'status_check',
    step: 'ticket_id'
  };
  return templates.askForTicketId;
};

const handleStatusCheck = async (phoneNumber, message) => {
  const ticketId = message.trim().toUpperCase();

  try {
    const { rows } = await db.pool.query(`
      SELECT c.*, d.*, u.phone_number
      FROM complaints c
      JOIN departments d ON c.department_id = d.department_id
      JOIN users u ON c.user_id = u.user_id
      WHERE c.ticket_id = $1
    `, [ticketId]);

    if (rows.length === 0) {
      if (/^RTK-[A-Z0-9]{6}$/.test(ticketId)) {
        return `📭 Ticket ${ticketId} not found in our system.\n\n` +
               `Please verify:\n` +
               `1. You entered the correct Ticket ID\n` +
               `2. The complaint was filed within last 6 months\n` +
               `3. You're using the same phone number used to file the complaint`;
      }
      return templates.invalidTicketFormat;
    }

    if (rows[0].phone_number !== phoneNumber) {
      return `🔒 Permission Denied\n\n` +
             `This ticket belongs to another user.\n` +
             `Please use the original phone number that filed the complaint.`;
    }

    const complaint = rows[0];
    return templates.statusUpdate(
      complaint.ticket_id,
      complaint.status,
      complaint.description,
      complaint.location_details,
      {
        department_name: complaint.department_name,
        description: complaint.description,
        email: complaint.email
      },
      complaint.created_at,
      complaint.updated_at
    );

  } catch (error) {
    console.error('Database error:', error);
    return `🛠️ System Maintenance\n\n` +
           `Our complaint system is temporarily unavailable.\n` +
           `Engineers have been notified. Please try again later.`;
  }
};

module.exports = {
  handleWhatsAppMessage
};