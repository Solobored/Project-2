const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "A simple Express API with MongoDB and OAuth authentication",
    },
       servers: [{
         url: 'https://project-2-xgs8.onrender.com',
        description: 'Production server'
    }],
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

let specs;
try {
  specs = swaggerJsDoc(options);
  console.log('Swagger specs generated successfully');
} catch (error) {
  console.error('Error generating Swagger specs:', error);
  specs = {}; 
}

module.exports = { swaggerUi, specs }