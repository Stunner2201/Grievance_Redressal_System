const colors = {
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    debug: '\x1b[35m',
    reset: '\x1b[0m'
};

module.exports = {
    log: (message, level = 'info') => {
        const timestamp = new Date().toISOString();
        const color = colors[level] || colors.info;
        console.log(`${color}[${timestamp}] [${level.toUpperCase()}] ${message}${colors.reset}`);
    }
};