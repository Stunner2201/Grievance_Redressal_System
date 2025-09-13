// twilio/webhook.js
const { handleWhatsAppMessage } = require('./whatsapp-flow');
const messaging = require('../utils/messaging');

// STRONG EMERGENCY OVERRIDE
const emergencyOverride = (response, phoneNumber) => {
  if (response && response.includes('Department Selection') && response.length > 1000) {
    console.log('EMERGENCY OVERRIDE: Detected old department format, using categories');
    
    // Reset user state to avoid infinite loop
    const userStates = require('./whatsapp-flow').userStates;
    if (userStates[phoneNumber] && userStates[phoneNumber].process === 'complaint') {
      userStates[phoneNumber].step = 'department';
      delete userStates[phoneNumber].data.selectedCategory;
      delete userStates[phoneNumber].data.currentPage;
    }
    
    // Hardcoded category list that will definitely work
    return `🏢 *Department Categories*\n\nPlease select a category:\n\n1. Education & Universities (6 depts)\n2. Health & Insurance (9 depts)\n3. Infrastructure & Development (12 depts)\n4. Finance & Taxation (7 depts)\n5. Agriculture & Rural Development (7 depts)\n6. Industries & Commerce (11 depts)\n7. Social Welfare & Empowerment (5 depts)\n8. Law & Order (2 depts)\n9. Other Government Departments (27 depts)\n\nReply with the *category number*`;
  }
  return response;
};

const handleIncomingMessage = async (req, res) => {
  try {
    console.log('=== INCOMING WHATSAPP MESSAGE ===');
    console.log('Timestamp:', new Date().toISOString());
    
    const incomingMsg = (req.body?.Body || req.body?.body || '').trim();
    const sender = req.body?.From || req.body?.from;
    
    if (!incomingMsg || !sender) {
      console.error('Invalid payload - missing Body/From fields');
      return res.status(400).json({ error: 'Invalid Twilio webhook format' });
    }

    const phoneNumber = sender.replace('whatsapp:', '');
    console.log(`Processing message from ${phoneNumber}: "${incomingMsg}"`);

    let response = await handleWhatsAppMessage(phoneNumber, incomingMsg);
    
    // Apply emergency override
    response = emergencyOverride(response, phoneNumber);
    
    if (!response) {
      console.log('No response generated');
      return res.status(200).send();
    }

    console.log('Response length:', response.length);
    console.log('First 50 chars:', response.substring(0, 50));
    
    // Final safety check - if still too long, use minimal response
    if (response.length > 1500) {
      console.log('Response still too long, using minimal fallback');
      response = `🏢 *Department Assistance*\n\nPlease type the name of the department you want to complain about.\n\nWe'll direct you to the right place.`;
    }
    
    await messaging.sendWhatsAppMessage(sender, response);
    console.log('Response sent successfully');
    res.status(200).send();

  } catch (error) {
    console.error('!!! CRITICAL ERROR IN WEBHOOK !!!');
    console.error('Error:', error.message);
    
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  handleIncomingMessage
};