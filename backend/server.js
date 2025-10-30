require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./routes/authRoutes')
const productRouter = require('./routes/productRoutes')
const getProductsRouter = require('./routes/getProducts')
const cartRoutes = require('./routes/cartRoutes')
const stripeRoutes = require('./routes/stripeRoutes')
const orderRoute = require('./routes/orderRoute')
const adminOrderRoutes = require('./routes/adminOrderRoutes');

const app = express()

const PORT = process.env.PORT || 5000;


const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment variables. Exiting.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma'
    ],
    credentials: true
  })
)

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/getProducts', getProductsRouter)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', stripeRoutes);
app.use('/api/order', orderRoute);

app.use('/api/admin', adminOrderRoutes);


app.listen(PORT, () => {
  console.log(`Server is now running on Port : ${PORT}`)
})
