import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchCartAsync, 
  clearCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
  selectCart,
  selectCartLoading,
  selectCartTotal,
  selectCartCount
} from '../store/cartSlice';
import { updateProductStock } from '../store/productSlice';
import { cartApi } from '../api/cartApi';
import { stripeApi } from '../api/stripeApi';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../api/cartApi';

const CartRoute = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const loading = useAppSelector(selectCartLoading);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartCount = useAppSelector(selectCartCount);
  
  console.log('Cart Data:', cart);
  const [updatingItems, setUpdatingItems] = useState<{ [key: string]: boolean }>({});
  const [removingItems, setRemovingItems] = useState<{ [key: string]: boolean }>({});
  const [clearingCart, setClearingCart] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch cart when component mounts
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    try {
      // Find the current item to get the current quantity
      const currentItem = cart?.items.find(item => item.productId === productId);
      if (!currentItem) return;
      
      const quantityDifference = newQuantity - currentItem.quantity;
      
      // Update cart first
      await dispatch(updateCartItemAsync({ itemId: productId, quantity: newQuantity })).unwrap();
      
      // Update stock based on quantity change
      if (quantityDifference !== 0) {
        try {
          const stockOperation = quantityDifference > 0 ? 'subtract' : 'add';
          const stockQuantity = Math.abs(quantityDifference);
          
          const stockUpdateResponse = await cartApi.updateStock(productId, {
            operation: stockOperation,
            quantity: stockQuantity
          });
          
          // Update product stock in Redux if successful
          if (stockUpdateResponse && stockUpdateResponse.data) {
            dispatch(updateProductStock({
              productId: productId,
              newStock: stockUpdateResponse.data.newStock
            }));
          }
        } catch (stockError) {
          console.warn('Failed to update stock, but cart was updated:', stockError);
        }
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (itemId: string, productId: string, quantity: number) => {
    setRemovingItems(prev => ({ ...prev, [itemId]: true }));
    try {
      const result = await dispatch(removeFromCartAsync({ 
        itemId, 
        productId, 
        quantity 
      })).unwrap();
      
      // Update product stock if we got stock update info
      if (result.stockUpdate && typeof result.stockUpdate.newStock === 'number') {
        dispatch(updateProductStock({
          productId: result.stockUpdate.productId,
          newStock: result.stockUpdate.newStock
        }));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await dispatch(clearCartAsync()).unwrap();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    setCheckoutLoading(true);
    try {
      // Calculate total amount including tax
      const totalAmount = cartTotal * 1.08; // Including 8% tax
      const totalQuantity = cartCount;

      // Create checkout session with total amount and priceId
      // You should replace 'price_default' with your actual Stripe price ID

      console.log('Initiating checkout with total amount (USD):', totalAmount, totalQuantity);
      
      // Create a product name from cart items
      const productName = cart.items.length === 1 
        ? cart.items[0].productName 
        : `Cart Items (${cart.items.length} products)`;

      const response = await stripeApi.createCheckoutSessionFromCart(
        totalAmount, // Total USD amount (will be converted to INR in the API)
        productName, // Product name for the checkout session
        totalQuantity // Total quantity of items
      );
      
      console.log('Checkout session response:', response);
      
      if (response.success && response.data.url) {
        console.log('Redirecting to Stripe checkout:', response.data.url);
        // Redirect to Stripe checkout page
        window.location.href = response.data.url;
      } else {
        throw new Error(response.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/Home"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
            Shopping Cart
          </h1>
        </div>

        {/* Cart Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {!cart || cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add some products to get started with your shopping experience.
            </p>
            <Link 
              to="/Home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4">
              {cart.items.map((item: CartItem) => (
                <div 
                  key={item.productId}
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-24 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                    {item.productImages && item.productImages.length > 0 ? (
                      <img 
                        src={item.productImages[0]} 
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-300 text-center p-2">
                          {item.productName.substring(0, 20)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      ${item.productPrice} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</span>
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700">
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems[item.productId]}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium text-gray-900 dark:text-white">
                          {updatingItems[item.productId] ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity + 1)}
                          disabled={updatingItems[item.productId]}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Price and Remove */}
                    <div className="flex items-center justify-between sm:hidden">
                      <div className="text-left">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${item.itemTotal.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.productId, item.productId, item.quantity)}
                        disabled={removingItems[item.productId]}
                        className="flex items-center gap-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        {removingItems[item.productId] ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>

                  {/* Desktop Price and Remove */}
                  <div className="hidden sm:flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${item.itemTotal.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total for this item
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.productId, item.productId, item.quantity)}
                      disabled={removingItems[item.productId]}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      {removingItems[item.productId] ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="xl:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartCount} items)</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${(cartTotal * 0.08).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${(cartTotal * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || !cart || cart.items.length === 0}
                  >
                    <CreditCard className="w-5 h-5" />
                    {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                  
                  <button 
                    onClick={handleClearCart}
                    disabled={clearingCart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                    {clearingCart ? 'Clearing Cart...' : 'Clear Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartRoute;
