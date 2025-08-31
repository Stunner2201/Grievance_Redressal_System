module.exports = {
  departments: [
    {
      id: 1,
      name: "Public Works Department (PWD)",
      keywords: ["road", "pothole", "bridge", "construction"],
      emoji: "🛣️"
    },
    {
      id: 2, 
      name: "Municipal Corporation",
      keywords: ["garbage", "water", "sanitation", "drainage"],
      emoji: "🚮"
    },
    {
      id: 3,
      name: "Electricity Department",
      keywords: ["electric", "power", "transformer", "street light"],
      emoji: "💡"
    },
    {
      id: 4,
      name: "Health Department",
      keywords: ["hospital", "doctor", "medicine", "vaccine"],
      emoji: "🏥"
    },
    {
      id: 5,
      name: "Police Department",
      keywords: ["police", "crime", "theft", "accident"],
      emoji: "👮"
    }
  ],

  statuses: {
    pending: { text: "Pending", emoji: "⏳" },
    in_progress: { text: "In Progress", emoji: "🔧" },
    resolved: { text: "Resolved", emoji: "✅" },
    rejected: { text: "Rejected", emoji: "❌" }
  },

  quickReplies: {
    confirm: ["Yes", "No"],
    departments: ["1. PWD", "2. Municipal", "3. Electricity", "4. Health", "5. Police"]
  },

  statusUpdateTemplates: {
    pending: (ticketId) => 
      `🔄 Complaint #${ticketId} is now PENDING\n\n` +
      `Our team has received your complaint and will review it shortly.`,

    inProgress: (ticketId, officer) =>
      `🛠️ Complaint #${ticketId} is IN PROGRESS\n\n` +
      `Officer ${officer} is working on your case.\n` +
      `Expected resolution within 3-5 working days.`,

    resolved: (ticketId, notes, officer, department) => 
            `✅ *Complaint Resolved* (${department})\n\n` +
            `Ticket ID: ${ticketId}\n` +
            `Status: Resolved\n` +
            (officer ? `Resolved by: ${officer}\n` : '') +
            (notes ? `Resolution Details:\n${notes}\n\n` : '\n') +
            `Thank you for using Rohtak Grievance System.\n\n` +
            `Rate our service: https://example.com/feedback/${ticketId}`,

    rejected: (ticketId, reason) =>
      `❌ Complaint #${ticketId} has been REJECTED\n\n` +
      `Reason: ${reason || 'Not provided'}\n\n` +
      `Please contact support if you have questions.`
  }
};