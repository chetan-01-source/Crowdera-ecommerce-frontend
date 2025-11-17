import { useState } from 'react';
import { User, ShoppingBag, Heart, MapPin, Phone, Mail, X, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const { user } = useAppSelector((state) => state.auth);
  const { cartTotal, cartCount } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  if (!isOpen) return null;

  const mockOrders = [
    {
      id: '1',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 3
    },
    {
      id: '2',
      date: '2024-01-10',
      status: 'Shipped',
      total: 156.50,
      items: 2
    },
    {
      id: '3',
      date: '2024-01-05',
      status: 'Processing',
      total: 234.99,
      items: 4
    }
  ];

  const mockWishlist = [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Comfort Hoodie',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl max-w-6xl w-full my-4 sm:my-0 max-h-none sm:max-h-[95vh] overflow-hidden shadow-2xl border border-gray-700">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
            <h2 className="text-xl sm:text-2xl font-bold text-white">My Account</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-full lg:w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-b lg:border-b-0 lg:border-r border-gray-700 p-4 sm:p-6 overflow-y-auto">
              {/* User Info */}
              <div className="flex flex-col items-center mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-xl">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-1">
                  {user?.name || 'Guest User'}
                </h3>
                <p className="text-sm text-gray-300 text-center break-all mb-3">
                  {user?.email || 'guest@example.com'}
                </p>
                <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-purple-900 text-purple-200 border border-purple-700' 
                    : 'bg-blue-900 text-blue-200 border border-blue-700'
                }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 mb-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium ${
                    activeTab === 'profile' 
                      ? 'bg-white text-gray-900 shadow-lg transform scale-[0.98]' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
                  }`}
                >
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span>Profile Info</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium ${
                    activeTab === 'orders' 
                      ? 'bg-white text-gray-900 shadow-lg transform scale-[0.98]' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium ${
                    activeTab === 'wishlist' 
                      ? 'bg-white text-gray-900 shadow-lg transform scale-[0.98]' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
                  }`}
                >
                  <Heart className="w-5 h-5 flex-shrink-0" />
                  <span>Wishlist</span>
                </button>
              </nav>

              {/* Cart Summary */}
              <div className="p-4 bg-gradient-to-br from-emerald-900 to-green-900 border border-emerald-700 rounded-xl mb-4 shadow-lg">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  Shopping Cart
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-200">Items:</span>
                    <span className="font-bold text-white">{cartCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-200">Total:</span>
                    <span className="font-bold text-emerald-400 text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[0.98]"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-800">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <User className="w-6 h-6 text-blue-400" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                          <div className="p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium">
                            {user?.name || 'Not provided'}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                          <div className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800">
                            <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <span className="font-medium break-all text-white">{user?.email || 'Not provided'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                          <div className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800">
                            <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="font-medium text-white">{user?.mobileNumber || 'Not provided'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Age</label>
                          <div className="p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium">
                            {user?.age ? `${user.age} years` : 'Not provided'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Account Role</label>
                          <div className="p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              user?.role === 'admin' 
                                ? 'bg-purple-900 text-purple-200 border border-purple-700' 
                                : 'bg-blue-900 text-blue-200 border border-blue-700'
                            }`}>
                              {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Member Since</label>
                          <div className="p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                          </div>
                        </div>

                       <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Address</label>
                          <div className="flex items-start gap-3 p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 min-h-[4rem]">
                            <MapPin className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="whitespace-pre-wrap break-words font-medium text-white">
                              {user?.address || 'Not provided'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6 text-green-400" />
                      Order History
                    </h3>
                    
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border border-gray-600 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-gray-700 to-gray-800">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-lg text-white">Order #{order.id}</h4>
                              <p className="text-sm text-gray-300">{order.date}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' 
                                ? 'bg-green-900 text-green-200 border border-green-700' 
                                : order.status === 'Shipped'
                                ? 'bg-blue-900 text-blue-200 border border-blue-700'
                                : 'bg-yellow-900 text-yellow-200 border border-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-300 font-medium">{order.items} items</p>
                            <p className="font-bold text-lg text-green-400">${order.total}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-red-400" />
                      My Wishlist
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockWishlist.map((item) => (
                        <div key={item.id} className="border border-gray-600 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-700 to-gray-800">
                          <div className="flex gap-4">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg shadow-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-bold mb-2 text-white">{item.name}</h4>
                              <p className="text-lg font-bold text-green-400 mb-3">${item.price}</p>
                              <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white text-gray-900 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                                  Add to Cart
                                </button>
                                <button className="px-4 py-2 border border-gray-500 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;