const db = require('../../db');
const notificationService = require('../../services/notification-service');
const { log } = require('../../utils/logger');

module.exports = {
    // Get all complaints (filterable)
    // Get all complaints (with enhanced debugging)
getAllComplaints: async (req, res) => {
    try {
      // Get optional query parameters for filtering
      const { department_id, status } = req.query;
      
      let query = `
        SELECT 
          c.*,
          d.department_name
        FROM complaints c
        JOIN departments d ON c.department_id = d.department_id
      `;
      
      const params = [];
      const whereClauses = [];
      
      // Add filters if provided
      if (department_id) {
        params.push(department_id);
        whereClauses.push(`c.department_id = $${params.length}`);
      }
      
      if (status) {
        params.push(status);
        whereClauses.push(`c.status = $${params.length}`);
      }
      
      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      
      query += ` ORDER BY c.created_at DESC`;
      
      const result = await db.pool.query(query, params);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      res.status(500).json({ 
        error: 'Failed to fetch complaints',
        details: error.message 
      });
    }
  },

  // Update in complaints.js
getComplaint: async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const result = await db.pool.query(`
      SELECT 
        c.*,
        d.department_name
        /* Removed user join since phone is already in complaints table */
      FROM complaints c
      JOIN departments d ON c.department_id = d.department_id
      /* Removed: JOIN users u ON c.user_id = u.user_id */
      WHERE c.ticket_id = $1
    `, [ticketId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch complaint',
      details: error.message,
      hint: 'Verify the complaint exists and check database schema'
    });
  }
},
getAvailableTicketIds: async () => {
  const res = await db.query('SELECT ticket_id FROM complaints LIMIT 10');
  return res.rows.map(r => r.ticket_id);
},

 updateStatus: async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status, notes, officer, request_id } = req.body;
        
        // Check if we recently processed this request
        if (req.app.locals.processedRequests?.has(request_id)) {
            return res.status(200).json({ message: "Request already processed" });
        }
        
        // Validate status
        if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        
        // Get complaint
        const complaintResult = await db.pool.query(
            `SELECT * FROM complaints WHERE ticket_id = $1`,
            [ticketId]
        );
        
        if (complaintResult.rows.length === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        
        const complaint = complaintResult.rows[0];
        
        // Update status
        const updateResult = await db.pool.query(`
            UPDATE complaints
            SET status = $1, 
                updated_at = NOW()
            WHERE ticket_id = $2
            RETURNING *
        `, [status, ticketId]);
        
        // Track this request
        if (!req.app.locals.processedRequests) {
            req.app.locals.processedRequests = new Set();
        }
        req.app.locals.processedRequests.add(request_id);
        
        // Clear old requests periodically
        if (req.app.locals.processedRequests.size > 100) {
            req.app.locals.processedRequests = new Set();
        }
        
        // Send WhatsApp notification only if status actually changed
        if (complaint.status !== status) {
            await notificationService.sendStatusUpdate(
                complaint.user_phone,
                ticketId,
                status,
                notes || '',
                officer || 'Admin'
            );
        }
        
        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ 
            error: 'Failed to update complaint status',
            details: error.message 
        });
    }
},
    getDepartmentStats: async (req, res) => {
    try {
        const departmentId = req.user.department_id || req.query.department_id;
        
        if (!departmentId) {
            return res.status(400).json({ 
                error: 'Department ID required',
                hint: 'Either set in user profile or provide ?department_id='
            });
        }

        // 1. Basic Stats
        const statsRes = await db.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'Pending') as pending,
                COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
                COUNT(*) FILTER (WHERE status = 'Resolved') as resolved,
                ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600), 2) as avg_hours
            FROM complaints
            WHERE department_id = $1
        `, [departmentId]);

        // 2. Ward Distribution
        const wardRes = await db.query(`
            SELECT 
                u.ward_number,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE c.status = 'Pending') as pending,
                COUNT(*) FILTER (WHERE c.status = 'Resolved') as resolved
            FROM complaints c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.department_id = $1
            GROUP BY u.ward_number
            ORDER BY pending DESC
        `, [departmentId]);

        // 3. Recent Complaints
        const recentRes = await db.query(`
            SELECT 
                c.ticket_id, 
                c.status, 
                LEFT(c.description, 50) || '...' as description,
                c.created_at, 
                u.ward_number
            FROM complaints c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.department_id = $1
            ORDER BY c.created_at DESC
            LIMIT 5
        `, [departmentId]);

        // 4. Department Info
        const deptRes = await db.query(`
            SELECT department_name, description 
            FROM departments 
            WHERE department_id = $1
        `, [departmentId]);

        res.json({
            department: deptRes.rows[0] || {},
            statistics: statsRes.rows[0] || {},
            ward_distribution: wardRes.rows,
            recent_complaints: recentRes.rows,
            last_updated: new Date().toISOString()
        });

    } catch (error) {
        console.error('Department stats error:', {
            message: error.message,
            stack: error.stack,
            query: error.query,
            parameters: error.parameters
        });
        res.status(500).json({ 
            error: 'Failed to get department stats',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
};