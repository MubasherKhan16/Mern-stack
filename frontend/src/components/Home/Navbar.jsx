import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/Slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartList } = useSelector((state) => state.cartProducts);

  const [cartCount, setCartCount] = useState(0);

  // Load cart count from localStorage first
  useEffect(() => {
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      setCartCount(JSON.parse(savedCount));
    }
  }, []);
useEffect(() => {
    if (Array.isArray(cartList) && cartList.length > 0) {
      const count = cartList.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
      localStorage.setItem('cartCount', JSON.stringify(count));
    } else {
      setCartCount(0);
      localStorage.setItem('cartCount', JSON.stringify(0));
    }
  }, [cartList]);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth/login');
  };

  return (
    <nav className="bg-white shadow py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          MUBASHER INDUSTRIES
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link to="/men" className="text-gray-600 hover:text-gray-900">Men</Link>
          <Link to="/women" className="text-gray-600 hover:text-gray-900">Women</Link>
          <Link to="/kids" className="text-gray-600 hover:text-gray-900">Kids</Link>
          <Link to="/footwear" className="text-gray-600 hover:text-gray-900">Footwear</Link>
          <Link to="/accessories" className="text-gray-600 hover:text-gray-900">Accessories</Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-800 font-medium">{user.userName}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          )}

          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00-.15.55V19a1 1 0 001 1h12a1 1 0 001-1v-2.75a1 1 0 00-.15-.55L17 13M7 13h10" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
