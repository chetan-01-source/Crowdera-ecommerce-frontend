import { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <section className="py-20 bg-black dark:bg-gray-800 text-white">
      <div className="max-w-md mx-auto px-6 text-center">
        <h3 className="text-2xl font-light mb-4">Stay in the loop</h3>
        <p className="text-gray-400 dark:text-gray-300 mb-8">
          Subscribe to our newsletter for new arrivals and special offers.
        </p>
        
        <form onSubmit={handleNewsletterSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 border border-gray-200 dark:border-gray-600"
          />
          <button 
            type="submit"
            className="w-full px-4 py-3 bg-white dark:bg-gray-300 text-black font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors duration-300"
          >
            Submit
          </button>
        </form>
        
        <p className="text-xs text-gray-400 dark:text-gray-300 mt-4">
          By subscribing to our newsletter, you agree to receive emails from us and accept our Privacy Policy.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;