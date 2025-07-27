// db/index.js
const { Pool } = require('pg');
const initScript = require('./init.js');
require('dotenv').config(); // Ensure environment variables are loaded

// Validate and set default database configuration
const dbConfig = {
  user: process.env.PG_USER || 'postgres', // Default PostgreSQL username
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'postgres', // Default maintenance database
  password: process.env.PG_PASSWORD !== undefined ? process.env.PG_PASSWORD : '', // Explicit empty string if undefined
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432, // Ensure port is number
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Debug: Log the configuration (remove in production)
console.log('Database configuration:', {
  ...dbConfig,
  password: dbConfig.password ? '*****' : '(empty)'
});

const pool = new Pool(dbConfig);

// Event listeners for connection monitoring
pool.on('connect', () => console.log('Database connected'));
pool.on('error', err => console.error('Database error:', err));
pool.on('remove', () => console.log('Client removed from pool'));

const initializeDatabase = async () => {
  let client;
  try {
    // Test basic connection first
    client = await pool.connect();
    await client.query('SELECT NOW()');
    console.log('Database connection test successful');
    
    // Run initialization script if provided
    if (initScript) {
      await client.query(initScript);
      console.log('Database initialized successfully');
    }
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initializeDatabase
};