import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User,
  ShoppingCart
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCartCount, fetchCartAsync } from '../../store/cartSlice';
import { getCurrentUser } from '../../store/authSlice';
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';
import ProfileModal from './ProfileModal';
import CollectionPreview from './CollectionPreview';
import AboutSection from './AboutSection';
import TestimonialSection from './TestimonialSection';
import SocialMediaSection from './SocialMediaSection';
import NewsletterSection from './NewsletterSection';
import FeaturesSection from './FeaturesSection';

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useAppDispatch();
  
  const cartCount = useAppSelector(selectCartCount);
   console.log('Cart Count in Home:', cartCount);
  const { user } = useAppSelector((state) => state.auth);

  // Fetch cart when component mounts
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  // Fetch current user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header with profile and cart */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 bg-opacity-95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-black dark:text-white">CROWDERA</div>
            
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link 
                to="/cart"
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {/* Profile */}
              <button 
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user ? user.name.split(' ')[0] : 'Profile'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Product Grid with Search */}
        <ProductGrid
          title="Our Most Popular Pieces This Season"
          showSearch={true}
          filterType="all"
          limit={12}
        />

        {/* Collection Preview */}
        <CollectionPreview />

        {/* New Arrivals - Scrollable with desc order (newest first) */}
        <ProductGrid
          title="This Season's Must-Haves"
          subtitle="New Arrivals"
          filterType="new"
          sortOrder="desc"
        />

        {/* About Section */}
        <AboutSection />

        {/* Sale Products - Scrollable with asc order (oldest first) */}
        <ProductGrid
          title="Top Picks, Now on Discount"
          subtitle="Discounts"
          filterType="sale"
          sortOrder="asc"
        />

        {/* Testimonial Section */}
        <TestimonialSection />

        {/* Social Media Section */}
        <SocialMediaSection />

        {/* Newsletter Section */}
        <NewsletterSection />

        {/* Features Section */}
        <FeaturesSection />
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
};

export default Home;
