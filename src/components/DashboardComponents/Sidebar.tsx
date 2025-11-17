import { useState } from 'react';
import { 
  Home, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  X,
  ChevronDown,
  ChevronRight,
  UserSearch,
  UserCheck,
  UserX,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  onNavigate?: (section: string, subsection?: string) => void;
}

interface DropdownItem {
  name: string;
  icon: React.ElementType;
  key: string;
  onClick: () => void;
}

interface NavigationItem {
  name: string;
  key: string;
  icon: React.ElementType;
  current?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  onClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeSection = 'dashboard',
  onNavigate 
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleNavigation = (section: string, subsection?: string) => {
    onNavigate?.(section, subsection);
  };

  // User dropdown options
  const userDropdownItems: DropdownItem[] = [
    {
      name: 'Get Particular User',
      key: 'get-user',
      icon: UserSearch,
      onClick: () => handleNavigation('user', 'get-particular')
    },
    {
      name: 'Get All Users',
      key: 'get-all-users',
      icon: Users,
      onClick: () => handleNavigation('user', 'get-all')
    },
    {
      name: 'Update User',
      key: 'update-user',
      icon: UserCheck,
      onClick: () => handleNavigation('user', 'update')
    },
    {
      name: 'Delete User',
      key: 'delete-user',
      icon: UserX,
      onClick: () => handleNavigation('user', 'delete')
    }
  ];

  // Product dropdown options
  const productDropdownItems: DropdownItem[] = [
    {
      name: 'Create Product',
      key: 'create-product',
      icon: Plus,
      onClick: () => handleNavigation('product', 'create')
    },
    {
      name: 'Update Product',
      key: 'update-product',
      icon: Edit,
      onClick: () => handleNavigation('product', 'update')
    },
    {
      name: 'Delete Product',
      key: 'delete-product',
      icon: Trash2,
      onClick: () => handleNavigation('product', 'delete')
    },
    {
      name: 'Get All Products',
      key: 'get-all-products',
      icon: Package,
      onClick: () => handleNavigation('product', 'get-all')
    },
    {
      name: 'Get Product by ID',
      key: 'get-product-by-id',
      icon: Eye,
      onClick: () => handleNavigation('product', 'get-by-id')
    }
  ];

  const navigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      key: 'dashboard',
      icon: Home, 
      current: activeSection === 'dashboard',
      onClick: () => handleNavigation('dashboard')
    },
    { 
      name: 'User', 
      key: 'user',
      icon: Users, 
      current: activeSection === 'user',
      hasDropdown: true,
      dropdownItems: userDropdownItems
    },
    { 
      name: 'Product', 
      key: 'product',
      icon: Package, 
      current: activeSection === 'product',
      hasDropdown: true,
      dropdownItems: productDropdownItems
    },
    { 
      name: 'Analytics', 
      key: 'analytics',
      icon: BarChart3,
      current: activeSection === 'analytics',
      onClick: () => handleNavigation('analytics')
    },
    { 
      name: 'Settings', 
      key: 'settings',
      icon: Settings,
      current: activeSection === 'settings',
      onClick: () => handleNavigation('settings')
    },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg border-r border-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black text-lg font-bold">C</span>
          </div>
          <span className="ml-2 text-xl font-bold text-white">Crowdera</span>
        </div>
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-3 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {/* Main navigation item */}
              <button
                onClick={() => {
                  if (item.hasDropdown) {
                    toggleDropdown(item.name);
                  } else {
                    item.onClick?.();
                  }
                }}
                className={`w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  />
                  {item.name}
                </div>
                {item.hasDropdown && (
                  <div className="ml-2">
                    {openDropdowns.includes(item.name) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </button>

              {/* Dropdown items */}
              {item.hasDropdown && openDropdowns.includes(item.name) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.dropdownItems?.map((dropdownItem) => (
                    <button
                      key={dropdownItem.name}
                      onClick={dropdownItem.onClick}
                      className="w-full group flex items-center px-2 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200"
                    >
                      <dropdownItem.icon className="mr-3 h-4 w-4" />
                      {dropdownItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;