// src/pages/Success.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Success = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchproductCart(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for your purchase.</p>
      <button
        onClick={() => navigate('/home')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Success;
