import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json" with { type: "json" }
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js"
import "./config/passport.js"

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://project-2-xgs8.onrender.com", "https://your-frontend-url.com"]
        : "http://localhost:3000",
    credentials: true,
  }),
)

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
)

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to E-Commerce API" })
})

// Error handler
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

