import React, { useEffect, useState } from 'react';
import hero_1 from '../../assets/hero-1.jpg';
import hero_2 from '../../assets/hero-2.jpg';
import hero_3 from '../../assets/hero-3.jpg';
import { User, User2, Baby, ShoppingBag, Footprints } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from '../../redux/Slices/GetProductSlice';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const sliderImages = [hero_1, hero_2, hero_3];

const categories = [
  { name: 'Men', icon: <User size={40} /> },
  { name: 'Women', icon: <User2 size={40} /> },
  { name: 'Kids', icon: <Baby size={40} /> },
  { name: 'Accessories', icon: <ShoppingBag size={40} /> },
  { name: 'Footwear', icon: <Footprints size={40} /> },
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = useSelector((state) => state.getProductSlice?.productList);
  const isLoading = useSelector((state) => state.getProductSlice?.isLoading);
  const user = useSelector((state) => state.auth?.user);
  const products = productList || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (productId) => {
    if (!user?.id) {
      toast.error('Please login to add products to cart');
      return;
    }

    dispatch(addToCart({ userId: user.id, productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart!');
      })
      .catch(() => {
        toast.error('Failed to add to cart');
      });
  };

  return (
    <div className="w-full">
      {/* Hero Slider */}
      <div className="relative h-[900px] overflow-hidden">
        <img
          src={sliderImages[currentSlide]}
          alt="Hero Slide"
          className="absolute inset-0 w-full h-full object-cover transition duration-1000"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Greatest Sale of the Year is Now
          </h1>
          <p className="mb-6 text-lg">Don’t miss out on our limited-time offers!</p>
          <Link to='/home/mainpage'>
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
            Go to Collection
          </button>
          </Link>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="py-12 px-4 text-center bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer group"
            >
              <div className="mb-4 bg-blue-100 p-4 rounded-full group-hover:bg-blue-500 transition-colors duration-300">
                <div className="text-blue-600 group-hover:text-white">{cat.icon}</div>
              </div>
              <h3 className="font-semibold text-lg text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <p className="text-center col-span-full">Loading products...</p>
          ) : products.length > 0 ? (
            products.slice(0,6).map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  onClick={() => handleProductClick(product._id)}
                  src={product.image}
                  alt={product.title}
                  className="h-40 w-full object-cover rounded-lg bg-gray-200 mb-4 cursor-pointer"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-1 line-clamp-2">{product.description}</p>
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
            <div className="flex justify-center items-center h-96 w-full col-span-full">
              <p className="text-xl font-bold text-gray-500">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
