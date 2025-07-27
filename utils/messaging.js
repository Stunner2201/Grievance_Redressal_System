const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = (to, body) => {
  return client.messages.create({
    body: body,
    from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
    to: to
  });
};

const generateTicketId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'RTK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = {
  sendWhatsAppMessage,
  generateTicketId,
};