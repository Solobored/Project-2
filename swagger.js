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
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://project-2-xgs8.onrender.com' // Your Render URL
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
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

const specs = swaggerJsDoc(options)

module.exports = { swaggerUi, specs }

