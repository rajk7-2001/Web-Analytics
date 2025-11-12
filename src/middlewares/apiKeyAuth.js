// src/middlewares/apiKeyAuth.js
const apikeyModel = require('../models/apikey.model');

async function apiKeyAuth(req, res, next) {
  try {
    const key = req.header('x-api-key') || req.query.api_key;
    if (!key) return res.status(401).json({ error: 'API key required' });

    const row = await apikeyModel.findByKey(key);
    if (!row || row.revoked) return res.status(403).json({ error: 'Invalid or revoked API key' });

    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      return res.status(403).json({ error: 'API key expired' });
    }

    req.appKey = row;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = apiKeyAuth;
