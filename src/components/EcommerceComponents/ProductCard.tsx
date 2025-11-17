import { ShoppingCart, Plus, Minus, Eye } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToCartAsync } from '../../store/cartSlice';
import { updateProductStock } from '../../store/productSlice';
import type { Product } from '../../api/productApi';
import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  isOnSale?: boolean;
  shouldUseInfiniteScroll?: boolean;
  quantity: number;
  onUpdateQuantity: (productId: string, change: number) => void;
  onQuickView: (product: Product) => void;
  filterType?: string;
  onImagePreload?: (imageUrls: string[]) => void;
}

const ProductCard = ({ 
  product, 
  isNew = false, 
  isOnSale = false,
  shouldUseInfiniteScroll = false,
  quantity,
  onUpdateQuantity,
  onQuickView,
  filterType = 'all',
  onImagePreload
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Debug: Log when product stock changes
  useEffect(() => {
    
  }, [product.stock, product.id]);
  
  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Prevent multiple clicks
    
    setIsAddingToCart(true);
    try {
      const result = await dispatch(addToCartAsync({
        productId: product.id,
        quantity: quantity
      })).unwrap();
      
      console.log('Add to cart result:', result);
      
      // Update product stock if we got stock update info
      if (result.stockUpdate && typeof result.stockUpdate.newStock === 'number') {
        console.log('Dispatching stock update:', result.stockUpdate);
        dispatch(updateProductStock({
          productId: result.stockUpdate.productId,
          newStock: result.stockUpdate.newStock
        }));
      } else {
        console.warn('No stock update info received:', result.stockUpdate);
      }
      
      // Note: fetchCartAsync is automatically called inside addToCartAsync to update cart count
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 ${shouldUseInfiniteScroll ? 'flex-shrink-0 w-80' : ''}`}
      onMouseEnter={() => {
        // Preload all product images on hover for better modal performance
        if (product.images && onImagePreload) {
          onImagePreload(product.images);
        }
      }}
    >
      {(isNew || isOnSale || filterType === 'new' || filterType === 'sale') && (
        <div className="absolute top-3 left-3 z-10">
          {(isNew || filterType === 'new') && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded shadow-sm">
              New
            </span>
          )}
          {(isOnSale || filterType === 'sale') && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded ml-1 shadow-sm">
              Sale
            </span>
          )}
        </div>
      )}
      
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        {product.images && product.images[0] ? (
          <OptimizedImage
            src={product.images[0]} 
            alt={product.name}
            width={320}
            height={320}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            placeholder={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=320&h=320&fit=crop`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-center p-4">{product.name}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-300" />
        
        {/* Quick view button */}
        <button 
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600"
        >
          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {(isOnSale || filterType === 'sale') ? (
              <>
                <span className="text-xl font-bold text-red-600 dark:text-red-400">${Math.round(product.price * 0.8)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price}</span>
            )}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            Stock: {product.stock}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Qty:</span>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 shadow-sm">
              <button
                onClick={() => onUpdateQuantity(product.id, -1)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-3 py-1.5 min-w-[2.5rem] text-center text-sm font-medium text-gray-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(product.id, 1)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
            product.stock === 0
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-600'
              : isAddingToCart
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-600 cursor-wait'
              : 'bg-white dark:bg-gray-100 text-black border-gray-300 dark:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-200 hover:border-gray-400 dark:hover:border-gray-300'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 
            ? 'Out of Stock' 
            : isAddingToCart
            ? 'Adding...'
            : 'Add to Cart'
          }
        </button>
      </div>
    </div>
  );
};

export default ProductCard;