// src/controllers/auth.controller.js
const { v4: uuidv4 } = require('uuid');
const apikeyModel = require('../models/apikey.model');
const { generateApiKey } = require('../utils/crypto');

const API_KEY_TTL_DAYS = Number(process.env.API_KEY_TTL_DAYS || 365);

async function register(req, res, next) {
  try {
    const { app_name, metadata } = req.body;
    if (!app_name) return res.status(400).json({ error: 'app_name is required' });

    const id = uuidv4();
    const api_key = generateApiKey();
    const expires_at = new Date(Date.now() + API_KEY_TTL_DAYS * 24 * 3600 * 1000);

    const created = await apikeyModel.createApiKey({ id, app_name, api_key, expires_at, metadata });
    return res.json({ id: created.id, app_name: created.app_name, api_key: created.api_key, expires_at: created.expires_at });
  } catch (err) { next(err); }
}

async function getApiKey(req, res, next) {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const row = await apikeyModel.findById(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({ id: row.id, app_name: row.app_name, api_key: row.api_key, expires_at: row.expires_at, revoked: row.revoked });
  } catch (err) { next(err); }
}

async function revoke(req, res, next) {
  try {
    const { api_key } = req.body;
    if (!api_key) return res.status(400).json({ error: 'api_key required' });
    const revoked = await apikeyModel.revokeKey(api_key);
    res.json({ revoked: !!revoked, api_key: revoked ? revoked.api_key : api_key });
  } catch (err) { next(err); }
}

module.exports = { register, getApiKey, revoke };
