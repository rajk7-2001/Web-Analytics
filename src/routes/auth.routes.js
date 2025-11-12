const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API Key Management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new app and generate API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               app_name:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: API key created
 */
router.post('/register', authCtrl.register);

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     tags: [Auth]
 *     summary: Retrieve API key by id
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: API key info
 */
router.get('/api-key', authCtrl.getApiKey);

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     tags: [Auth]
 *     summary: Revoke an API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *     responses:
 *       200:
 *         description: Key revoked
 */
router.post('/revoke', authCtrl.revoke);

module.exports = router;
