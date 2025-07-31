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


mongoose.connect('mongodb://mubasher:mubasher@ac-cflxfqx-shard-00-00.0c35z3b.mongodb.net:27017,ac-cflxfqx-shard-00-01.0c35z3b.mongodb.net:27017,ac-cflxfqx-shard-00-02.0c35z3b.mongodb.net:27017/?replicaSet=atlas-pywyaj-shard-0&ssl=true&authSource=admin')
  .then(() => {
    console.log(" MongoDB connected successfully");
  })
  .catch((error) => {
    console.log(" MongoDB connection error:", error);
  });

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
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
