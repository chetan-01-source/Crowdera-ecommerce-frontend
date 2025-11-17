import React, { useState } from 'react';
import { X, Package, DollarSign, Tag, Star, Truck, Shield, Heart } from 'lucide-react';
import type { Product } from '../../api/productApi';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
    


  
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      return { text: 'Out of Stock', color: 'text-red-600 dark:text-red-400' };
    } else if (stock <= 10) {
      return { text: 'Low Stock', color: 'text-orange-600 dark:text-orange-400' };
    } else {
      return { text: 'In Stock', color: 'text-green-600 dark:text-green-400' };
    }
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Images Section */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {!imageError && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                          selectedImageIndex === index
                            ? 'border-blue-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => {}}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="space-y-6">
                {/* Title and Brand */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                      by {product.brand}
                    </span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(product.category)}`}>
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Price and Stock */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.stock} units available
                      </p>
                    </div>
                  </div>
{/*                   
                  {product.stock > 0 && (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  )} */}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Truck className="w-4 h-4" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>Warranty</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>Add to Wishlist</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4" />
                      <span>4.5 Rating</span>
                    </div>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Product Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Product ID:</span>
                      <span className="text-gray-900 dark:text-white font-mono">{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`font-medium ${product.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="text-gray-900 dark:text-white">{formatDate(product.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                      <span className="text-gray-900 dark:text-white">{formatDate(product.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;