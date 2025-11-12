// src/models/apikey.model.js
const db = require('../db');

async function createApiKey({ id, app_name, api_key, expires_at, metadata = {} }) {
  const res = await db.query(
    `INSERT INTO api_keys(id, app_name, api_key, expires_at, metadata) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [id, app_name, api_key, expires_at, metadata]
  );
  return res.rows[0];
}

async function findByKey(api_key) {
  const res = await db.query(`SELECT * FROM api_keys WHERE api_key=$1 LIMIT 1`, [api_key]);
  return res.rows[0];
}

async function findById(id) {
  const res = await db.query(`SELECT * FROM api_keys WHERE id=$1 LIMIT 1`, [id]);
  return res.rows[0];
}

async function revokeKey(api_key) {
  const res = await db.query(`UPDATE api_keys SET revoked=true WHERE api_key=$1 RETURNING *`, [api_key]);
  return res.rows[0];
}

async function regenerateKey(id, newKey, newExpiry) {
  const res = await db.query(
    `UPDATE api_keys SET api_key=$1, expires_at=$2, revoked=false WHERE id=$3 RETURNING *`,
    [newKey, newExpiry, id]
  );
  return res.rows[0];
}

module.exports = {
  createApiKey, findByKey, revokeKey, regenerateKey, findById
};
