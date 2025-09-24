// whatsapp-flow.js
const db = require('../db');
const templates = require('../templates/messages');
const { generateTicketId } = require('../utils/messaging');
const departmentData = require('../templates/department');

// Track user conversation state
const userStates = {};

// Debug mode - set to true for development
const DEBUG_MODE = process.env.NODE_ENV === 'development';

// Add this missing variable that's referenced in the department.js file
const askForDescription = templates.askForDescription;
const askForLandmark = templates.askForLandmark;

const handleWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const normalizedMsg = message.trim().toLowerCase();

    if (DEBUG_MODE) {
      console.log('=== NEW MESSAGE ===');
      console.log('From:', phoneNumber);
      console.log('Message:', message);
      console.log('Current state:', userStates[phoneNumber] ? userStates[phoneNumber].process : 'No state');
    }

    if (normalizedMsg === 'hello' || normalizedMsg === 'hi') {
      return templates.welcomeMessage;
    }
    
    // Check if user wants to cancel or go to menu
    if (normalizedMsg === 'menu' || normalizedMsg === 'cancel') {
      delete userStates[phoneNumber];
      return templates.welcomeMessage;
    }
    
    // Check if in middle of process
    if (userStates[phoneNumber]) {
      return continueUserProcess(phoneNumber, normalizedMsg, message);
    }

    // Handle status check with ticket ID (e.g., "STATUS RTK-TSA7MX")
    if (normalizedMsg.startsWith('status ')) {
      const ticketId = message.trim().substring(6).trim().toUpperCase(); // Extract ticket ID
      return handleStatusCheck(phoneNumber, ticketId);
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
        return templates.invalidOption;
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
  try {
    const user = await getUser(phoneNumber);
    
    if (!user) {
      userStates[phoneNumber] = {
        process: 'registration',
        step: 'name',
        data: { phone: phoneNumber }
      };
      if (DEBUG_MODE) console.log('Starting registration for:', phoneNumber);
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
    
    if (DEBUG_MODE) console.log('Starting complaint for existing user:', phoneNumber);
    
    // Use template function instead of hardcoded list
    return departmentData.generateDepartmentCategoryList();
  } catch (error) {
    console.error('Error in startComplaintProcess:', error);
    return templates.errorMessage;
  }
};

const handleRegistration = async (phoneNumber, message, normalizedMsg) => {
  const state = userStates[phoneNumber];
  
  if (DEBUG_MODE) {
    console.log('Registration step:', state.step);
    console.log('User input:', message);
  }
  
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
      if (normalizedMsg === '1') {
        state.data.areaType = 'urban';
        state.step = 'urban_ward';
        return templates.generateWardList();
      } else if (normalizedMsg === '2') {
        state.data.areaType = 'rural';
        state.step = 'rural_block';
        return templates.generateBlockList();
      } else {
        return templates.invalidAreaSelection;
      }

    case 'urban_ward':
      return templates.handleWardSelection(phoneNumber, message, state);

    case 'urban_colony':
      // Removed pagination parameter
      return templates.handleColonySelection(phoneNumber, message, state.data.wardNumber, state);

    case 'rural_block':
      return templates.handleBlockSelection(phoneNumber, message, state);

    case 'rural_village':
      // FIXED: Pass the user state correctly
      return templates.handleVillageSelection(phoneNumber, message, state.data.block, state);

    case 'landmark':
      state.data.landmark = message;
      
      // Construct full address based on area type using the correct field names
      if (state.data.areaType === 'urban') {
        state.data.location = `${state.data.ward}, ${state.data.colony}, Landmark: ${message}`;
        // Store colony in the area field for database
        state.data.area = state.data.colony;
        state.data.ward_number = state.data.wardNumber;
      } else {
        state.data.location = `${state.data.block} Block, ${state.data.village}, Landmark: ${message}`;
        // Store village in both area and village fields for database
        state.data.area = state.data.village;
        state.data.village = state.data.village;
      }
      
      try {
        if (DEBUG_MODE) console.log('Saving user with data:', state.data);
        
        const savedUser = await saveUser(state.data);
        if (!savedUser || !savedUser.user_id) {
          throw new Error('Failed to save user or get user_id');
        }
        
        if (DEBUG_MODE) console.log('User saved successfully:', savedUser.user_id);
        
        userStates[phoneNumber] = {
          process: 'complaint',
          step: 'department',
          data: {
            phone: phoneNumber,
            userId: savedUser.user_id,
            name: savedUser.name
          }
        };
        
        // Use departmentData function instead of templates
        return templates.registrationComplete + '\n\n' + departmentData.generateDepartmentCategoryList();
        
      } catch (error) {
        console.error('Error in location handler:', error);
        delete userStates[phoneNumber];
        return `⚠️ Error processing your request. Please start again with COMPLAINT.\n\n${templates.errorMessage}`;
      }
          
    default:
      delete userStates[phoneNumber];
      return templates.errorMessage;
  }
};

// ========================
// COMPLAINT FLOW
// ========================
const handleComplaint = async (phoneNumber, message, normalizedMsg) => {
  const state = userStates[phoneNumber];
  
  if (DEBUG_MODE) {
    console.log('Complaint step:', state.step);
    console.log('User input:', message);
  }
  
  switch(state.step) {
    case 'department':
      console.log('DEBUG: Handling department selection');
      console.log('DEBUG: User state data:', JSON.stringify(state.data));
      console.log('DEBUG: User input:', message);
      
      // Use departmentData function instead of templates
      const result = departmentData.handleDepartmentSelection(phoneNumber, message, state);
      
      console.log('DEBUG: Result from handleDepartmentSelection:');
      console.log('DEBUG: Result length:', result.length);
      console.log('DEBUG: First 100 chars:', result.substring(0, 100));
      
      return result;

    case 'description':
      state.data.description = message;
      state.step = 'location_details';
      return templates.askForExactLocation;
      
    case 'location_details':
      state.data.locationDetails = message;
      state.step = 'confirm';
      
      return templates.complaintConfirmation(
        state.data.departmentName,
        state.data.description,
        state.data.locationDetails
      );
      
    case 'confirm':
  if (normalizedMsg === '1' || normalizedMsg === 'yes' || normalizedMsg === 'y') {
    try {
      console.log('DEBUG: Before createComplaint call');
      const ticketId = await createComplaint({
        userId: state.data.userId,
        phone: state.data.phone,
        departmentId: state.data.departmentId,
        description: state.data.description,
        locationDetails: state.data.locationDetails
      });

      console.log('DEBUG: After createComplaint call, ticketId:', ticketId);
      console.log('DEBUG: Type of ticketId:', typeof ticketId);
      
      if (DEBUG_MODE) console.log('Complaint created with ticket ID:', ticketId);
      
      delete userStates[phoneNumber];
      
      const response = templates.complaintRegistered(
        ticketId,
        state.data.departmentName,
        state.data.locationDetails
      );
      
      console.log('DEBUG: Response to be sent:', response);
      return response;
      
    } catch (error) {
      console.error('Error creating complaint:', error);
      delete userStates[phoneNumber];
      return `⚠️ Failed to file complaint. Please try again.\n\n${templates.mainMenu}`;
    }
  }
      else if (normalizedMsg === '2' || normalizedMsg === 'no' || normalizedMsg === 'n') {
        delete userStates[phoneNumber];
        return templates.complaintCancelled;
      }
      else {
        return templates.complaintConfirmation(
          state.data.departmentName,
          state.data.description,
          state.data.locationDetails
        );
      }
      
    default:
      delete userStates[phoneNumber];
      return templates.errorMessage;
  }
};

// ========================
// DATABASE FUNCTIONS
// ========================
const getUser = async (phoneNumber) => {
  try {
    const { rows } = await db.pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phoneNumber]
    );
    return rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

const saveUser = async (userData) => {
  try {
    if (DEBUG_MODE) console.log('Saving user:', userData);
    
    // Prepare data based on your actual database schema
    let area = '';
    let village = '';
    let ward_number = '';
    
    if (userData.areaType === 'urban') {
      // For urban areas, use colony as area and ward number
      area = userData.colony || '';
      ward_number = userData.wardNumber || '';
    } else if (userData.areaType === 'rural') {
      // For rural areas, use village as area
      area = userData.village || '';
      village = userData.village || '';
    }
    
    const userDataWithDefaults = {
      phone: userData.phone || '',
      name: userData.name || '',
      email: userData.email || '',
      location: userData.location || '',
      area_type: userData.areaType || '',
      ward: userData.ward ? parseInt(userData.ward.replace('Ward-', '')) || 0 : 0,
      block: userData.block || '',
      area: area,
      village: village,
      ward_number: ward_number,
      landmark: userData.landmark || ''
    };
    
    if (DEBUG_MODE) console.log('User data with defaults:', userDataWithDefaults);
    
    const { rows } = await db.pool.query(
      `INSERT INTO users (
        phone_number, name, email, location,
        area_type, ward, block, area, village, ward_number, landmark
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (phone_number)
       DO UPDATE SET 
         name = EXCLUDED.name, 
         email = EXCLUDED.email, 
         location = EXCLUDED.location,
         area_type = EXCLUDED.area_type,
         ward = EXCLUDED.ward,
         block = EXCLUDED.block,
         area = EXCLUDED.area,
         village = EXCLUDED.village,
         ward_number = EXCLUDED.ward_number,
         landmark = EXCLUDED.landmark
       RETURNING user_id, phone_number, name`,
      [
        userDataWithDefaults.phone, 
        userDataWithDefaults.name, 
        userDataWithDefaults.email, 
        userDataWithDefaults.location,
        userDataWithDefaults.area_type,
        userDataWithDefaults.ward,
        userDataWithDefaults.block,
        userDataWithDefaults.area,
        userDataWithDefaults.village,
        userDataWithDefaults.ward_number,
        userDataWithDefaults.landmark
      ]
    );
    
    if (DEBUG_MODE) console.log('User saved successfully:', rows[0]);
    return rows[0];
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

// Update the getDepartment function to use local JSON
const getDepartment = async (deptId) => {
  // Use local JSON data instead of database query
  return departmentData.getDepartmentById(deptId);
};

const createComplaint = async (complaintData) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    const ticketId = generateTicketId();
    const dept = await getDepartment(complaintData.departmentId);

    if (!dept) {
      throw new Error(`Department with ID ${complaintData.departmentId} not found`);
    }

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
    
    const createdComplaint = result.rows[0];
    if (DEBUG_MODE) console.log('Complaint successfully created:', createdComplaint);
    
    // ✅ FIX: Return the ticket ID from the database result
    return createdComplaint.ticket_id;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to create complaint:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ========================
// HELPER FUNCTIONS
// ========================
const continueUserProcess = async (phoneNumber, normalizedMsg, originalMsg) => {
  const state = userStates[phoneNumber];
  
  if (state.process === 'registration') {
    return handleRegistration(phoneNumber, originalMsg, normalizedMsg);
  }
  
  if (state.process === 'complaint') {
    return handleComplaint(phoneNumber, originalMsg, normalizedMsg);
  }
  
  if (state.process === 'status_check') {
    return handleStatusCheck(phoneNumber, originalMsg);
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

const handleStatusCheck = async (phoneNumber, ticketId) => {
  try {
    // Clean up the ticket ID
    ticketId = ticketId.trim().toUpperCase();
    
    // Validate ticket format
    if (!/^RTK-[A-Z0-9]{6}$/.test(ticketId)) {
      return templates.invalidTicketFormat;
    }

    const { rows } = await db.pool.query(`
      SELECT c.*, d.*, u.phone_number
      FROM complaints c
      JOIN departments d ON c.department_id = d.department_id
      JOIN users u ON c.user_id = u.user_id
      WHERE c.ticket_id = $1
    `, [ticketId]);

    if (rows.length === 0) {
      return templates.statusNotFound(ticketId);
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
      complaint.department_name,
      complaint.resolution_notes || '',
      complaint.assigned_officer || 'Not assigned yet'
    );

  } catch (error) {
    console.error('Database error in status check:', error);
    return `🛠️ System Maintenance\n\n` +
           `Our complaint system is temporarily unavailable.\n` +
           `Engineers have been notified. Please try again later.`;
  }
};

module.exports = {
  handleWhatsAppMessage
};