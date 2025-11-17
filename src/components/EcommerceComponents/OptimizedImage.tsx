import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  placeholder?: string;
  blurDataURL?: string;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  priority = false,
  onLoad,
  onError,
  placeholder,
  blurDataURL
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URLs
  const generateOptimizedUrl = (originalSrc: string, w?: number, h?: number, q = quality) => {
    // If it's an Unsplash URL, use their optimization parameters
    if (originalSrc.includes('unsplash.com')) {
      const baseUrl = originalSrc.split('?')[0];
      const params = new URLSearchParams();
      if (w) params.set('w', w.toString());
      if (h) params.set('h', h.toString());
      params.set('q', q.toString());
      params.set('fm', 'webp');
      params.set('fit', 'crop');
      return `${baseUrl}?${params.toString()}`;
    }
    
    // For other URLs, return as is (in a real app, you'd use your CDN here)
    return originalSrc;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    if (!width) return undefined;
    
    const sizes = [1, 1.5, 2]; // 1x, 1.5x, 2x pixel density
    return sizes
      .map(size => {
        const w = Math.round(width * size);
        const h = height ? Math.round(height * size) : undefined;
        return `${generateOptimizedUrl(originalSrc, w, h)} ${size}x`;
      })
      .join(', ');
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load images 50px before they come into view
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    // Fallback to a placeholder image
    const target = e.target as HTMLImageElement;
    const fallbackUrl = placeholder || 
      `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=${width || 400}&h=${height || 400}&fit=crop&q=${quality}`;
    target.src = fallbackUrl;
    onError?.(e);
  };

  // Default blur placeholder
  const defaultBlurDataURL = blurDataURL || 
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhPE3G6RtqwSeI8FkuSMlpW5GaQWQy66iJAMAA8AHUFJKJBmT7Jrzi1Ih+3YwkLc1Jz9fJOAMMI8FkEXjB1PD/Qj0IkMtvAWMAdpBKMLlh6mjRVVhKTq6VPtTy0u0KY7VDIDbxtJGrZUKCOtP4w0iXl3w8Yk2gTqEGkbKXQ28S3vj+5O8t5tLcWN+FVmRQO+b8="

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder background */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 transition-opacity duration-300"
          style={{
            backgroundImage: `url("${defaultBlurDataURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={generateOptimizedUrl(src, width, height)}
          srcSet={generateSrcSet(src)}
          sizes={width ? `(max-width: 768px) 100vw, ${width}px` : '100vw'}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">{alt}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Add shimmer animation styles
const shimmerStyles = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('optimized-image-styles')) {
  const style = document.createElement('style');
  style.id = 'optimized-image-styles';
  style.textContent = shimmerStyles;
  document.head.appendChild(style);
}

export default OptimizedImage;