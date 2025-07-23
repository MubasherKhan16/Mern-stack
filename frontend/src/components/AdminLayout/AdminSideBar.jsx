import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, ShoppingCart, Settings } from 'lucide-react'; // or @heroicons/react
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/Slices/authSlice';

const AdminSideBar = () => {
  const navItems = [
    { name: 'Products', path: '/admin/products', icon: <Package size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
    { name: 'Features', path: '/admin/features', icon: <Settings size={18} /> },
  ];

  const dispatch=useDispatch();
  const handlelogout=async()=>{
       await dispatch(logoutUser())
  }


  return (
    <div className="h-full p-6 bg-gray-900 text-white flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-center cursor-pointer hover:text-amber-200">ADMIN DASHBOARD</h2>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition" onClick={()=>{
          handlelogout()
        }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
