const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const mongoose = require('mongoose');



router.post('/create-checkout-session', async (req, res) => {
  const { userId } = req.body;

  try {

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ error: 'Cart is empty or not found' });
    }

    const lineItems = cart.items.map(item => {
      const product = item.productId;
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: product.description,
          },
          unit_amount: Math.round(product.price * 100), 
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
     success_url: `http://localhost:5173/checkout-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: 'http://localhost:5173/cancel',
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
