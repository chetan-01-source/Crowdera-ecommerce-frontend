import { useState } from 'react';
import { Package, Search, X, AlertCircle, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchProductById, 
  clearProductError, 
  clearSelectedProduct 
} from '../../store/productSlice';
import type { Product } from '../../api/productApi';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

const GetProductById = () => {
  const [productId, setProductId] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const dispatch = useAppDispatch();
  const { 
    selectedProduct, 
    loading, 
    error 
  } = useAppSelector((state) => state.product);

  const handleGetProduct = async () => {
    if (!productId.trim()) {
      return;
    }

    dispatch(clearProductError());
    try {
      await dispatch(fetchProductById(productId)).unwrap();
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(e.target.value);
    if (error) {
      dispatch(clearProductError());
    }
  };

  const handleClearProduct = () => {
    setProductId('');
    dispatch(clearSelectedProduct());
    dispatch(clearProductError());
  };

  const handleCardClick = (product: Product) => {
    setSelectedProductForModal(product);
  };

  const handleCloseModal = () => {
    setSelectedProductForModal(null);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-900 rounded-lg">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Get Product Details</h1>
              <p className="text-gray-400">View detailed information about a specific product</p>
            </div>
          </div>

          {/* Product ID Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product ID
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={productId}
                    onChange={handleInputChange}
                    placeholder="Enter product ID (e.g., 6918b4f8a5241d34383f3399)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={handleGetProduct}
                  disabled={!productId.trim() || loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  {loading ? 'Fetching...' : 'Get Product'}
                </button>
                {selectedProduct && (
                  <button
                    onClick={handleClearProduct}
                    className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-900 text-red-300 rounded-lg border border-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Display */}
        {selectedProduct && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Product Details</h2>
              <div className="text-sm text-gray-400">
                ID: {selectedProduct.id}
              </div>
            </div>

            <div className="max-w-md">
              <ProductCard
                product={selectedProduct}
                onClick={() => handleCardClick(selectedProduct)}
              />
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProductForModal && (
          <ProductDetailModal
            product={selectedProductForModal}
            isOpen={true}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default GetProductById;