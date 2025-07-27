const db = require('../db');
const { log } = require('../utils/logger');
const templates = require('../templates/messages');

module.exports = {
  async sendStatusUpdate(phoneNumber, ticketId, status, notes = '', officer = '') {
    const notificationKey = `${phoneNumber}-${ticketId}-${status}`;
    if (this.recentNotifications?.has(notificationKey)) {
        return false;
    }
    try {
      // Get the complaint details for personalization
      const complaint = await db.query(
        `SELECT c.*, d.department_name 
         FROM complaints c
         JOIN departments d ON c.department_id = d.department_id
         WHERE c.ticket_id = $1`,
        [ticketId]
      );

      if (!complaint.rows.length) {
        throw new Error(`Complaint ${ticketId} not found`);
      }

      // Generate the message
      const message = this._formatStatusMessage(
        status,
        ticketId,
        complaint.rows[0].department_name,
        notes,
        officer,
        complaint.rows[0].description
      );

      // Log notification (for audit)
      await db.query(
        `INSERT INTO notifications 
         (complaint_id, phone_number, message, status)
         VALUES ($1, $2, $3, $4)`,
        [complaint.rows[0].complaint_id, phoneNumber, message, status]
      );
      if (!this.recentNotifications) {
        this.recentNotifications = new Set();
    }
    this.recentNotifications.add(notificationKey);
    if (this.recentNotifications.size > 1000) {
        this.recentNotifications = new Set();
    }

      // Send via WhatsApp
      await this._sendWhatsAppMessage(phoneNumber, message);

      log(`Status update sent to ${phoneNumber} for ticket ${ticketId}`);
      return true;
    } catch (error) {
      log(`Failed to send status update: ${error.message}`, 'error');
      return false;
    }
    
  },

  _formatStatusMessage(status, ticketId, department, notes, officer, description) {
    const statusMessages = {
      'Pending': `🔄 Your complaint #${ticketId} (${department}) has been received.`,
      'In Progress': `🛠️ Complaint #${ticketId} is being processed by ${officer || 'our team'}.`,
      'Resolved': `✅ Complaint #${ticketId} has been resolved!\n\nResolution: ${notes || 'Completed'}`,
      'Rejected': `❌ Complaint #${ticketId} cannot be processed.\nReason: ${notes || 'Not specified'}`
    };

    return [
      statusMessages[status] || `Status update for complaint #${ticketId}: ${status}`,
      `\n\nOriginal issue: ${description.substring(0, 100)}...`,
      `\n\nReply with "STATUS ${ticketId}" to check updates.`
    ].join('');
  },

  async _sendWhatsAppMessage(phoneNumber, message) {
    // Implement your WhatsApp provider integration here
    // Example for Twilio:
    
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`
    });
    
    console.log(`[WHATSAPP SIMULATION] To: ${phoneNumber}\nMessage: ${message}`);
  }
};