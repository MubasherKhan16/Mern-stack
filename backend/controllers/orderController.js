const Order = require('../models/Orders'); 


const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, sessionId } = req.body;

    if (!userId || !items || !totalAmount || !sessionId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 🔁 Check for existing order with same sessionId
    const existingOrder = await Order.findOne({ sessionId });
    if (existingOrder) {
      return res.status(200).json({ success: true, message: 'Order already exists', order: existingOrder });
    }

    const newOrder = await Order.create({ userId, items, totalAmount, sessionId });

    res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
  module.exports={createOrder}