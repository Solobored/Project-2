const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("./config/passport")
const connectDB = require("./config/db.config")
const { swaggerUi, specs } = require("./swagger")
const errorHandler = require("./middleware/error")

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  }),
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Enable CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "https://project-2-xgs8.onrender.com" : "http://localhost:5000",
    credentials: true,
  }),
)

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// Mount routers
app.use("/api/auth", require("./routes/auth"))
app.use("/api/auth", require("./routes/google-auth")) // Add Google OAuth routes
app.use("/api/products", require("./routes/product"))
app.use("/api/orders", require("./routes/order"))

// Home route with more detailed information
app.get("/", (req, res) => {
  res.send(`
    <h1>E-commerce API</h1>
    <p>Welcome to the E-commerce API</p>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><a href="/api/auth/register">/api/auth/register</a> - Register a new user</li>
      <li><a href="/api/auth/login">/api/auth/login</a> - Login</li>
      <li><a href="/api/auth/me">/api/auth/me</a> - Get current user (protected)</li>
      <li><a href="/api/auth/logout">/api/auth/logout</a> - Logout</li>
      <li><a href="/api/auth/google">/api/auth/google</a> - Login with Google</li>
      <li><a href="/api/products">/api/products</a> - Get all products</li>
      <li><a href="/api/orders">/api/orders</a> - Get all orders (protected)</li>
      <li><a href="/api-docs">/api-docs</a> - API Documentation</li>
    </ul>
  `)
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  // server.close(() => process.exit(1));
})

