const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrder, 
  createOrder, 
  updateOrder, 
  deleteOrder 
} = require('../controllers/order');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all customer orders
 *     responses:
 *       200:
 *         description: A list of orders
 *       500:
 *         description: Server error
 */
router.get('/', getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieve a single order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getOrder);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Add a new customer order to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - products
 *               - totalAmount
 *               - paymentMethod
 *             properties:
 *               customer:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       zipCode:
 *                         type: string
 *                       country:
 *                         type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               totalAmount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     description: Update an order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               customer:
 *                 type: object
 *               products:
 *                 type: array
 *               totalAmount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Delete an order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteOrder);

module.exports = router;