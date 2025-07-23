import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteproduct, fetchAllProduct } from '../../redux/Slices/AdminProductSlice';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productList = [], isLoading } = useSelector((state) => state.adminProducts);

 

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteproduct(id))
      toast.success("Product deleted successfully");
      dispatch(fetchAllProduct()); 
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };
   useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Products</h2>
        <button
          onClick={() => navigate('/admin/addproduct')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : productList.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((product) => (
            <div key={product._id} className="bg-white p-4 border shadow rounded-lg">
              <img
                src={product.image || 'https://via.placeholder.com/200'}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="font-semibold text-green-600 mt-1">${product.price}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/admin/editproduct/${product._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
