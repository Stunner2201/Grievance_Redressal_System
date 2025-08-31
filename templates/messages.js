module.exports = {
  // ========================
  // MAIN INTERFACE MESSAGES
  // ========================
  welcomeMessage: `🏛️ *Welcome to Rohtak Grievance Redressal System*\n\nPlease choose an option:\n\n` +
    `1️⃣ *COMPLAINT* - File new grievance\n` +
    `2️⃣ *STATUS* - Check complaint status\n` +
    `3️⃣ *FAQ* - Frequently asked questions\n` +
    `4️⃣ *HELP* - Show help menu`,

  helpMessage: `🆘 *Help Guide*\n\nAvailable commands:\n\n` +
    `📌 *COMPLAINT* - Register new issue\n` +
    `📌 *STATUS <ticket-id>* - Track complaint\n` +
    `📌 *FAQ* - Common questions\n` +
    `📌 *HELP* - Show this menu\n\n` +
    `📌 *MENU* - Return to main menu`,

  mainMenu: `📋 *Main Menu*\n\n` +
    `1️⃣ File new complaint\n` +
    `2️⃣ Check status\n` +
    `3️⃣ View FAQs\n` +
    `4️⃣ Get help`,

  // ========================
  // USER REGISTRATION FLOW
  // ========================
  askForName: `👤 *User Registration*\n\nPlease provide your:\n\n` +
    `📛 *Full Name* (as per ID proof)\n` +
    `Example: "Rahul Sharma"`,

  askForEmail: `📧 *Contact Information*\n\nPlease provide your:\n\n` +
    `✉️ *Email Address* (for updates)\n` +
    `Example: "user@example.com"`,

  // askForLocation: `📍 *Residential Details*\n\nPlease provide your:\n\n` +
  //   `🏠 *Complete Address*\n` +
  //   `(Ward/Sector + Landmark + City)\n` +
  //   `Example: "Ward 5, Behind Gandhi Park, Rohtak"`,

  invalidEmail: `❌ *Invalid Email Format*\n\n` +
    `Please provide a valid email address:\n` +
    `• Must contain @ symbol\n` +
    `• Must have domain (e.g., .com)\n` +
    `Example: "citizen@rohtak.gov.in"`,

  registrationComplete: `✅ *Registration Successful!*\n\n` +
    `Your details have been saved in our system.\n\n` +
    `Now let's file your complaint:`,

  // ========================
  // COMPLAINT FILING FLOW
  // ========================
  departmentList: `🏢 *Department Selection*\n\n` +
    `Please choose the relevant department:\n\n` +
    `1️⃣ PWD - Roads/Bridges/Infrastructure\n` +
    `2️⃣ Municipal - Water/Sanitation/Garbage\n` +
    `3️⃣ Electricity - Power/Street Lights\n` +
    `4️⃣ Health - Hospitals/Clinics\n` +
    `5️⃣ Police - Law & Order Issues\n\n` +
    `Reply with the *department number* (1-5)`,

  invalidDepartment: `⚠️ *Invalid Department*\n\n` +
    `Please select from these options:\n\n` +
    `1️⃣ Public Works\n` +
    `2️⃣ Municipal\n` +
    `3️⃣ Electricity\n` +
    `4️⃣ Health\n` +
    `5️⃣ Police\n\n` +
    `Reply with number only (1-5)`,

  askForDescription: `📝 *Complaint Details*\n\n` +
    `Please describe your issue *in detail*:\n\n` +
    `ℹ️ Include:\n` +
    `- Nature of problem\n` +
    `- Duration of issue\n` +
    `- Affected areas\n\n` +
    `Example: "Street light not working for 5 days near Sector 14 market"`,

  askForExactLocation: `📍 *Precise Location*\n\n` +
    `Please provide *exact location* details:\n\n` +
    `ℹ️ Include:\n` +
    `- House/Building number\n` +
    `- Nearby landmarks\n` +
    `- Any reference points\n\n` +
    `Example: "House No. 45, Opposite HDFC Bank, Main Road"`,

  complaintConfirmation: (department, description, location) => 
  `🔍 *Complaint Verification*\n\n` +
  `Please confirm your complaint details:\n\n` +
  `🏢 *Department*: ${department}\n` +
  `📝 *Issue*: ${description}\n` +
  `📍 *Location*: ${location}\n\n` +
  `Reply with:\n` +
  `1️⃣ *YES* - To submit complaint\n` +
  `2️⃣ *NO* - To start over`,

  complaintRegistered: (ticketId, department, location) => 
    `✅ *Complaint Registered!*\n\n` +
    `📄 Ticket ID: *${ticketId}*\n` +
    `🏢 Department: *${department}*\n` +
    `📍 Location: *${location}*\n\n` +
    `🔔 You will receive updates on this number.\n` +
    `📌 To check status, send:\n"*STATUS ${ticketId}*"`,

  complaintCancelled: `❌ *Complaint Cancelled*\n\n` +
    `The complaint process has been terminated.\n\n` +
    `To start over, send:\n*COMPLAINT*`,

  // ========================
  // STATUS CHECK FLOW
  // ========================
  // STATUS CHECK FLOW TEMPLATES
askForTicketId: `🔎 *Check Complaint Status*\n\n` +
  `Please enter your *RTK Ticket ID* (Example: RTK-J82TXM):\n\n` +
  `📍 *Where to find your Ticket ID:*\n` +
  `- In your complaint confirmation message\n` +
  `- In any status update from us\n\n` +
  `📌 Type "MENU" to return to main menu`,

statusUpdate: (ticketId, status, department, notes, officer) => {
    const base = `📢 *Status Update*\n\nTicket: #${ticketId}\nDepartment: ${department}\n`;
    
    const statusMessages = {
      'Pending': `${base}Status: ⏳ Pending\n\nWe've received your complaint.`,
      'In Progress': `${base}Status: 🛠️ In Progress\n\nOfficer: ${officer}\n\n${notes || ''}`,
      'Resolved': `${base}Status: ✅ Resolved\n\nResolution: ${notes || 'Completed'}`,
      'Rejected': `${base}Status: ❌ Rejected\n\nReason: ${notes || 'Not specified'}`
    };

    return statusMessages[status] || `${base}Status changed to: ${status}`;
  },
statusNotFound: (ticketId) => 
  `❌ *Complaint Not Found*\n\n` +
  `We couldn't find complaint with ID: *${ticketId}*\n\n` +
  `ℹ️ *Possible reasons:*\n` +
  `• Typo in Ticket ID (correct format: RTK-XXXXXX)\n` +
  `• Complaint filed more than 6 months ago\n` +
  `• Technical error (rare)\n\n` +
  `🔄 *What would you like to do?*\n\n` +
  `1. Try again with correct ID\n` +
  `2. Contact support at support@rohtak.gov.in\n` +
  `3. Return to main menu`,

invalidTicketFormat: `⚠️ *Invalid Ticket Format*\n\n` +
  `Rohtak Ticket IDs follow this format:\n\n` +
  `• Starts with "RTK-"\n` +
  `• Followed by 6 characters (letters/numbers)\n` +
  `• Example: "RTK-J82TXM"\n\n` +
  `Please check your confirmation message and try again\n\n` +
  `📌 Type "MENU" to cancel`,

  // ========================
  // FAQ SECTION
  // ========================
  faqResponse: `❓ *Frequently Asked Questions*\n\n` +
    `Q: How long for resolution?\n` +
    `A: 3-7 working days (varies by department)\n\n` +
    `Q: Can officers contact me?\n` +
    `A: Yes, via your registered WhatsApp number\n\n` +
    `Q: Wrong department selected?\n` +
    `A: Email grievance@rohtak.gov.in with ticket ID\n\n` +
    `Q: Emergency complaints?\n` +
    `A: Call 1077 for immediate assistance\n\n` +
    `Q: How to check status?\n` +
    `A: Send "STATUS <your-ticket-id>"`,

  // ========================
  // SYSTEM MESSAGES
  // ========================
  errorMessage: `⚠️ *System Error*\n\n` +
    `We're experiencing technical difficulties.\n` +
    `Please try again later or contact support:\n` +
    `📞 1800-123-4567\n` +
    `✉️ support@rohtak.gov.in`,

  sessionTimeout: `⏱️ *Session Expired*\n\n` +
    `Your previous session has timed out.\n\n` +
    `Please start again by sending:\n*COMPLAINT*`,

  invalidOption: `❌ *Invalid Option*\n\n` +
    `Please select from the available options.\n\n` +
    `📌 Send "HELP" for guidance\n` +
    `📌 Send "MENU" for main menu`,

    // Add these to your templates module.exports
askForAreaType: `📍 *Area Type*\n\nPlease select your area type:\n\n` +
  `1️⃣ Urban (Municipal Corporation area)\n` +
  `2️⃣ Rural (Village area)\n\n` +
  `Reply with *1* or *2*`,

askForUrbanWard: `🏙️ *Urban Area*\n\nPlease select your ward:\n\n` +
  `1️⃣ Ward 1\n` +
  `2️⃣ Ward 2\n` +
  `3️⃣ Ward 3\n` +
  `4️⃣ Ward 4\n` +
  `5️⃣ Ward 5\n\n` +
  `Reply with ward number (1-5)`,

askForRuralBlock: `🌄 *Rural Area*\n\nPlease select your block:\n\n` +
  `1️⃣ Lakhan Majra\n` +
  `2️⃣ Sampla\n` +
  `3️⃣ Kalanaur\n` +
  `4️⃣ Meham\n` +
  `5️⃣ Rohtak\n\n` +
  `Reply with block number (1-5)`,

askForUrbanArea: (ward) => `🏘️ *Ward ${ward} Areas*\n\nPlease select your area:\n\n` +
  `1️⃣ Sector ${ward}\n` +
  `2️⃣ Market ${ward}\n` +
  `3️⃣ Residential Colony ${ward}\n` +
  `4️⃣ Industrial Area ${ward}\n\n` +
  `Reply with area number (1-4)`,

askForRuralVillage: (block) => `🏡 *${block} Block Villages*\n\nPlease select your village:\n\n` +
  `1️⃣ ${block} Village 1\n` +
  `2️⃣ ${block} Village 2\n` +
  `3️⃣ ${block} Village 3\n` +
  `4️⃣ ${block} Village 4\n\n` +
  `Reply with village number (1-4)`,

askForLandmark: `🗺️ *Final Location Details*\n\nPlease provide:\n\n` +
  `📍 Nearby landmark or house details\n` +
  `Example: "Near Hanuman Temple" or "House No. 123"`,

invalidAreaSelection: `⚠️ *Invalid Selection*\n\n` +
  `Please choose from the provided options only\n\n` +
  `📌 Type "MENU" to cancel registration`,
};