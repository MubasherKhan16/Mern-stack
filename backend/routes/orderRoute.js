const express = require("express");
const {createOrder} = require("../controllers/orderController");

const router = express.Router();

router.post("/order", addToCart);

module.exports = router;