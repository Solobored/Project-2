const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

// Add some logging to help diagnose the issue
console.log('Current Environment:', process.env.NODE_ENV);
console.log('Swagger Server URL:', 
  process.env.NODE_ENV === 'production'
    ? 'https://project-2-xgs8.onrender.com'
    : 'http://localhost:5000'
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "A simple Express API with MongoDB and OAuth authentication",
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://project-2-xgs8.onrender.com'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        googleOAuth: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: "/api/auth/google",
              tokenUrl: "/api/auth/google/callback",
              scopes: {
                "profile": "Access user profile",
                "email": "Access user email"
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints",
      },
      {
        name: "Products",
        description: "Product management endpoints",
      },
      {
        name: "Orders",
        description: "Order management endpoints",
      },
    ],
  },
  apis: ["./routes/*.js"],
}

// Add error handling for Swagger spec generation
let specs;
try {
  specs = swaggerJsDoc(options);
  console.log('Swagger specs generated successfully');
} catch (error) {
  console.error('Error generating Swagger specs:', error);
  specs = {}; // Provide a fallback
}

module.exports = { swaggerUi, specs }