import { ArrowRight } from 'lucide-react';

const CollectionPreview = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Men's Collection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Discover timeless pieces crafted for the modern man
              </p>
              <button className="group px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Women's Collection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Elegant essentials designed for every occasion
              </p>
              <button className="group px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
          
          <div className="relative h-96 lg:h-full">
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop"
              alt="Collection Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionPreview;