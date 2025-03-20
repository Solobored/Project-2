const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "A simple Express API with MongoDB",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" ? "https://your-render-app.onrender.com" : "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
}

const specs = swaggerJsDoc(options)

module.exports = { swaggerUi, specs }

