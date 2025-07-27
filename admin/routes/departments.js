// admin/routes/departments.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/departments');
// const departmentAuth = require('../../middlewares/department-auth');

// Make sure controller methods exist and are functions
router.get('/stats/all', controller.getAllDepartmentStats); 
router.get('/:departmentId/stats',controller.getDepartmentStats);
router.get('/:departmentId/analytics', controller.getAnalytics);

module.exports = router;