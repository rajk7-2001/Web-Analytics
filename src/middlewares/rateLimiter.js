// src/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

const createLimiter = (opts = {}) => rateLimit({
  windowMs: opts.windowMs || 60 * 1000,
  max: opts.max || 200,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { createLimiter };
