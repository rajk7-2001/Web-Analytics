// src/controllers/analytics.controller.js
const { v4: uuidv4 } = require('uuid');
const eventModel = require('../models/event.model');
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: +process.env.REDIS_PORT || 6379
});

async function collect(req, res, next) {
  try {
    const body = req.body;
    if (!body.event) return res.status(400).json({ error: 'event is required' });

    const ev = {
      id: uuidv4(),
      app_id: req.appKey.id,
      event_type: body.event,
      url: body.url,
      referrer: body.referrer,
      device: body.device || 'unknown',
      ip_address: body.ipAddress || req.ip,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      metadata: body.metadata || {}
    };

    const inserted = await eventModel.insertEvent(ev);
    await redis.del(`event_summary:${ev.event_type}`);
    res.status(201).json({ success: true, id: inserted.id });
  } catch (err) { next(err); }
}

async function eventSummary(req, res, next) {
  try {
    const { event, startDate, endDate, app_id } = req.query;
    if (!event) return res.status(400).json({ error: 'event query param required' });

    const cacheKey = `event_summary:${event}:${startDate || ''}:${endDate || ''}:${app_id || ''}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const data = await eventModel.countEventsByType({
      event,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      app_id
    });

    const response = {
      event,
      count: data.count || 0,
      uniqueUsers: data.unique_users || 0,
      deviceData: data.device_data || {}
    };

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60);
    res.json(response);
  } catch (err) { next(err); }
}

async function userStats(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const cacheKey = `user_stats:${userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const stats = await eventModel.getUserStats(userId);
    const response = {
      userId,
      totalEvents: stats.total_events || 0,
      deviceDetails: {
        browser: stats.browser || null,
        os: stats.os || null
      },
      ipAddress: stats.ip_address || null
    };

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 30);
    res.json(response);
  } catch (err) { next(err); }
}

module.exports = { collect, eventSummary, userStats };
