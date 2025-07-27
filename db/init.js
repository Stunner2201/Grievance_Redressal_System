// db/init.js
const fs = require('fs');
const path = require('path');

// Read the SQL schema file
const initScript = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

module.exports = initScript;