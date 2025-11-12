// src/utils/crypto.js
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

function generateApiKey() {
  return uuidv4() + '.' + crypto.randomBytes(16).toString('hex');
}

module.exports = { generateApiKey };
