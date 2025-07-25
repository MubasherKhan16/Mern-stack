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

  useEffect(() => {
    const productsArray = Array.isArray(cartList?.products)
      ? cartList.products
      : Array.isArray(cartList)
      ? cartList
      : [];

    const count = productsArray.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(count);
  }, [cartList]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth/login');
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home/homepage" className="text-2xl font-extrabold tracking-wide text-gray-800 hover:text-blue-600 transition">
          MUBASHER INDUSTRIES
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 font-medium text-sm">
          <Link to="/home/homepage" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
          <Link to="/home/mainpage" className="text-gray-600 hover:text-blue-600 transition">All Products</Link>
          <Link to="/home/men" className="text-gray-600 hover:text-blue-600 transition">Men</Link>
          <Link to="/home/women" className="text-gray-600 hover:text-blue-600 transition">Women</Link>
          <Link to="/home/kids" className="text-gray-600 hover:text-blue-600 transition">Kids</Link>
          <Link to="/home/footwear" className="text-gray-600 hover:text-blue-600 transition">Footwear</Link>
          <Link to="/home/accessories" className="text-gray-600 hover:text-blue-600 transition">Accessories</Link>
        </div>

        {/* User & Cart */}
        <div className="flex items-center space-x-5">
          {user ? (
            <>
              <span className="px-3 py-1 bg-gray-100 text-sm font-semibold rounded-full text-gray-800 shadow-sm">
                {user.userName}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition">Login</Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00-.15.55V19a1 1 0 001 1h12a1 1 0 001-1v-2.75a1 1 0 00-.15-.55L17 13M7 13h10"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold shadow-md">
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
