import { Truck, Shield, Clock, Phone } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Free shipping from $149
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Fast and reliable delivery
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Easy returns within 30 days
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Hassle-free returns
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Secure payments online
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Your data is protected
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              24/7 customer support
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We're here to help
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;