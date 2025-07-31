const Order = require('../models/Orders');

// GET /api/admin/orders - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') // Include user info
      .populate('items.productId', 'title image'); // Include product info

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Admin getAllOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// GET /api/admin/orders/:id - Get a single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'title image');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Admin getOrderById error:', error);
    res.status(500).json({ success: false, message: 'Failed to get order' });
  }
};

module.exports = {
  getAllOrders,
  getOrderById
};
