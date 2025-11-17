import React, { useState } from 'react';
import { Package, Tag, DollarSign, Eye, Calendar, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import type { Product } from '../../api/productApi';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showDeleteButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  onDelete, 
  showDeleteButton = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'electronics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'clothing': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'toys-games': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'books': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'sports-outdoors': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'home-garden': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
      'health-beauty': 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300',
      'food-beverages': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'automotive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      'other': 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300',
    };
    return colors[category] || colors['other'];
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600 dark:text-red-400', icon: TrendingDown };
    } else if (stock <= 10) {
      return { text: 'Low Stock', color: 'text-orange-600 dark:text-orange-400', icon: TrendingDown };
    } else {
      return { text: 'In Stock', color: 'text-green-600 dark:text-green-400', icon: TrendingUp };
    }
  };

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
        overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300
        ${onClick ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-600' : ''}
      `}
      onClick={() => onClick?.(product)}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {!imageError && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600
            ${stockStatus.color}
          `}>
            <StockIcon className="w-3 h-3 mr-1" />
            {stockStatus.text}
          </span>
        </div>

        {/* Image Count Badge */}
        {product.images.length > 1 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
              <Eye className="w-3 h-3 mr-1" />
              {product.images.length}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
              {product.category.replace('-', ' ')}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {product.brand}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Stock: <span className="font-semibold">{product.stock}</span>
          </div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{product.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Added {formatDate(product.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{product.isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {/* Delete Button */}
        {showDeleteButton && onDelete && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;