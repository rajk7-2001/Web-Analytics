// src/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: +process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'analytics'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
