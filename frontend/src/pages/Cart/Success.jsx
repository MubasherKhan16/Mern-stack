import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductCart, clearCartFromDB, clearCart } from '../../redux/Slices/CartSlice';
import { createOrder } from '../../redux/Slices/OrderSlice';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const hasRun = useRef(false);

  const sessionId = params.get('session_id');
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const finalizeOrder = async () => {
      if (!userId || !sessionId || hasRun.current) return;
      hasRun.current = true;

      try {
        const cart = await dispatch(fetchproductCart(userId)).unwrap();
        const items = cart?.data?.items.map(item => ({
          productId: item.productId._id,
          title: item.productId.title,
          image: item.productId.image,
          price: item.productId.price,
          salePrice: item.productId.salePrice || null,
          quantity: item.quantity
        })) || [];

        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        if (items.length === 0) {
          toast.error("Cart is empty. Cannot place order.");
          return;
        }

        await dispatch(createOrder({ userId, items, totalAmount })).unwrap();
        await dispatch(clearCartFromDB(userId)).unwrap();
        dispatch(clearCart());

        toast.success("Order placed successfully!");
        navigate('/');
      } catch (err) {
        console.error("Finalize order failed:", err);
        toast.error("Something went wrong during order processing.");
      }
    };

    finalizeOrder();
  }, [dispatch, userId, sessionId, navigate]);

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-4">Thank you!</h2>
      <p>Your payment was successful. We're creating your order...</p>
    </div>
  );
};

export default CheckoutSuccess;
