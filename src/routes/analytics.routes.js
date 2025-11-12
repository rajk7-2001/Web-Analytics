const express = require('express');
const router = express.Router();
const analyticsCtrl = require('../controllers/analytics.controller');
const apiKeyAuth = require('../middlewares/apiKeyAuth');
const { createLimiter } = require('../middlewares/rateLimiter');

const ingestLimiter = createLimiter({ windowMs: 60*1000, max: 500 });

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Event ingestion and reporting
 */

/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     tags: [Analytics]
 *     summary: Submit an analytics event
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               url:
 *                 type: string
 *               referrer:
 *                 type: string
 *               device:
 *                 type: string
 *               ipAddress:
 *                 type: string
 *               timestamp:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Event recorded
 */
router.post('/collect', ingestLimiter, apiKeyAuth, analyticsCtrl.collect);

/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     tags: [Analytics]
 *     summary: Get aggregated event summary
 *     parameters:
 *       - in: query
 *         name: event
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: app_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event aggregation
 */
router.get('/event-summary', createLimiter({ windowMs: 60*1000, max: 60 }), analyticsCtrl.eventSummary);

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     tags: [Analytics]
 *     summary: Get user stats by userId
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User stats
 */
router.get('/user-stats', createLimiter({ windowMs: 60*1000, max: 60 }), analyticsCtrl.userStats);

module.exports = router;
