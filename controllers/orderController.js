import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

  // Validation
  if (!orderItems || orderItems.length === 0) {
    res.status(400)
    throw new Error("No order items")
  }

  if (!shippingAddress || !paymentMethod) {
    res.status(400)
    throw new Error("Please add shipping address and payment method")
  }

  // Check if all products exist and have enough stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product)

    if (!product) {
      res.status(404)
      throw new Error(`Product not found: ${item.product}`)
    }

    if (product.countInStock < item.qty) {
      res.status(400)
      throw new Error(`Not enough stock for ${product.name}`)
    }
  }

  // Create order
  const order = await Order.create({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  })

  // Update product stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product)
    product.countInStock -= item.qty
    await product.save()
  }

  res.status(201).json(order)
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email")

  if (order) {
    // Check if the order belongs to the user or if the user is an admin
    if (order.user._id.toString() === req.user._id.toString() || req.user.role === "admin") {
      res.json(order)
    } else {
      res.status(403)
      throw new Error("Not authorized to access this order")
    }
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    order.status = "delivered"
    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name")
  res.json(orders)
})

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body

  const order = await Order.findById(req.params.id)

  if (order) {
    order.status = status || order.status

    if (trackingNumber) {
      order.trackingNumber = trackingNumber
    }

    if (status === "delivered") {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
}

