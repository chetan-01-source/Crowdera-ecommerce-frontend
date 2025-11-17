import { useState } from 'react';
import { Package, Search, X, AlertCircle, Trash2, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchProductById, 
  deleteProductThunk,
  clearProductError, 
  clearSelectedProduct,
  clearDeleteSuccess 
} from '../../store/productSlice';
import type { Product } from '../../api/productApi';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

const DeleteProduct = () => {
  const [productId, setProductId] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dispatch = useAppDispatch();
  const { 
    selectedProduct, 
    loading, 
    deleting,
    deleteSuccess,
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
    if (deleteSuccess) {
      dispatch(clearDeleteSuccess());
    }
  };

  const handleClearProduct = () => {
    setProductId('');
    dispatch(clearSelectedProduct());
    dispatch(clearProductError());
    dispatch(clearDeleteSuccess());
    setShowDeleteConfirm(false);
  };

  const handleCardClick = (product: Product) => {
    setSelectedProductForModal(product);
  };

  const handleCloseModal = () => {
    setSelectedProductForModal(null);
  };

//   const handleDeleteClick = () => {
//     setShowDeleteConfirm(true);
//   };

  const handleDeleteFromCard = () => {
    // When delete is clicked from card, show confirmation
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct?.id) return;

    try {
      await dispatch(deleteProductThunk(selectedProduct.id)).unwrap();
      setShowDeleteConfirm(false);
      // Clear the selected product after successful deletion
      setTimeout(() => {
        dispatch(clearSelectedProduct());
      }, 2000);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-900 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Delete Product</h1>
              <p className="text-gray-400">Find and delete a specific product</p>
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
                    placeholder="Enter product ID (e.g., 6918b456a5241d34383f338b)"
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
                  {loading ? 'Fetching...' : 'Find Product'}
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

            {/* Success Display */}
            {deleteSuccess && (
              <div className="flex items-center gap-2 p-4 bg-green-900 text-green-300 rounded-lg border border-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Product deleted successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Display */}
        {selectedProduct && !deleteSuccess && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Product to Delete</h2>
              <div className="text-sm text-gray-400">
                ID: {selectedProduct.id}
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <ProductCard
                product={selectedProduct}
                onClick={() => handleCardClick(selectedProduct)}
                onDelete={handleDeleteFromCard}
                showDeleteButton={true}
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-red-700 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-900 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-300">Confirm Delete</h3>
              </div>
              
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete this product?
              </p>
              <p className="text-white font-medium mb-6">
                "{selectedProduct.name}"
              </p>
              <p className="text-red-200 text-sm mb-6">
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {deleting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  {deleting ? 'Deleting...' : 'Delete Product'}
                </button>
                <button
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteProduct;