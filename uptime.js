const axios = require('axios');
const logger = require('./utils/log');

function startKeepAlive() {
  const url = 'https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co';
  
  // Also try to get local address if available
  const localUrl = 'http://localhost:3000';

  setInterval(async () => {
    try {
      await axios.get(localUrl);
      // logger.log('Keep-alive ping successful (local)', 'UPTIME');
    } catch (err) {
      // logger.log('Keep-alive ping failed (local)', 'UPTIME');
    }
  }, 1000 * 60 * 5); // Every 5 minutes
}

module.exports = startKeepAlive;
