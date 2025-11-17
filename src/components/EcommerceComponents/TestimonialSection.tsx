import { Star } from 'lucide-react';

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 tracking-widest uppercase">
            Reviews
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-light mb-8 text-gray-800 dark:text-gray-200 leading-relaxed">
            "I love the quality — the fabric feels premium and the fit is perfect. I've received compliments and will order."
          </blockquote>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Emma Collins</p>
            <p className="text-gray-500 dark:text-gray-400">Verified Buyer</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;