import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Bell,
  Menu, 
  User,
  LogOut 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, getCurrentUser } from '../store/authSlice';
import Sidebar from './DashboardComponents/Sidebar';
import AdminGetUser from './DashboardComponents/AdminGetUser';
import UserList from './DashboardComponents/UserList';
import CreateProduct from './DashboardComponents/CreateProduct';
import UpdateProduct from './DashboardComponents/UpdateProduct';
import GetProductById from './DashboardComponents/GetProductById';
import DeleteProduct from './DashboardComponents/DeleteProduct';
import ProductList from './DashboardComponents/ProductList';
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubsection, setActiveSubsection] = useState<string | undefined>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user) {
      // Try to get current user data if authenticated but no user data
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigation = (section: string, subsection?: string) => {
    setActiveSection(section);
    setActiveSubsection(subsection);
    // Close sidebar on mobile after navigation
    setSidebarOpen(false);
  };

  const stats = [
    { name: 'Total Users', stat: '71,897', change: '+12%', changeType: 'increase' },
    { name: 'Total Orders', stat: '58,164', change: '+8.1%', changeType: 'increase' },
    { name: 'Total Revenue', stat: '$245,692', change: '+24.5%', changeType: 'increase' },
    { name: 'Active Products', stat: '1,429', change: '-3.2%', changeType: 'decrease' },
  ];

  const recentOrders = [
    { id: '#3066', customer: 'John Doe', amount: '$89.90', status: 'Completed', date: '2 hours ago' },
    { id: '#3065', customer: 'Jane Smith', amount: '$124.50', status: 'Processing', date: '4 hours ago' },
    { id: '#3064', customer: 'Mike Johnson', amount: '$67.20', status: 'Shipped', date: '6 hours ago' },
    { id: '#3063', customer: 'Sarah Wilson', amount: '$156.80', status: 'Completed', date: '8 hours ago' },
  ];

  const renderMainContent = () => {
    // Return different content based on active section and subsection
    if (activeSection === 'user') {
      return (
        <div>
          <h1 className="text-2xl font-semibold text-white mb-6">User Management</h1>
          {activeSubsection === 'get-particular' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Get User Details
              </h2>
              <AdminGetUser />
            </div>
          )}
          {activeSubsection === 'get-all' && (
            <UserList />
          )}

              {activeSubsection == 'delete' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Get User Details
              </h2>
              <AdminGetUser />
            </div>
          )}
          {!activeSubsection && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                User Management
              </h2>
              <p className="text-gray-300">
                Select an option from the sidebar to manage users.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (activeSection === 'product') {
      return (
        <div>
          <h1 className="text-2xl font-semibold text-white mb-6">Product Management</h1>
          {activeSubsection === 'create' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <CreateProduct />
            </div>
          )}
          {activeSubsection === 'update' && (
            <UpdateProduct />
          )}
          {activeSubsection === 'get-by-id' && (
            <GetProductById />
          )}
          {activeSubsection === 'delete' && (
            <DeleteProduct />
          )}
          {activeSubsection === 'get-all' && (
            <ProductList />
          )}
          {!activeSubsection && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Product Management
              </h2>
              <p className="text-gray-300">
                Select an option from the sidebar to manage products.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (activeSection === 'analytics') {
      return (
        <div>
          <h1 className="text-2xl font-semibold text-white mb-6">Analytics</h1>
          <p className="text-gray-300">Analytics content will be implemented here.</p>
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div>
          <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>
          <p className="text-gray-300">Settings content will be implemented here.</p>
        </div>
      );
    }

    // Default dashboard content
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.name} className="bg-gray-900 border border-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-black" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-300 truncate">{item.name}</dt>
                        <dd className="text-lg font-medium text-white">{item.stat}</dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      item.changeType === 'increase' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {item.change}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <div className="bg-gray-900 border border-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-white mb-4">Recent Orders</h3>
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'Completed' ? 'bg-green-900 text-green-300' :
                              order.status === 'Processing' ? 'bg-yellow-900 text-yellow-300' :
                              'bg-blue-900 text-blue-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-black">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onNavigate={handleNavigation}
      />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-gray-900 shadow border-b border-gray-800">
          <button
            className="px-4 border-r border-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
               
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <User className="h-5 w-5 text-black" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-white">
                    {user ? user.name : 'Admin User'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-black">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {renderMainContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;