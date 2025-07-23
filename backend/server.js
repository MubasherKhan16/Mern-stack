const express=require('express')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const authRouter=require('./routes/authRoutes')
const productRouter=require('./routes/productRoutes')
const getProductsRouter=require('./routes/getProducts')
const cartRoutes=require('./routes/cartRoutes')

const app=express()

const PORT=process.env.PORT || 5000;

mongoose.connect('mongodb+srv://mubasher:mubasher@cluster0.0c35z3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });


app.use(
  cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','DELETE','PUT'],
    allowedHeaders:[
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma'
    ],
    credentials:true
  })
)
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRouter)
app.use('/api/product',productRouter)
app.use('/api/getProducts',getProductsRouter)
app.use('/api/cart',cartRoutes)

app.listen(PORT,()=>{
  console.log(`Server is now running on Port : ${PORT}`)
})