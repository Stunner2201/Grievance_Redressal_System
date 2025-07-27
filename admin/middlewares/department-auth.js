const basicAuth = require('basic-auth');
const db = require('../db');

module.exports = async (req, res, next) => {
  const user = basicAuth(req);
  
  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Department Authorization');
    return res.sendStatus(401);
  }

  try {
    const { rows } = await db.pool.query(`
      SELECT du.department_id, d.department_name
      FROM department_users du
      JOIN departments d ON du.department_id = d.department_id
      WHERE du.username = $1 AND du.password = crypt($2, du.password)
    `, [user.name, user.pass]);

    if (rows.length === 0) {
      res.set('WWW-Authenticate', 'Basic realm=Department Authorization');
      return res.sendStatus(401);
    }

    req.user = {
      name: rows[0].department_name,
      role: 'department',
      departmentId: rows[0].department_id
    };
    next();
  } catch (error) {
    console.error('Department auth error:', error);
    res.sendStatus(500);
  }
};