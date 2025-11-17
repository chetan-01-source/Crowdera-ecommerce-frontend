import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm animate-pulse">
      {/* Product Image Skeleton */}
      <div className="relative h-48 bg-gray-300 dark:bg-gray-600">
        {/* Stock Status Badge Skeleton */}
        <div className="absolute top-3 left-3">
          <div className="w-20 h-6 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
        </div>

        {/* Image Count Badge Skeleton */}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-6 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="p-4">
        {/* Header Skeleton */}
        <div className="mb-3">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="flex items-center justify-between">
            <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        </div>

        {/* Price and Stock Skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="w-14 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="w-12 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for rendering multiple skeleton cards
export const ProductCardSkeletonList: React.FC<{ count?: number }> = ({ count = 9 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;