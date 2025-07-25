const Order=require('../models/Orders')

const createOrder=async(req,res)=>{
  try {
    const {productId,title,image,price,salePrice}=req.body;
     
    const newCreatedOrder=new Order( {productId,title,image,price,salePrice});

    await newCreatedOrder.save();

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success:false,
      message:"Some error occured",
    })
    
  }
}


module.exports = {createOrder};