const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
  userId:String,
  cartItems:[
    {
      productId:String,
      title:String,
      image:String,
      price:String,
      salePrice:String,
    }
  ]
})

module.exports=mongoose.model('Order',orderSchema);