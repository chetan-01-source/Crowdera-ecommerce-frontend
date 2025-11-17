import React from 'react';
import { Mail, Phone, MapPin, Calendar, Shield, User as UserIcon } from 'lucide-react';
import type { User } from '../../api/userApi';

interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role: string) => {
    const isAdmin = role === 'admin';
    return (
      <span
        className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${
            isAdmin
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
          }
        `}
      >
        <Shield className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getProviderBadge = (provider: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </span>
    );
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
        p-6 shadow-sm hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-600' : ''}
      `}
      onClick={() => onClick?.(user)}
    >
      {/* Header with Avatar and Name */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {user.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            {getRoleBadge(user.role)}
            {user.provider && getProviderBadge(user.provider)}
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        {/* Email */}
        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {user.email}
          </span>
        </div>

        {/* Phone Number */}
        {user.mobileNumber && (
          <div className="flex items-center space-x-3">
            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.mobileNumber}
            </span>
          </div>
        )}

        {/* Address */}
        {user.address && user.address !== 'Not provided' && (
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {user.address}
            </span>
          </div>
        )}

        {/* Age */}
        {user.age && (
          <div className="flex items-center space-x-3">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.age} years old
            </span>
          </div>
        )}
      </div>

      {/* Footer with timestamps */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
          {user.updatedAt !== user.createdAt && (
            <div className="flex items-center space-x-1">
              <span>Updated {formatDate(user.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;