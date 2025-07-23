import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductCart, deleteCartItem, updateCartItem } from '../../redux/Slices/CartSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  
  const { cartList, isLoading, error } = useSelector((state) => state.cartProducts || {});
  
  const safeCartList = Array.isArray(cartList) ? cartList : [];

  useEffect(() => {
    if (userId) {
      dispatch(fetchproductCart(userId))
        .unwrap()
        .then((result) => {
          console.log('Cart fetch successful:', result);
        })
        .catch((error) => {
          console.error('Cart fetch error details:', error);
          
        
        });
    }
  }, [dispatch, userId]);

  const handleDelete = async (productId) => {
  
    try {
      await dispatch(deleteCartItem({ userId, productId })).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Delete error:', error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
   
    try {
      await dispatch(updateCartItem({ userId, productId, quantity: newQuantity })).unwrap();
     
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Update quantity error:', error);
    }
  };

  const total = safeCartList.reduce((sum, item) => {
    const price = item?.productId?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Handle error state (but not for 404/empty cart)
  if (error && !error.includes('Cart not found') && !error.includes('404')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-semibold">Error loading cart</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button
            onClick={() => userId && dispatch(fetchproductCart(userId))}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Please Login</h2>
          <p className="text-yellow-700">You need to be logged in to view your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h2>
        <span className="text-gray-600">
          {safeCartList.length} item{safeCartList.length !== 1 ? 's' : ''}
        </span>
      </div>

      {safeCartList.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-500">Start shopping to add items to your cart!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border">
            {safeCartList.map((item, index) => {
              
              const product = item?.productId;
              if (!product) {
                return (
                  <div key={index} className="p-4 border-b border-gray-200 bg-red-50">
                    <p className="text-red-600">Invalid product data</p>
                  </div>
                );
              }

              const itemTotal = (product.price || 0) * (item.quantity || 0);

              return (
                <div
                  key={product._id || index}
                  className="flex items-center justify-between p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.title || 'Product'}
                        className="w-full h-full object-cover rounded-lg bg-gray-200"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.title || 'Unknown Product'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {product.description && product.description.length > 60 
                          ? `${product.description.substring(0, 60)}...` 
                          : product.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Brand: {product.brand || 'N/A'}</span>
                        <span>Category: {product.category || 'N/A'}</span>
                      </div>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        ${(product.price || 0).toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded border hover:bg-gray-50 transition disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity || 0}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded border hover:bg-gray-50 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-0">
                      <p className="text-lg font-semibold text-gray-800">
                        ${itemTotal.toFixed(2)}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">Subtotal:</span>
              <span className="text-2xl font-bold text-gray-800">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;