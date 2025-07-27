const db = require('../../db');

module.exports = {
  getDepartmentStats: async (req, res) => {
    try {
      const departmentId = req.params.departmentId || req.user.departmentId;
      
      const stats = await db.pool.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'Pending') as pending,
          COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
          COUNT(*) FILTER (WHERE status = 'Resolved') as resolved,
          ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600, 1) as avg_hours
        FROM complaints
        WHERE department_id = $1
      `, [departmentId]);
      
      const recent = await db.pool.query(`
        SELECT 
          c.ticket_id, c.status, c.description,
          u.ward_number, c.created_at
        FROM complaints c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.department_id = $1
        ORDER BY c.created_at DESC
        LIMIT 5
      `, [departmentId]);
      
      res.json({
        stats: stats.rows[0],
        recentComplaints: recent.rows
      });
    } catch (error) {
      console.error('Department stats error:', error);
      res.status(500).json({ error: 'Failed to load department stats' });
    }
  },

  getAnalytics: async (req, res) => {
    try {
      const departmentId = req.params.departmentId || req.user.departmentId;
      
      // Ward-wise distribution
      const wardStats = await db.pool.query(`
        SELECT 
          u.ward_number,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE c.status = 'Pending') as pending
        FROM complaints c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.department_id = $1
        GROUP BY u.ward_number
        ORDER BY total DESC
      `, [departmentId]);
      
      // Status trend (last 30 days)
      const trend = await db.pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) FILTER (WHERE status = 'Pending') as pending,
          COUNT(*) FILTER (WHERE status = 'Resolved') as resolved
        FROM complaints
        WHERE department_id = $1
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `, [departmentId]);
      
      res.json({
        wardStats: wardStats.rows,
        trend: trend.rows
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to load analytics' });
    }
  },
  getAllDepartmentStats: async (req, res) => {
  try {
    const result = await db.pool.query(`
      SELECT 
        d.department_id,
        d.department_name as department,
        COUNT(c.complaint_id)::INTEGER as total_complaints,
        SUM(CASE WHEN c.status = 'Pending' THEN 1 ELSE 0 END)::INTEGER as pending,
        SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END)::INTEGER as resolved,
        SUM(CASE WHEN c.status = 'In Progress' THEN 1 ELSE 0 END)::INTEGER as in_progress
      FROM departments d
      LEFT JOIN complaints c ON d.department_id = c.department_id
      GROUP BY d.department_id, d.department_name
      ORDER BY total_complaints DESC
    `);

    const stats = result.rows.map(dept => ({
      ...dept,
      resolution_rate: dept.total_complaints > 0 
        ? Math.round((dept.resolved / dept.total_complaints) * 100)
        : 0
    }));

    res.json(stats);
  } catch (error) {
    console.error('Department stats error:', error);
    res.status(500).json({ 
      error: 'Failed to get department statistics',
      details: error.message
    });
  }
}
};