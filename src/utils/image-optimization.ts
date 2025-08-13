// Image optimization utilities for better performance

interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
  lazy?: boolean;
}

class ImageOptimizer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  // Compress and resize image
  async optimizeImage(
    file: File, 
    options: ImageOptimizationOptions = {}
  ): Promise<Blob> {
    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      format = 'webp'
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        if (!this.canvas || !this.ctx) {
          reject(new Error('Canvas not available'));
          return;
        }

        // Calculate new dimensions
        let { width, height } = this.calculateDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight
        );

        // Set canvas size
        this.canvas.width = width;
        this.canvas.height = height;

        // Draw and compress image
        this.ctx.drawImage(img, 0, 0, width, height);
        
        this.canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Calculate scaling factor
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    return { width, height };
  }

  // Generate responsive image srcset
  generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes
      .map(size => `${baseUrl}?w=${size} ${size}w`)
      .join(', ');
  }

  // Lazy loading intersection observer
  createLazyLoadObserver(callback: (entries: IntersectionObserverEntry[]) => void): IntersectionObserver {
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }

  // Preload critical images
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  // Convert image to WebP if supported
  async convertToWebP(file: File): Promise<Blob> {
    if (!this.supportsWebP()) {
      return file;
    }

    return this.optimizeImage(file, { format: 'webp' });
  }

  // Check WebP support
  supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Get image dimensions without loading full image
  getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}

// Singleton instance
export const imageOptimizer = new ImageOptimizer();

// React hook for image optimization
export function useImageOptimization() {
  const optimizeImage = async (
    file: File, 
    options?: ImageOptimizationOptions
  ): Promise<Blob> => {
    return imageOptimizer.optimizeImage(file, options);
  };

  const preloadImages = async (urls: string[]): Promise<void> => {
    await Promise.all(urls.map(url => imageOptimizer.preloadImage(url)));
  };

  return {
    optimizeImage,
    preloadImages,
    supportsWebP: imageOptimizer.supportsWebP(),
    getImageDimensions: imageOptimizer.getImageDimensions.bind(imageOptimizer)
  };
}

// Lazy image component
export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  sizes,
  srcSet,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = imageOptimizer.createLazyLoadObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={isInView && !hasError ? src : placeholder}
      srcSet={isInView && !hasError ? srcSet : undefined}
      sizes={sizes}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
}

// Import React hooks
import { useState, useEffect, useRef } from 'react';