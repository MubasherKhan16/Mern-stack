const Order = require('../models/Orders'); 

const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    console.log('Received order:', req.body); 

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
    });

    const savedOrder = await newOrder.save(); 

    return res.status(201).json({
      success: true,
      data: savedOrder,
    });
  } catch (error) {
    console.error('Order save error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
};

module.exports = { createOrder };
