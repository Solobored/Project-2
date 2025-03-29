const Order = require('../models/order');
const Product = require('../models/product');
const ErrorResponse = require('../utils/errorResponse');
const { check, validationResult } = require('express-validator');

exports.validateOrderCreation = [
  check('products').isArray({ min: 1 }).withMessage('At least one product is required'),
  check('products.*.product').isMongoId().withMessage('Invalid product ID format'),
  check('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  check('paymentMethod').notEmpty().withMessage('Payment method is required')
];

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    if (!order) {
      return next(new ErrorResponse(`Order not found with id ${req.params.id}`, 404));
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this order', 401));
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// In controllers/order.js
// Fix the createOrder function to handle the case when products aren't found
exports.createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const productIds = req.body.products.map(p => p.product);
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No products found with the provided IDs"
      });
    }
    
    let totalAmount = 0;
    const orderProducts = req.body.products.map(orderProduct => {
      const product = products.find(p => p._id.toString() === orderProduct.product);
      if (!product) {
        throw new ErrorResponse(`Product not found: ${orderProduct.product}`, 404);
      }
      
      totalAmount += product.price * orderProduct.quantity;
      
      return {
        product: orderProduct.product,
        quantity: orderProduct.quantity,
        price: product.price
      };
    });

    const orderData = {
      user: req.user.id,
      products: orderProducts,
      totalAmount,
      paymentMethod: req.body.paymentMethod
    };

    const order = await Order.create(orderData);
    
    res.status(201).json({ 
      success: true, 
      data: await Order.populate(order, [
        { path: 'user', select: 'name email' },
        { path: 'products.product', select: 'name price' }
      ])
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(new ErrorResponse(`Order not found with id ${req.params.id}`, 404));
    }

    const { status } = req.body;
    if (!status || !Order.schema.path('status').enumValues.includes(status)) {
      return next(new ErrorResponse('Invalid status value', 400));
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    res.status(200).json({ 
      success: true, 
      data: updatedOrder 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(new ErrorResponse(`Order not found with id ${req.params.id}`, 404));
    }

    await Order.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (err) {
    next(err);
  }
};