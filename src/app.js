// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());

app.options('*', cors());
app.use(express.json({ limit: '1mb' }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.json({ ok: true, service: 'igotskills-analytics' }));

const authRoutes = require('./routes/auth.routes');
const analyticsRoutes = require('./routes/analytics.routes');


app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
