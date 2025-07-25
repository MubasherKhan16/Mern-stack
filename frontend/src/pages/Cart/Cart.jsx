import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductCart, deleteCartItem, updateCartItem } from '../../redux/Slices/CartSlice';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe('pk_test_51Rlrb6QU12STd9GvoZvjGzJZLQM0lCNYUdtq3vOBChu4TZFYkZWMVP0xuN9wqKSTVvFhf70mWjovRnB1VVsBIncY00AU4OIGwT');

const Cart = () => {
  const dispatch = useDispatch();
  const [stripeLoading, setStripeLoading] = useState(false);
  

 const userId = useSelector((state) => state.auth.userId);
console.log(userId) 

  
  const { cartList, isLoading, error } = useSelector((state) => state.cartProducts || {});
const safeCartList = Array.isArray(cartList) ? cartList : [];

  useEffect(() => {
    if (userId) {
      dispatch(fetchproductCart(userId))
        .unwrap()
        .then((result) => {
          console.log(' Cart fetch successful:', result);
        })
        .catch((error) => {
          console.error(' Cart fetch error:', error);
        });
    }
  }, [dispatch, userId]);

  const handleCheckout = async () => {
    if (safeCartList.length === 0) return;

    setStripeLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/checkout/create-checkout-session', {
        userId,
        cartItems: safeCartList.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
          name: item.productId.title,
          image: item.productId.image
        }))
      });

      const sessionId = response.data.id;
      console.log(' Stripe Session ID:', sessionId);

      const stripe = await stripePromise;

      if (!stripe) {
        toast.error("Stripe failed to load");
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        console.error(' Stripe redirect error:', error.message);
        toast.error(error.message);
      }

    } catch (err) {
      console.error(' Checkout API error:', err);
      toast.error('Checkout failed');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteCartItem({ userId, productId })).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Delete error:', error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await dispatch(updateCartItem({ userId, productId, quantity: newQuantity })).unwrap();
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Update quantity error:', error);
    }
  };

  const total = safeCartList.reduce((sum, item) => {
    const price = item?.productId?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + price * quantity;
  }, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64 p-6">
        <p className="text-lg text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (error && !error.includes('Cart not found')) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">Error loading cart: {error}</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-6 text-center text-yellow-700 font-medium">
        Please log in to view your cart.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Your Cart</h2>

      {safeCartList.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="bg-white rounded shadow mb-6">
            {safeCartList.map((item, index) => {
              const product = item?.productId;
              if (!product) return null;

              return (
                <div key={product._id} className="p-4 border-b last:border-none flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => handleQuantityChange(product._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(product._id, item.quantity + 1)}>+</button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600">Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={stripeLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg transition hover:bg-blue-700 ${
                stripeLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {stripeLoading ? 'Redirecting...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
