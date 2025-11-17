import { Instagram, Facebook, Twitter } from 'lucide-react';

const SocialMediaSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 tracking-widest uppercase">
            Socials
          </p>
          <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wide text-gray-900 dark:text-white">
            Follow us on social media @crowdera for updates
          </h2>
        </div>
        
        <div className="flex justify-center gap-6 mb-16">
          <a href="#" className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300">
            <Twitter className="w-6 h-6" />
          </a>
        </div>
        
        {/* Instagram-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop', // Shopping/retail
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=300&fit=crop', // Products
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop', // Fashion
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'  // Technology
          ].map((imageUrl, index) => (
            <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer border border-gray-300 dark:border-gray-600">
              <img 
                src={imageUrl}
                alt={`Social post ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;