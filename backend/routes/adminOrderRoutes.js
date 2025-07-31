const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById
} = require('../controllers/adminOrders');

// Optionally, you can add middleware here to check admin role
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);

module.exports = router;
