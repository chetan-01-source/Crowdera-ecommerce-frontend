import React from 'react';

const UserCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-pulse">
      {/* Header with Avatar and Name */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="flex items-center space-x-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        {/* Email */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
        </div>

        {/* Phone Number */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        </div>

        {/* Address */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
        </div>

        {/* Age */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
      </div>

      {/* Footer with timestamps */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Component for rendering multiple skeleton cards
export const UserCardSkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <UserCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default UserCardSkeleton;