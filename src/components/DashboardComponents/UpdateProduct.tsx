import { useState } from 'react';
import { Package, Edit, Search, X, AlertCircle, CheckCircle, Image, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchProductById, 
  updateProductThunk, 
  clearProductError, 
  clearUpdateSuccess,
  clearSelectedProduct 
} from '../../store/productSlice';
import type { CreateProductRequest, Product } from '../../api/productApi';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

const UpdateProduct = () => {
  const [productId, setProductId] = useState('');
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    brand: '',
    images: [''],
    tags: [''],
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const dispatch = useAppDispatch();
  const { 
    selectedProduct, 
    loading, 
    updating, 
    error, 
    updateSuccess 
  } = useAppSelector((state) => state.product);

  const handleGetProduct = async () => {
    const trimmedId = productId.trim();
  
    if (!trimmedId) {
      console.error('Product ID is empty or invalid');
      return;
    }
    
    try {
      const result = await dispatch(fetchProductById(trimmedId)).unwrap();
      console.log('Product fetched successfully:', result);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  // Populate form with selected product data
  const populateFormData = () => {
    
    
    if (selectedProduct) {
 
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        category: selectedProduct.category,
        brand: selectedProduct.brand,
        images: selectedProduct.images.length > 0 ? selectedProduct.images : [''],
        tags: selectedProduct.tags.length > 0 ? selectedProduct.tags : [''],
      });
    }
  };

  // Show update form with populated data
  const handleShowUpdateForm = () => {
    if (selectedProduct) {
      populateFormData();
      setShowUpdateForm(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTagField = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTagField = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
   
    
    if (!selectedProduct) {
      console.error('No selectedProduct available');
      return;
    }



    // Clean up empty images and tags
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      tags: formData.tags.filter(tag => tag.trim() !== ''),
    };

    if (cleanedData.images.length === 0) {
      return; // Should show validation error
    }

    try {
   
      await dispatch(updateProductThunk({
        productId: selectedProduct.id,
        productData: cleanedData
      })).unwrap();
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleClearError = () => {
    dispatch(clearProductError());
  };

  const handleClearSuccess = () => {
    dispatch(clearUpdateSuccess());
  };

  const handleClear = () => {
    setProductId('');
    setShowUpdateForm(false);
    dispatch(clearSelectedProduct());
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      brand: '',
      images: [''],
      tags: [''],
    });
  };

  const handleProductCardClick = (product: Product) => {
    setSelectedProductForModal(product);
  };

  const handleModalClose = () => {
    setSelectedProductForModal(null);
  };

  const categories = [
    'electronics',
    'books',
    'clothing',
    'home',
    'sports',
    'toys',
    'beauty',
    'automotive',
    'food',
    'other'
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Edit className="w-8 h-8" />
        Update Product
      </h1>

      {/* Success Message */}
      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Success</span>
            </div>
            <button
              onClick={handleClearSuccess}
              className="text-green-400 hover:text-green-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-green-200 mt-2">Product has been updated successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <button
              onClick={handleClearError}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-red-200 mt-2">{error}</p>
        </div>
      )}

      {/* Get Product Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Find Product to Update
        </h2>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={productId}
              onChange={(e) => {
             
                setProductId(e.target.value);
              }}
              placeholder="Enter Product ID (e.g., 6918b4f8a5241d34383f3399)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleGetProduct}
            disabled={loading || !productId.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition duration-200 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Get Product
              </>
            )}
          </button>
          {selectedProduct && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        <p className="text-gray-400 text-sm">
          Enter a valid product ID to fetch and display the product details.
        </p>
      </div>

      {/* Product Display */}
      {selectedProduct && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Product Details</h2>
            <button
              onClick={handleShowUpdateForm}
              disabled={updating}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Update Product
            </button>
          </div>
          
          <div className="max-w-md">
            <ProductCard 
              product={selectedProduct} 
              onClick={handleProductCardClick}
            />
          </div>
        </div>
      )}

      {/* Update Form */}
      {showUpdateForm && selectedProduct && (
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Update Product Information</h2>
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter product name..."
                />
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter brand name..."
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                placeholder="Enter detailed product description..."
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Image className="w-5 h-5" />
                Product Images
              </h2>
              <button
                type="button"
                onClick={addImageField}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center gap-1"
              >
                <Package className="w-4 h-4" />
                Add Image
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm mt-2">
              * At least one image URL is required. Images should be publicly accessible URLs.
            </p>
          </div>

          {/* Tags Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Product Tags
              </h2>
              <button
                type="button"
                onClick={addTagField}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center gap-1"
              >
                <Package className="w-4 h-4" />
                Add Tag
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="Enter tag..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTagField(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm mt-2">
              Tags help with product discovery and categorization.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowUpdateForm(false)}
              disabled={updating}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium rounded-lg transition duration-200 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={updating || !formData.name || !formData.description || !formData.category || !formData.brand || formData.price <= 0}
              className="px-8 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
            >
              {updating ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                  Updating Product...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          isOpen={!!selectedProductForModal}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default UpdateProduct;
