import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroSlide {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

const heroSlides: HeroSlide[] = [
  {
    title: "Timeless Essentials for the Season",
    subtitle: "Discover our curated collection of premium quality basics",
    buttonText: "Shop Now",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
  },
  {
    title: "New Arrivals Just Dropped",
    subtitle: "Fresh styles for the modern wardrobe",
    buttonText: "Explore Collection",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop"
  },
  {
    title: "Premium Quality Materials",
    subtitle: "Crafted with attention to detail and sustainability",
    buttonText: "Learn More",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop"
  }
];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroSlides[currentSlide].image}
          alt="Hero"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to Unsplash image if local image fails
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-${1441986300917 + currentSlide * 100000}?w=1920&h=1080&fit=crop`;
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider text-white drop-shadow-lg">
          {heroSlides[currentSlide].title}
        </h1>
        <p className="text-lg md:text-xl mb-8 font-light text-white/90 drop-shadow-lg">
          {heroSlides[currentSlide].subtitle}
        </p>
        <button 
          onClick={handleScrollDown}
          className="group px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 mx-auto shadow-lg"
        >
          {heroSlides[currentSlide].buttonText}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Hero Navigation */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-600"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-600"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-200" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              index === currentSlide 
                ? 'bg-white dark:bg-gray-200 border-white dark:border-gray-200' 
                : 'bg-transparent border-white/60 dark:border-gray-300/60 hover:border-white dark:hover:border-gray-200'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;