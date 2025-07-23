import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getproduct, productDetails } from '../../redux/Slices/GetProductSlice';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Mainpage = () => {
  const categories = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
  const brands = ['Nike', 'Adidas', 'Bata', 'Ndure', 'Zara', 'Puma', 'LV'];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
const { cartList = [] } = useSelector((state) => state.cartProducts || {});


  const { productList = [], isLoading } = useSelector((state) => state.getProductSlice);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const brandParam = params.get('brand');
    const sortParam = params.get('sort');

    if (categoryParam) setSelectedCategories(categoryParam.split(','));
    if (brandParam) setSelectedBrands(brandParam.split(','));
    if (sortParam) setSortOption(sortParam);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (selectedBrands.length > 0) params.set('brand', selectedBrands.join(','));
    if (sortOption) params.set('sort', sortOption);

    const queryString = params.toString();
    navigate({ search: queryString });
    dispatch(getproduct(queryString));
  }, [selectedCategories, selectedBrands, sortOption, navigate, dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const getproductDetails = (id) => {
    dispatch(productDetails(id))
      .unwrap()
      .then(() => {
        navigate(`/product/${id}`);
      })
      .catch(() => {
        toast.error('Failed to fetch product details');
      });
  };

  const handleAddToCart = (productId) => {
    if (!userId) {
      toast.error('Please login to add products to cart');
      return;
    }

    dispatch(addToCart({ userId, productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart!');
      })
      .catch(() => {
        toast.error('Failed to add to cart');
      });
  };

  return (
    <div className="flex px-8 py-6 bg-gray-100 min-h-screen gap-6">
      <aside className="w-64 bg-white p-6 rounded-2xl shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Category</h2>
          {categories.map((cat) => (
            <label key={cat} className="block mb-2 text-gray-700">
              <input
                type="checkbox"
                className="mr-2 text-blue-600"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Brand</h2>
          {brands.map((brand) => (
            <label key={brand} className="block mb-2 text-gray-700">
              <input
                type="checkbox"
                className="mr-2 text-blue-600"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">All Products</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              Showing <span className="text-blue-600 font-medium">{productList.length} Products</span>
            </span>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default</option>
              <option value="high">Price: High to Low</option>
              <option value="low">Price: Low to High</option>
              <option value="atz">Title: A to Z</option>
              <option value="zta">Title: Z to A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <p className="text-center col-span-full">Loading products...</p>
          ) : productList.length > 0 ? (
            productList.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  onClick={() => getproductDetails(product._id)}
                  src={product.image}
                  alt={product.title}
                  className="h-40 w-full object-cover rounded-lg bg-gray-200 mb-4 cursor-pointer"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{product.description}</p>
                <p className="text-sm text-gray-500">
                  Brand: <span className="text-gray-700 font-medium">{product.brand}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Category: <span className="text-gray-700 font-medium">{product.category}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Stock: <span className="text-green-600 font-semibold">{product.totalStock}</span>
                </p>
                <div className="mt-2">
                  <span className="text-blue-600 font-bold text-lg">${product.price}</span>
                  {product.salePrice && product.salePrice !== product.price && (
                    <span className="ml-2 line-through text-sm text-red-500">${product.salePrice}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-96 w-full ml-3 col-span-full">
              <p className="text-xl font-bold text-gray-500">No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mainpage;
