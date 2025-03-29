// Create a simple app.js file to handle Render's health checks
import express from "express"

const app = express()

// Simple health check endpoint
app.get("/", (req, res) => {
  res.send("API is running...")
})

export default app

