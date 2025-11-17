import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { 
  fetchAllProducts, 
  loadMoreProducts, 
  loadMoreSearchResults,
  refreshProducts, 
  clearProductError, 
  clearSearchResults 
} from '../../store/productSlice';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import SearchBar from './SearchBar';
import { ProductCardSkeletonList } from './ProductCardSkeleton';
import { RefreshCw, AlertCircle, Package, Loader2, Filter, Grid3X3 } from 'lucide-react';
import type { Product } from '../../api/productApi';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const {
    products,
    searchResults,
    isSearching,
    searchQuery,
    searchPagination,
    loading,
    loadingMore,
    searchingMore,
    error,
    searchError,
    pagination,
    totalCount,
    searchTotalCount,
    hasInitialized,
  } = useSelector((state: RootState) => state.product);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Determine which data to show based on search mode
  const displayProducts = isSearchMode ? searchResults : products;
  const displayPagination = isSearchMode ? searchPagination : pagination;
  const displayLoading = isSearchMode ? isSearching : loading;
  const displayLoadingMore = isSearchMode ? searchingMore : loadingMore;
  const displayError = isSearchMode ? searchError : error;
  const displayCount = isSearchMode ? searchTotalCount : totalCount;

  // Initialize product list
  useEffect(() => {
    if (!hasInitialized && !isSearchMode) {
      dispatch(fetchAllProducts({ limit: 30, sortOrder: 'desc' }));
    }
  }, [dispatch, hasInitialized, isSearchMode]);

  // Intersection Observer for infinite scroll
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (displayLoading || displayLoadingMore) return;
      
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayPagination?.hasMore) {
          if (isSearchMode && searchQuery) {
            dispatch(loadMoreSearchResults({ 
              query: searchQuery, 
              limit: 20, 
              sortOrder: 'desc' 
            }));
          } else {
            dispatch(loadMoreProducts({ limit: 30, sortOrder: 'desc' }));
          }
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [displayLoading, displayLoadingMore, displayPagination?.hasMore, dispatch, isSearchMode, searchQuery]
  );

  // Handle search state changes
  const handleSearchStateChange = useCallback((searching: boolean) => {
    setIsSearchMode(searching);
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    if (isSearchMode) {
      dispatch(clearSearchResults());
      setIsSearchMode(false);
    } else {
      dispatch(refreshProducts({ limit: 30, sortOrder: 'desc' }));
    }
  };

  // Handle error dismiss
  const handleDismissError = () => {
    if (isSearchMode) {
      dispatch(clearSearchResults());
    } else {
      dispatch(clearProductError());
    }
  };

  // Handle product card click
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedProduct(null);
  };

  if (displayLoading && !hasInitialized && !isSearchMode) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 animate-pulse mb-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Cards skeleton */}
        <ProductCardSkeletonList count={9} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto">
        <SearchBar 
          onSearchStateChange={handleSearchStateChange}
          placeholder="Search products by name..."
          className="w-full"
        />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isSearchMode ? 'Search Results' : 'Products'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {displayCount > 0 
                ? `${displayCount} product${displayCount !== 1 ? 's' : ''} ${isSearchMode ? 'found' : 'available'}`
                : isSearchMode ? 'No search results' : 'No products found'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button className="p-2 bg-blue-600 text-white rounded-md transition-colors">
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={displayLoading}
            className="
              flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
              disabled:bg-gray-400 text-white rounded-lg font-medium 
              transition-colors duration-200 disabled:cursor-not-allowed
            "
          >
            <RefreshCw 
              className={`w-4 h-4 ${displayLoading ? 'animate-spin' : ''}`} 
            />
            <span>{isSearchMode ? 'Clear Search' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {displayError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                {isSearchMode ? 'Search error' : 'Error loading products'}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {displayError}
              </p>
            </div>
            <button
              onClick={handleDismissError}
              className="ml-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product, index) => {
            const isLast = index === displayProducts.length - 1;
            return (
              <div
                key={product.id}
                ref={isLast ? lastProductElementRef : null}
              >
                <ProductCard 
                  product={product} 
                  onClick={handleProductClick}
                />
              </div>
            );
          })}
        </div>
      ) : (
        !displayLoading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isSearchMode ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isSearchMode 
                ? 'Try adjusting your search terms.' 
                : 'There are no products to display at the moment.'
              }
            </p>
          </div>
        )
      )}

      {/* Load More Indicator */}
      {displayLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">
              {isSearchMode ? 'Loading more results...' : 'Loading more products...'}
            </span>
          </div>
        </div>
      )}

      {/* End of List Indicator */}
      {displayPagination && !displayPagination.hasMore && displayProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">You've reached the end of the list</p>
          <p className="text-xs mt-1">
            Showing all {displayCount} product{displayCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={loadMoreRef} className="h-1" />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ProductList;