# Unified Event Analytics Engine  
**A scalable backend API for collecting, analyzing, and reporting website & mobile app events.**

## Overview
The **Unified Event Analytics Engine** is a backend system built using **Node.js (Express)**, **PostgreSQL**, and **Swagger** for real-time analytics tracking. It allows any website or mobile app to register and collect user events like clicks, page visits, referrer data, and device details — all under a secure API key management system.

This project implements end-to-end functionality for event ingestion, aggregation, and reporting with rate limiting, caching, and containerized deployment.

## Key Features
### API Key Management
- Register apps or websites to obtain an API key (`/api/auth/register`)
- Retrieve existing API key details (`/api/auth/api-key`)
- Revoke API keys to disable access (`/api/auth/revoke`)
- Expiry handling and revocation tracking

### Analytics Event Collection
- Submit event data securely via `x-api-key` header (`/api/analytics/collect`)
- Records metadata such as: Event type, URL, Referrer, Device type, IP address, Timestamp, Browser & OS details

### Analytics & Reporting
- **Event Summary API** (`/api/analytics/event-summary`): Aggregates events by type, device, and unique users.
- **User Stats API** (`/api/analytics/user-stats`): Returns event activity per user, including device/browser breakdown.

### Technical Implementations
- **Express.js + PostgreSQL (pg)** for scalable data storage
- **Redis-ready** caching (disabled on Render using `REDIS_HOST=none`)
- **Rate Limiting** via `express-rate-limit`
- **Swagger UI** (`/docs`) for live API testing
- **Dockerized Deployment**
- **Helmet + CORS** for security
- Auto table creation on server start (`init-db.sql`)

## Technologies Used
| Technology | Purpose |
|-------------|----------|
| Node.js + Express | Backend API framework |
| PostgreSQL | Persistent event storage |
| ioredis | (Optional) Caching layer |
| Swagger UI | API documentation and testing |
| Docker | Containerization |
| Render | Cloud hosting |
| Helmet + CORS | Security & cross-origin control |

## Instructions to Run the Project Locally
### Prerequisites
- Node.js v18+
- Docker and Docker Compose installed
- PostgreSQL (if not using Docker)
- Redis (optional)

### Steps to Run
#### 1️. Clone the Repository
```bash
git clone https://github.com/rajk7-2001/Web-Analytics.git
```

#### 2. Run with Docker
```bash
docker-compose up --build
```
Server → [http://localhost:3000](http://localhost:3000)  
Swagger → [http://localhost:3000/docs](http://localhost:3000/docs)

## Deployment
**🔗 Live Deployment URL:**  
[https://analytics-backend-xz2s.onrender.com](https://analytics-backend-xz2s.onrender.com)  
**Swagger Docs:**  
[https://analytics-backend-xz2s.onrender.com/docs](https://analytics-backend-xz2s.onrender.com/docs)

## API Endpoints Summary
| Method | Endpoint | Description | Auth |
|--------|-----------|--------------|------|
| POST | /api/auth/register | Register a new app and get API key | ❌ |
| GET | /api/auth/api-key | Retrieve API key info using `id` | ❌ |
| POST | /api/auth/revoke | Revoke an existing API key | ❌ |
| POST | /api/analytics/collect | Collect an event | ✅ x-api-key |
| GET | /api/analytics/event-summary | Get aggregated event summary | ❌ |
| GET | /api/analytics/user-stats | Get user-specific analytics | ❌ |

## Testing via Swagger
1. Visit: https://analytics-backend-xz2s.onrender.com/docs
2. Click **Authorize**
3. Enter your `x-api-key`
4. Try endpoints like `/api/analytics/collect`

## Challenges & Solutions
| Challenge | Solution |
|------------|-----------|
| CORS errors in Swagger UI | Implemented permissive CORS setup and handled preflight requests |
| Redis connection failures | Added `REDIS_HOST=none` mode |
| DB connection refused | Used Render internal `DATABASE_URL` with SSL config |
| Swagger not sending API key | Added `ApiKeyAuth` security scheme |
| Container networking issues | Used environment variables for internal networking |

## Future Enhancements
- Google OAuth onboarding for app registration
- Advanced analytics & dashboards
- ClickHouse / BigQuery integration
- UI dashboard for visualization

