const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaints');
const authMiddleware = require('../middlewares/auth');

// Authentication
// router.post('/complaints/login', authMiddleware.handleLogin);

// Complaints routes
router.get('/complaints', complaintsController.getAllComplaints);
router.get('/complaints/:ticketId', complaintsController.getComplaint);
router.put('/complaints/:ticketId/status', complaintsController.updateStatus);

// User management
router.post('/complaints/users', async (req, res) => {
  // ... keep your existing user creation code ...
});

module.exports = router;