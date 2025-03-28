const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("./config/passport")
const connectDB = require("./config/db.config")
const { swaggerUi, specs } = require("./swagger")
const errorHandler = require("./middleware/error")
const cors = require('cors');


app.use(cors({
  origin: [
    'http://localhost:5000',  
    'https://your-render-deployment-url.onrender.com',  
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

require('dotenv').config();

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// In server.js, add this before your routes
app.use(express.urlencoded({ extended: true }));

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
      <li>
        <h3>Register a new user</h3>
        <form id="registerForm">
          <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">Register</button>
        </form>
        <div id="registerResult"></div>
        
        <script>
          document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
              const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
              });
              
              const data = await response.json();
              document.getElementById('registerResult').textContent = JSON.stringify(data, null, 2);
              
              if (data.success) {
                alert('Registration successful!');
                window.location.reload();
              }
            } catch (error) {
              console.error('Error:', error);
              document.getElementById('registerResult').textContent = 'An error occurred during registration';
            }
          });
        </script>
      </li>
      
      <li>
        <h3>Login</h3>
        <form id="loginForm">
          <div>
            <label for="loginEmail">Email:</label>
            <input type="email" id="loginEmail" name="email" required>
          </div>
          <div>
            <label for="loginPassword">Password:</label>
            <input type="password" id="loginPassword" name="password" required>
          </div>
          <button type="submit">Login</button>
        </form>
        <div id="loginResult"></div>
        
        <script>
          document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
              const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
              });
              
              const data = await response.json();
              document.getElementById('loginResult').textContent = JSON.stringify(data, null, 2);
              
              if (data.success) {
                alert('Login successful!');
                window.location.reload();
              }
            } catch (error) {
              console.error('Error:', error);
              document.getElementById('loginResult').textContent = 'An error occurred during login';
            }
          });
        </script>
      </li>
      
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

