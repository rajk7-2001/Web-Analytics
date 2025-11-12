// src/models/event.model.js
const db = require('../db');

async function insertEvent({
  id, app_id, event_type, url, referrer, device, ip_address, timestamp, metadata = {}
}) {
  const res = await db.query(
    `INSERT INTO events(id, app_id, event_type, url, referrer, device, ip_address, timestamp, metadata)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [id, app_id, event_type, url, referrer, device, ip_address, timestamp, metadata]
  );
  return res.rows[0];
}
async function countEventsByType({ event, startDate, endDate, app_id }) {
  const params = [];
  let where = `WHERE event_type = $1`;
  params.push(event);

  if (app_id) {
    params.push(app_id);
    where += ` AND app_id = $${params.length}`;
  }
  if (startDate) {
    params.push(startDate);
    where += ` AND timestamp >= $${params.length}`;
  }
  if (endDate) {
    params.push(endDate);
    where += ` AND timestamp <= $${params.length}`;
  }

  // ✅ Fixed query — no outer alias using metadata
  const sql = `
    SELECT 
      COUNT(*)::int AS count,
      COUNT(DISTINCT sub.user_id)::int AS unique_users,
      jsonb_object_agg(sub.device, sub.device_count) AS device_data
    FROM (
      SELECT 
        device,
        COUNT(*) AS device_count,
        COALESCE(metadata->>'userId', 'unknown') AS user_id
      FROM events
      ${where}
      GROUP BY device, metadata->>'userId'
    ) AS sub;
  `;

  console.log("🧩 Running analytics query:", sql, params);

  const res = await db.query(sql, params);
  return res.rows[0];
}

async function getUserStats(userId) {
  const res = await db.query(
    `SELECT COUNT(*)::int AS total_events,
            MAX(metadata->>'browser') as browser,
            MAX(metadata->>'os') as os,
            MAX(ip_address) as ip_address
     FROM events
     WHERE metadata->>'userId' = $1`, [userId]
  );
  return res.rows[0];
}

module.exports = {
  insertEvent, countEventsByType, getUserStats
};
