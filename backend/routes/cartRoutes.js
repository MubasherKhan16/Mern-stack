const express = require("express");
const {
  addToCart,
  fetchCartItems,
  updateQuantity,
  deleteItem,
} = require("../controllers/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update/:userId/:productId", updateQuantity);
router.delete("/delete/:userId/:productId", deleteItem);

module.exports = router;