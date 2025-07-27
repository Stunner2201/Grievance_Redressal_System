// twilio/webhook.js
const { handleWhatsAppMessage } = require('./whatsapp-flow');
const messaging = require('../utils/messaging');

const handleIncomingMessage = async (req, res) => {
  try {
    console.log('=== INCOMING REQUEST ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw body:', req.body);

    // Enhanced payload parsing
    const incomingMsg = (req.body?.Body || req.body?.body || '').trim();
    const sender = req.body?.From || req.body?.from;
    
    if (!incomingMsg || !sender) {
      console.error('Invalid payload - missing Body/From fields');
      return res.status(400).json({ 
        error: 'Invalid Twilio webhook format',
        received: req.body 
      });
    }

    const phoneNumber = sender.replace('whatsapp:', '');
    console.log(`Processing message from ${phoneNumber}: "${incomingMsg}"`);

    // Debug: Simulate different message flows
    if (incomingMsg.toLowerCase() === 'hello') {
      console.log('DEBUG: Triggering welcome message flow');
    }

    const response = await handleWhatsAppMessage(phoneNumber, incomingMsg);
    console.log('Generated response:', response);

    if (!response) {
      console.warn('Empty response generated - falling back to default');
      return res.status(200).send(); // Twilio expects 200 even if we don't reply
    }

    await messaging.sendWhatsAppMessage(sender, response);
    console.log('Response sent successfully');
    res.status(200).send();

  } catch (error) {
    console.error('!!! CRITICAL ERROR !!!');
    console.error('Error:', error.stack);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    // More informative error response
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  handleIncomingMessage
};