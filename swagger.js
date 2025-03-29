const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.1",
      description: "Full-featured E-commerce API with OAuth authentication and order management"
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" 
          ? "https://project-2-xgs8.onrender.com" 
          : "http://localhost:5000",
        description: process.env.NODE_ENV === "production" 
          ? "Production server" 
          : "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };