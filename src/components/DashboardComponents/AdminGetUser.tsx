import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Search, X, AlertCircle, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserById, clearUserError, clearSelectedUser, deleteUser, clearDeleteSuccess } from '../../store/userSlice';

const AdminGetUser = () => {
  const [userId, setUserId] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const { selectedUser, loading, deleting, error, deleteSuccess } = useAppSelector((state) => state.user);

  const handleGetUser = async () => {
    if (!userId.trim()) {
      return;
    }

    try {
      await dispatch(fetchUserById(userId.trim())).unwrap();

    } catch (error) {
      // Error is handled by the reducer
      console.error('Failed to fetch user:', error);
    }
  };

  const handleClearUser = () => {
    dispatch(clearSelectedUser());
    setUserId('');
  };

  const handleClearError = () => {
    dispatch(clearUserError());
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) return;

    try {
      await dispatch(deleteUser(selectedUser._id)).unwrap();
      setShowDeleteConfirm(false);
      // Clear the user data after successful deletion
      setTimeout(() => {
        dispatch(clearDeleteSuccess());
      }, 3000);
    } catch (error) {
      console.error('Failed to delete user:', error);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Get User Details</h1>
      
      {/* Input Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-2">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleGetUser();
                }
              }}
            />
          </div>
          <div className="flex gap-2 items-end">
            <button
              onClick={handleGetUser}
              disabled={!userId.trim() || loading}
              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Get User Details
                </>
              )}
            </button>
            {selectedUser && (
              <button
                onClick={handleClearUser}
                className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Section */}
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

      {/* Delete Success Message */}
      {deleteSuccess && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <div className="flex items-center gap-2 text-green-300">
            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="font-medium">Success</span>
          </div>
          <p className="text-green-200 mt-2">User has been successfully deleted.</p>
        </div>
      )}

      {/* User Card Section */}
      {selectedUser && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details
            </h2>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-300 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </>
              )}
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                  Basic Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="text-white font-medium">{selectedUser.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Role</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.role === 'admin' 
                          ? 'bg-yellow-900 text-yellow-300' 
                          : 'bg-green-900 text-green-300'
                      }`}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                  Additional Information
                </h3>
                
                <div className="space-y-3">
                  {selectedUser.age && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Age</p>
                        <p className="text-white font-medium">{selectedUser.age} years old</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedUser.mobileNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Mobile Number</p>
                        <p className="text-white font-medium">{selectedUser.mobileNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedUser.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white font-medium">{selectedUser.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">User ID</p>
                  <p className="text-white font-mono">{selectedUser._id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Created At</p>
                  <p className="text-white">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Last Updated</p>
                  <p className="text-white">{formatDate(selectedUser.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedUser && !loading && !error && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No User Selected</h3>
          <p className="text-gray-500">Enter a user ID above to fetch user details</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete User</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete this user?
              </p>
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <p className="text-white font-medium">{selectedUser.name}</p>
                <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">{selectedUser._id}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium rounded-lg transition duration-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-300 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGetUser;