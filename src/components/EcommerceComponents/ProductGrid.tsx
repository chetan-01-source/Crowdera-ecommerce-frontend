import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchAllProducts, 
  searchProductsThunk,
  setSearchQuery,
  clearSearchResults,
  updateProductStock
} from '../../store/productSlice';
import { addToCartAsync } from '../../store/cartSlice';
import type { Product } from '../../api/productApi';
import type { CartItem } from '../../api/cartApi';
import ProductCard from './ProductCard';
import OptimizedImage from './OptimizedImage';

interface ProductGridProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  limit?: number;
  filterType?: 'popular' | 'new' | 'sale' | 'all';
  sortOrder?: 'asc' | 'desc';
}

const ProductGrid = ({ 
  title = "Featured Products", 
  subtitle,
  limit,
  filterType = 'all',
  showSearch = false,
  sortOrder = 'asc'
}: ProductGridProps) => {
  const dispatch = useAppDispatch();
  const { 
    products, 
    loading, 
    searchResults, 
    searchQuery,
    isSearching
  } = useAppSelector(state => state.product);
  
  // Get cart state from cart slice
  const { cart } = useAppSelector(state => state.cart);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [modalAddingToCart, setModalAddingToCart] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  
  // Refs for auto-scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveredRef = useRef(false);
  
  // Preload images for better modal experience
  const preloadImage = (src: string) => {
    if (!src || preloadedImages.has(src)) return;
    
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setPreloadedImages(prev => new Set(prev).add(src));
    };
  };
  
  // Determine if we should use infinite scroll (when no limit is provided)
  const shouldUseInfiniteScroll = limit === undefined;
  
  const displayProducts = searchQuery 
    ? searchResults 
    : products;  // Always use Redux products state for real-time updates
  const isLoading = searchQuery 
    ? isSearching 
    : loading;   // Always use Redux loading state
  const cartCount = cart?.items?.reduce((total: number, item: CartItem) => total + item.quantity, 0) ?? 0;

  // Debug: Log products when they change
  useEffect(() => {
    if (products.length > 0) {
      // Log stock information for the first product
      
    }
  }, [products]);

  // Initialize products
  useEffect(() => {
    if (!searchQuery) {
      // Fetch products with appropriate limit for the display type
      const fetchLimit = shouldUseInfiniteScroll ? 100 : (limit || 20);
      dispatch(fetchAllProducts({ 
        limit: fetchLimit,
        sortOrder 
      }));
    }
  }, [dispatch, limit, sortOrder, searchQuery, shouldUseInfiniteScroll]);

  // Auto-scroll functionality for infinite scroll sections
  useEffect(() => {
    if (!shouldUseInfiniteScroll || !scrollContainerRef.current || displayProducts.length === 0) {
      return;
    }

    const container = scrollContainerRef.current;
    const cardWidth = 320; // w-80 = 320px
    const gap = 24; // gap-6 = 24px
    const scrollAmount = cardWidth + gap;

    const startAutoScroll = () => {
      // Clear any existing interval
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }

      autoScrollIntervalRef.current = setInterval(() => {
        if (!isHoveredRef.current && container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          
          if (container.scrollLeft >= maxScroll - 10) {
            // Smoothly scroll back to start
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll one card width
            container.scrollTo({ 
              left: container.scrollLeft + scrollAmount, 
              behavior: 'smooth' 
            });
          }
        }
      }, 3000); // Scroll every 3 seconds
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      startAutoScroll();
    };

    // Start auto-scroll after a short delay
    const timer = setTimeout(startAutoScroll, 1000);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [shouldUseInfiniteScroll, displayProducts.length]);

  // Manual scroll handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const gap = 24;
      scrollContainerRef.current.scrollBy({ 
        left: -(cardWidth + gap), 
        behavior: 'smooth' 
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const gap = 24;
      scrollContainerRef.current.scrollBy({ 
        left: cardWidth + gap, 
        behavior: 'smooth' 
      });
    }
  };

  // Handle image selection
  const handleImageSelect = (index: number) => {
    if (index !== selectedImageIndex) {
      setImageLoading(true);
      setSelectedImageIndex(index);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Reset image when product changes
  const resetProductModal = () => {
    setSelectedImageIndex(0);
    setImageLoading(false);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm));
      dispatch(searchProductsThunk({ query: searchTerm }));
    } else {
      dispatch(clearSearchResults());
      dispatch(setSearchQuery(''));
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      dispatch(clearSearchResults());
      dispatch(setSearchQuery(''));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const newQuantity = Math.max(1, current + change);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    resetProductModal();
    
    // Preload all product images when modal opens
    if (product.images) {
      product.images.forEach(imageUrl => {
        preloadImage(imageUrl);
      });
    }
  };

  // For infinite scroll, use all products. For grid layout, limit the products.
  const filteredProducts = displayProducts.slice(0, shouldUseInfiniteScroll ? displayProducts.length : limit);

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className={shouldUseInfiniteScroll ? "" : "max-w-7xl mx-auto px-6"}>
        <div className="text-center mb-16 px-6">
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 tracking-widest uppercase">
              {subtitle}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wide text-gray-900 dark:text-white">
            {title}
          </h2>

          {/* Search bar */}
          {showSearch && (
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-white dark:bg-gray-200 text-black border border-gray-300 dark:border-gray-400 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors duration-300"
                >
                  Search
                </button>
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {isSearching ? 'Searching...' : `Showing results for "${searchQuery}"`}
                </p>
              )}
            </div>
          )}

          {/* Cart indicator */}
          {cartCount > 0 && (
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white dark:bg-gray-200 text-black border border-gray-300 dark:border-gray-400 rounded-full shadow-sm">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">{cartCount} items in cart</span>
            </div>
          )}
        </div>
      
        {shouldUseInfiniteScroll ? (
          /* Infinite scroll layout with horizontal scrolling and auto-scroll */
          <div className="relative group w-full">
            {/* Navigation Arrows */}
            <button
              onClick={scrollLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            {/* Horizontal scroll container */}
            <div className="w-full overflow-hidden">
              <div 
                ref={scrollContainerRef}
                className="scroll-container flex gap-6 overflow-x-auto overflow-y-hidden pb-4 px-6 scroll-smooth"
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <style>{`
                  .scroll-container::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg h-[500px] w-80 animate-pulse border border-gray-200 dark:border-gray-600 flex-shrink-0">
                      <div className="animate-pulse">
                        <div className="w-full h-64 bg-gray-200 dark:bg-gray-600 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-full mt-4"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isNew={filterType === 'new'}
                      isOnSale={filterType === 'sale'}
                      shouldUseInfiniteScroll={shouldUseInfiniteScroll}
                      quantity={quantities[product.id] || 1}
                      onUpdateQuantity={updateQuantity}
                      onQuickView={handleQuickView}
                      filterType={filterType}
                      onImagePreload={(imageUrls) => imageUrls.forEach(preloadImage)}
                    />
                  ))
                ) : (
                  <div className="w-full text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      {searchQuery ? 'No products found for your search.' : 'No products available.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Regular grid layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(limit || 8)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 animate-pulse border border-gray-200 dark:border-gray-600" />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isNew={filterType === 'new'}
                  isOnSale={filterType === 'sale'}
                  shouldUseInfiniteScroll={shouldUseInfiniteScroll}
                  quantity={quantities[product.id] || 1}
                  onUpdateQuantity={updateQuantity}
                  onQuickView={handleQuickView}
                  filterType={filterType}
                  onImagePreload={(imageUrls) => imageUrls.forEach(preloadImage)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchQuery ? 'No products found for your search.' : 'No products available.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Product Quick View Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
                    {selectedProduct.name}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      resetProductModal();
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl leading-none p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Gallery Section */}
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      {selectedProduct.images && selectedProduct.images[selectedImageIndex] ? (
                        <OptimizedImage
                          src={selectedProduct.images[selectedImageIndex]}
                          alt={`${selectedProduct.name} - Image ${selectedImageIndex + 1}`}
                          width={600}
                          height={600}
                          priority={true}
                          className={`w-full h-full transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={handleImageLoad}
                          placeholder={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop`}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 font-medium text-center p-4">
                            {selectedProduct.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Image Thumbnails */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProduct.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => handleImageSelect(index)}
                            onMouseEnter={() => preloadImage(image)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              selectedImageIndex === index 
                                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <OptimizedImage
                              src={image}
                              alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full"
                              placeholder={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=64&h=64&fit=crop`}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Price Section */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${selectedProduct.price}
                        </span>
                        {filterType === 'sale' && (
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                              ${Math.floor(selectedProduct.price * 1.25)}
                            </span>
                            <span className="text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded">
                              20% OFF
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          In Stock: {selectedProduct.stock}
                        </span>
                        {selectedProduct.createdAt && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Added: {new Date(selectedProduct.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Description
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {selectedProduct.description}
                        </p>
                      </div>

                      {/* Categories and Tags */}
                      {(selectedProduct.category || selectedProduct.tags) && (
                        <div className="space-y-3">
                          {selectedProduct.category && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Category
                              </h5>
                              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                                {selectedProduct.category}
                              </span>
                            </div>
                          )}
                          
                          {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Tags
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.tags.map((tag, index) => (
                                  <span 
                                    key={index} 
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Additional Product Details */}
                      {selectedProduct.brand && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Brand
                          </h5>
                          <p className="text-gray-600 dark:text-gray-300">
                            {selectedProduct.brand}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={async () => {
                          if (modalAddingToCart) return; // Prevent multiple clicks
                          
                          setModalAddingToCart(true);
                          try {
                            const result = await dispatch(addToCartAsync({
                              productId: selectedProduct.id,
                              quantity: 1
                            })).unwrap();
                            
                            console.log('Modal add to cart result:', result);
                            
                            // Update product stock if we got stock update info
                            if (result.stockUpdate && typeof result.stockUpdate.newStock === 'number') {
                              console.log('Modal dispatching stock update:', result.stockUpdate);
                              dispatch(updateProductStock({
                                productId: result.stockUpdate.productId,
                                newStock: result.stockUpdate.newStock
                              }));
                            } else {
                              console.warn('Modal: No stock update info received:', result.stockUpdate);
                            }
                            
                            setSelectedProduct(null);
                          } catch (error) {
                            console.error('Failed to add item to cart:', error);
                          } finally {
                            setModalAddingToCart(false);
                          }
                        }}
                        disabled={selectedProduct.stock === 0 || modalAddingToCart}
                        className="w-full py-3 px-6 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {selectedProduct.stock === 0 
                          ? 'Out of Stock' 
                          : modalAddingToCart
                          ? 'Adding...'
                          : 'Add to Cart'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;