const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'igotskills-analytics API',
      version: '1.0.0',
      description: 'Unified Event Analytics Engine - API documentation'
    },
    servers: [
      { url: process.env.SWAGGER_BASE_URL || `'https://analytics-backend-xz2s.onrender.com'` }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'] // scanned for JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
