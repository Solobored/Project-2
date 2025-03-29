
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db.config");
const { swaggerUi, specs } = require("./swagger");
const errorHandler = require("./middleware/error");

// Connect to database first
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport initialization
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "https://project-2-xgs8.onrender.com" 
      : "http://localhost:5000",
    credentials: true
  })
);

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Mount routers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/google-auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/users", require("./routes/user"));

// Home route 
app.get("/", (req, res) => {
  res.send(`
    <style>
      body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
      h1, h2, h3 { color: #333; }
      .container { display: flex; flex-wrap: wrap; gap: 2rem; }
      .card { border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      form { display: flex; flex-direction: column; gap: 1rem; }
      input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
      button { padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; }
      button:hover { background: #4338ca; }
      .result { margin-top: 1rem; padding: 1rem; background: #f9fafb; border-radius: 4px; }
      .links { margin-top: 2rem; }
      .links a { display: block; margin: 0.5rem 0; color: #4f46e5; text-decoration: none; }
      .links a:hover { text-decoration: underline; }
    </style>
    
    <h1>E-commerce API</h1>
    <p>Welcome to the E-commerce API</p>
    
    <div class="container">
      <div class="card">
        <h3>Register a new user</h3>
        <form id="registerForm">
          <input type="text" id="name" name="name" placeholder="Name" required>
          <input type="email" id="email" name="email" placeholder="Email" required>
          <input type="password" id="password" name="password" placeholder="Password" required>
          <button type="submit">Register</button>
        </form>
        <div id="registerResult" class="result"></div>
        
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
      </div>
      
      <div class="card">
        <h3>Login</h3>
        <form id="loginForm">
          <input type="email" id="loginEmail" name="email" placeholder="Email" required>
          <input type="password" id="loginPassword" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <div id="loginResult" class="result"></div>
        
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
      </div>
    </div>
    
    <div class="links">
      <h2>Available Endpoints:</h2>
      <a href="/api/auth/me">/api/auth/me</a> - Get current user (protected)
      <a href="/api/auth/logout">/api/auth/logout</a> - Logout
      <a href="/api/auth/google">/api/auth/google</a> - Login with Google
      <a href="/api/products">/api/products</a> - Get all products
      <a href="/api/orders">/api/orders</a> - Get all orders (protected)
      <a href="/api-docs">/api-docs</a> - API Documentation
    </div>
  `);
});

// Error handling middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`Home route: http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});