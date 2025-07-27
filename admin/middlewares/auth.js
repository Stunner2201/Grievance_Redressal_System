const db = require('../../db');
const { log } = require('../../utils/logger');
const jwt = require('jsonwebtoken');

const TEST_CREDENTIALS = {
  admin: {
    password: 'admin123',
    is_superadmin: true,
    department_id: null
  }
};

// Helper function to parse auth header
function parseAuthHeader(authHeader) {
  if (!authHeader) return null;
  const encoded = authHeader.replace(/^(basic|Bearer)\s+/i, '');
  try {
    return Buffer.from(encoded, 'base64').toString('utf8').split(':');
  } catch (e) {
    return null;
  }
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.admin_id || user.id,
      username: user.username,
      role: user.is_superadmin ? 'admin' : 'officer',
      department: user.department_id
    },
    process.env.JWT_SECRET || 'fallback-secret-123',
    { expiresIn: '8h' }
  );
}

// Main authentication middleware
module.exports = async (req, res, next) => {
  // Skip auth for whitelisted paths
  const skipPaths = ['/whatsapp-webhook', '/health', '/test', '/admin/complaints/login'];
  if (skipPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Development bypass
  if (process.env.NODE_ENV === 'development' && !req.headers.authorization) {
    req.user = TEST_CREDENTIALS.admin;
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Handle JWT Bearer token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-123');
      req.user = {
        admin_id: decoded.id,
        username: decoded.username,
        is_superadmin: decoded.role === 'admin',
        department_id: decoded.department
      };
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // Handle Basic Auth
  const credentials = parseAuthHeader(authHeader);
  if (!credentials || credentials.length !== 2) {
    return res.status(401).json({ error: 'Invalid Authorization format' });
  }

  try {
    // Check test credentials
    if (TEST_CREDENTIALS[credentials[0]]?.password === credentials[1]) {
      req.user = TEST_CREDENTIALS[credentials[0]];
      return next();
    }

    // Database check
    const result = await db.pool.query(
      `SELECT admin_id, username, is_superadmin, department_id
       FROM admin_users
       WHERE username = $1 AND password_hash = crypt($2, password_hash)`,
      [credentials[0], credentials[1]]
    );

    if (!result.rows.length) {
      log(`Failed login for ${credentials[0]}`, 'warn');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    log(`Auth error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Authentication system error' });
  }
};

// Login handler (to be used in your complaints route)
module.exports.handleLogin = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  const credentials = parseAuthHeader(authHeader);
  if (!credentials || credentials.length !== 2) {
    return res.status(401).json({ error: 'Invalid credentials format' });
  }

  try {
    // Check test credentials
    if (TEST_CREDENTIALS[credentials[0]]?.password === credentials[1]) {
      const token = generateToken(TEST_CREDENTIALS[credentials[0]]);
      return res.json({
        success: true,
        token,
        user: {
          username: credentials[0],
          role: 'admin',
          department: null
        }
      });
    }

    // Database check
    const result = await db.pool.query(
      `SELECT admin_id, username, is_superadmin, department_id
       FROM admin_users
       WHERE username = $1 AND password_hash = crypt($2, password_hash)`,
      [credentials[0], credentials[1]]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        role: user.is_superadmin ? 'admin' : 'officer',
        department: user.department_id
      }
    });
  } catch (error) {
    log(`Login error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Authentication system error' });
  }
};