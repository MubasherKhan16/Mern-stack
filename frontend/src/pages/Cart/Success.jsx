import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductCart, clearCartFromDB, clearCart } from '../../redux/Slices/CartSlice';
import { createOrder } from '../../redux/Slices/OrderSlice';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const userId = useSelector((state) => state.auth.userId);

  const hasFinalized = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalizeOrder = async () => {
      if (!userId || !sessionId || hasFinalized.current) return;
      hasFinalized.current = true; // ⛔️ Prevent rerun

      try {
        const cart = await dispatch(fetchproductCart(userId)).unwrap();
        const cartItems = cart?.data?.items || [];

        if (cartItems.length === 0) {
          toast.error("Cart is empty. Cannot place order.");
          return;
        }

        const items = cartItems.map(item => ({
          productId: item.productId._id,
          title: item.productId.title,
          image: item.productId.image,
          price: item.productId.price,
          salePrice: item.productId.salePrice || null,
          quantity: item.quantity
        }));

        const totalAmount = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        await dispatch(createOrder({ userId, items, totalAmount, sessionId })).unwrap();

        await dispatch(clearCartFromDB(userId)).unwrap();
        dispatch(clearCart());

        toast.success("Order placed successfully!");
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        console.error("Finalize order failed:", err);
        toast.error("Something went wrong during order processing.");
      } finally {
        setLoading(false);
      }
    };

    finalizeOrder();
  }, [dispatch, userId, sessionId, navigate]);

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-4">Thank you!</h2>
      <p>
        {loading
          ? "Your payment was successful. We're creating your order..."
          : "Redirecting you to home."}
      </p>
    </div>
  );
};

export default CheckoutSuccess;
