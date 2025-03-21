const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db.config');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));

app.get('/', (req, res) => {
  res.send(`
    <h1>E-commerce API</h1>
    <p>Welcome to the E-commerce API</p>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><a href="/api/products">/api/products</a> - Get all products</li>
      <li><a href="/api/orders">/api/orders</a> - Get all orders</li>
      <li><a href="/api-docs">/api-docs</a> - API Documentation</li>
    </ul>
  `);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
});