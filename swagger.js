const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "Production-ready API with OAuth",
    },
    servers: [
      {
        url: "https://project-2-xgs8.onrender.com",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Authentication", description: "User auth endpoints" },
      { name: "Products", description: "Product management" },
      { name: "Orders", description: "Order processing" },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
module.exports = { swaggerUi, specs };