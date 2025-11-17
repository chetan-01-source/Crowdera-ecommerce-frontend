import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { fetchUsers, loadMoreUsers, refreshUsers, clearError } from '../../store/userListSlice';
import UserCard from './UserCard';
import { UserCardSkeletonList } from '../UserCardSkeleton';
import { RefreshCw, AlertCircle, Users, Loader2 } from 'lucide-react';
import type { User } from '../../api/userApi';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    loading,
    loadingMore,
    error,
    pagination,
    hasInitialized,
  } = useSelector((state: RootState) => state.userList);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Initialize user list
  useEffect(() => {
    if (!hasInitialized) {
      dispatch(fetchUsers({ limit: 30, sortOrder: 'desc' }));
    }
  }, [dispatch, hasInitialized]);

  // Intersection Observer for infinite scroll
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination?.hasMore) {
          dispatch(loadMoreUsers({ limit: 30, sortOrder: 'desc' }));
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, pagination?.hasMore, dispatch]
  );

  // Handle refresh
  const handleRefresh = () => {
    dispatch(refreshUsers({ limit: 30, sortOrder: 'desc' }));
  };

  // Handle error dismiss
  const handleDismissError = () => {
    dispatch(clearError());
  };

  // Handle user card click
  const handleUserClick = () => {
 
    // You can implement navigation or modal opening here
  };

  if (loading && !hasInitialized) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Cards skeleton */}
        <UserCardSkeletonList count={9} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Users
            </h1>
           
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="
            flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
            disabled:bg-gray-400 text-white rounded-lg font-medium 
            transition-colors duration-200 disabled:cursor-not-allowed
          "
        >
          <RefreshCw 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Error loading users
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {error}
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

      {/* Users Grid */}
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: User, index: number) => {
            const isLast = index === users.length - 1;
            return (
              <div
                key={user._id}
                ref={isLast ? lastUserElementRef : null}
              >
                <UserCard 
                  user={user} 
                  onClick={handleUserClick}
                />
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              There are no users to display at the moment.
            </p>
          </div>
        )
      )}

      {/* Load More Indicator */}
      {loadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading more users...</span>
          </div>
        </div>
      )}

      {/* End of List Indicator */}
      {pagination && !pagination.hasMore && users.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">You've reached the end of the list</p>
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
};

export default UserList;