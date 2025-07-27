const db = require('../db');
const templates = require('../templates/messages');
const { generateTicketId } = require('../utils/messaging');

// Track user conversation state
const userStates = {};

const handleWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const normalizedMsg = message.trim().toLowerCase();

    if (normalizedMsg === 'hello' || normalizedMsg === 'hi') {
    return templates.welcomeMessage; // Ensure this exists in your templates
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
      state.step = 'location';
      return templates.askForLocation;
      
   case 'location':
  state.data.location = message;
  
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
// COMPLAINT FLOW
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
  if (message.toLowerCase() === 'confirm') {
    try {
      console.log('Attempting to create complaint with data:', state.data);
      
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
      ) + '\n\n' + templates.mainMenu;
      
    } catch (error) {
      console.error('Error in confirmation handler:', error);
      delete userStates[phoneNumber];
      return `⚠️ Failed to file complaint. Please try again.\nError: ${error.message}\n\n${templates.mainMenu}`;
    }
  }
  delete userStates[phoneNumber];
  return templates.complaintCancelled;
  }
};

// ========================
// DATABASE FUNCTIONS
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
    console.log('Saving user:', userData); // Debug log
    
    // Make sure all required fields exist
    if (!userData.phone || !userData.name || !userData.email || !userData.location) {
      throw new Error('Missing required user fields');
    }

    const { rows } = await db.pool.query(
      `INSERT INTO users (phone_number, name, email, location)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (phone_number)
       DO UPDATE SET name = $2, email = $3, location = $4
       RETURNING user_id, phone_number, name`,
      [userData.phone, userData.name, userData.email, userData.location]
    );
    
    console.log('User saved successfully:', rows[0]); // Debug log
    return rows[0];
  } catch (error) {
    console.error('Error saving user:', error);
    throw error; // Re-throw to handle in calling function
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
    await client.query('BEGIN'); // Start transaction

    console.log('Creating complaint with:', complaintData); // Debug log
    
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

    await client.query('COMMIT'); // Commit transaction
    console.log('Complaint successfully created:', result.rows[0]);
    return result.rows[0].ticket_id;
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('Failed to create complaint:', error);
    throw error;
  } finally {
    client.release(); // Always release the client
  }
};

// ========================
// HELPER FUNCTIONS
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

// In whatsapp-flow.js
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
    // 1. First verify the ticket exists at all
    const { rows } = await db.pool.query(`
      SELECT c.*, d.*, u.phone_number
      FROM complaints c
      JOIN departments d ON c.department_id = d.department_id
      JOIN users u ON c.user_id = u.user_id
      WHERE c.ticket_id = $1
    `, [ticketId]);

    if (rows.length === 0) {
      // 2. Check if ticket ID format is valid but doesn't exist
      if (/^RTK-[A-Z0-9]{6}$/.test(ticketId)) {
        return `📭 Ticket ${ticketId} not found in our system.\n\n` +
               `Please verify:\n` +
               `1. You entered the correct Ticket ID\n` +
               `2. The complaint was filed within last 6 months\n` +
               `3. You're using the same phone number used to file the complaint`;
      }
      return templates.invalidTicketFormat;
    }

    // 3. Verify phone number match (security check)
    if (rows[0].phone_number !== phoneNumber) {
      return `🔒 Permission Denied\n\n` +
             `This ticket belongs to another user.\n` +
             `Please use the original phone number that filed the complaint.`;
    }

    // 4. Return status if all checks pass
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