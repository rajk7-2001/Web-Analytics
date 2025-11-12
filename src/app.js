// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


dotenv.config();

const authRoutes = require('./routes/auth.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ ok: true, service: 'igotskills-analytics' }));

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
