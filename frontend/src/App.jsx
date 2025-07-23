import { Routes, Route } from "react-router-dom";
import React from "react";

// Pages & Components
import AuthLeftSide from './components/authLayout/AuthLeftSide';
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import Admin from "./pages/Admin/Admin";
import AdminProducts from "./components/AdminLayout/AdminProducts";
import AdminOrder from "./components/AdminLayout/AdminOrder";
import AdminFeatures from "./components/AdminLayout/AdminFeatures";
import Nopage from "./pages/Nopage/Nopage";
import Authentication from "./components/common/Authentication";
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./redux/Slices/authSlice";
import Home from "./pages/Home/Home";
import AdminAddProduct from "./components/AdminLayout/AdminAddProduct";
import AdminEditProduct from "./components/AdminLayout/AdminEditProduct";
import Cart from "./pages/Cart/Cart";

const App = () => {
  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading, please wait...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* ************ AUTH ROUTES ************ */}
        <Route path='/auth' element={
          <Authentication isAuthenticated={isAuthenticated} user={user} >
            <AuthLeftSide />
          </Authentication>
        }>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
        </Route>

        {/* ************ ADMIN ROUTES ************ */}
        <Route path="/admin" element={
          <Authentication isAuthenticated={isAuthenticated} user={user}>
            <Admin />
          </Authentication>
        }>
          <Route path="products" element={<AdminProducts />} />
          <Route path="addproduct" element={<AdminAddProduct />} />
          <Route path="editproduct/:id" element={<AdminEditProduct />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="*" element={<Nopage />} />
        </Route>

        {/* ************ HOME ROUTE ************ */}
        <Route path="/home" element={
          <Authentication isAuthenticated={isAuthenticated} user={user}>
            <Home />
          </Authentication>
        } >
          </Route>
 <Route path='/cart' element={<Cart />} />
        {/* ************ CATCH-ALL ROUTE ************ */}
        <Route path="*" element={<Nopage />} />
      </Routes>
    </>
  );
};

export default App;
