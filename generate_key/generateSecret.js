// generateSecret.js
const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret Key:', secretKey);