import { ArrowRight } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-20 bg-black dark:bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-300 mb-4 tracking-widest uppercase">
          About Crowdera
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wide">
          Pieces beyond seasons, created to adapt and remain timeless.
        </h2>
        <button className="group px-8 py-4 border border-white dark:border-gray-300 text-white dark:text-gray-300 hover:bg-white hover:text-black dark:hover:bg-gray-300 dark:hover:text-black transition-colors duration-300 flex items-center gap-2 mx-auto">
          Our Story
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
};

export default AboutSection;