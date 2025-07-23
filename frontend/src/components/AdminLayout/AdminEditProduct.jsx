import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productList, isLoading } = useSelector((state) => state.adminProducts);

  const [productData, setProductData] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: '',
    image: '',
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Other'];
  const brands = ['Apple', 'Samsung', 'Sony', 'Other'];

  // Load product data
  useEffect(() => {
    const product = productList.find((p) => p._id === id);
    if (product) {
      setProductData({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        totalStock: product.totalStock || '',
        image: product.image || '',
      });
    }
  }, [id, productList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await dispatch(editProduct({ id, formData: productData })).unwrap();
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update product');
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-md rounded-xl bg-white mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

      <label className="block mb-2 font-medium">Product Title</label>
      <input
        type="text"
        name="title"
        value={productData.title}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-2 font-medium">Description</label>
      <textarea
        name="description"
        value={productData.description}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-2 font-medium">Category</label>
      <select
        name="category"
        value={productData.category}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Brand</label>
      <select
        name="brand"
        value={productData.brand}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
      >
        <option value="">Select Brand</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Price</label>
      <input
        type="number"
        name="price"
        value={productData.price}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-2 font-medium">Sale Price</label>
      <input
        type="number"
        name="salePrice"
        value={productData.salePrice}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-2 font-medium">Total Stock</label>
      <input
        type="number"
        name="totalStock"
        value={productData.totalStock}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-2 font-medium">Image URL</label>
      <input
        type="text"
        name="image"
        value={productData.image}
        onChange={handleChange}
        className="w-full border px-3 py-2 mb-4 rounded"
        placeholder="https://example.com/image.jpg"
      />

      {productData.image && (
        <img
          src={productData.image}
          alt="Product Preview"
          className="w-40 h-40 object-cover mb-4 border rounded"
        />
      )}

      <button
        onClick={handleUpdate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
      >
        Update Product
      </button>
    </div>
  );
};

export default AdminEditProduct;
