// src/server.js
const app = require('./app');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

async function ensureTables() {
  try {
    const initSql = fs.readFileSync(path.join(__dirname, '..', 'init-db.sql'), 'utf8');
    await db.query(initSql);
    console.log('DB tables ensured');
  } catch (err) {
    console.error('Error ensuring DB tables', err);
  }
}

(async () => {
  await ensureTables();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
