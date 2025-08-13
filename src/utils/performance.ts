// Performance monitoring and optimization utilities

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  constructor() {
    if (this.isEnabled && typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    try {
      // Observe navigation timing
      if ('PerformanceObserver' in window) {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart, 'timing');
              this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, 'timing');
              this.recordMetric('first_paint', navEntry.loadEventEnd - navEntry.fetchStart, 'timing');
            }
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);

        // Observe resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              this.recordMetric(`resource_${resourceEntry.name.split('/').pop()}`, resourceEntry.duration, 'timing');
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);

        // Observe largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('largest_contentful_paint', entry.startTime, 'timing');
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // Observe first input delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('first_input_delay', (entry as any).processingStart - entry.startTime, 'timing');
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Observe cumulative layout shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.recordMetric('cumulative_layout_shift', clsValue, 'gauge');
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      }
    } catch (error) {
      console.warn('Failed to initialize performance observers:', error);
    }
  }

  recordMetric(name: string, value: number, type: PerformanceMetric['type'] = 'gauge') {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log important metrics
    if (type === 'timing' && value > 1000) {
      console.warn(`⚠️ Slow ${name}: ${value.toFixed(2)}ms`);
    }
  }

  startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, 'timing');
    };
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const endTimer = this.startTimer(name);
    return fn().finally(endTimer);
  }

  measureSync<T>(name: string, fn: () => T): T {
    const endTimer = this.startTimer(name);
    try {
      return fn();
    } finally {
      endTimer();
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByType(type: PerformanceMetric['type']): PerformanceMetric[] {
    return this.metrics.filter(m => m.type === type);
  }

  getAverageMetric(name: string): number {
    const metrics = this.metrics.filter(m => m.name === name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  getLatestMetric(name: string): PerformanceMetric | null {
    const metrics = this.metrics.filter(m => m.name === name);
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  }

  clearMetrics() {
    this.metrics = [];
  }

  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {
        timing: this.getMetricsByType('timing').reduce((acc, m) => {
          acc[m.name] = {
            latest: m.value,
            average: this.getAverageMetric(m.name)
          };
          return acc;
        }, {} as Record<string, any>),
        counters: this.getMetricsByType('counter').reduce((acc, m) => {
          acc[m.name] = m.value;
          return acc;
        }, {} as Record<string, number>),
        gauges: this.getMetricsByType('gauge').reduce((acc, m) => {
          acc[m.name] = m.value;
          return acc;
        }, {} as Record<string, number>)
      },
      webVitals: {
        lcp: this.getLatestMetric('largest_contentful_paint')?.value || 0,
        fid: this.getLatestMetric('first_input_delay')?.value || 0,
        cls: this.getLatestMetric('cumulative_layout_shift')?.value || 0
      }
    };

    return JSON.stringify(report, null, 2);
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    startTimer: performanceMonitor.startTimer.bind(performanceMonitor),
    measureAsync: performanceMonitor.measureAsync.bind(performanceMonitor),
    measureSync: performanceMonitor.measureSync.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    generateReport: performanceMonitor.generateReport.bind(performanceMonitor)
  };
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function calls
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function calls
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Lazy load images
  lazyLoadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Check if element is in viewport
  isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Get memory usage (if available)
  getMemoryUsage(): any {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  },

  // Check connection quality
  getConnectionInfo(): any {
    if ('connection' in navigator) {
      return (navigator as any).connection;
    }
    return null;
  },

  // Preload critical resources
  preloadResource(href: string, as: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  },

  // Prefetch resources
  prefetchResource(href: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
};

// Web Vitals measurement
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Measure and report Core Web Vitals
  const reportWebVital = (metric: any) => {
    performanceMonitor.recordMetric(metric.name.toLowerCase(), metric.value, 'gauge');
    
    // Log poor scores
    const thresholds = {
      lcp: 2500, // Largest Contentful Paint
      fid: 100,  // First Input Delay
      cls: 0.1   // Cumulative Layout Shift
    };

    const threshold = thresholds[metric.name.toLowerCase() as keyof typeof thresholds];
    if (threshold && metric.value > threshold) {
      console.warn(`⚠️ Poor ${metric.name}: ${metric.value}`);
    }
  };

  // Use web-vitals library if available, otherwise use basic measurements
  if ('PerformanceObserver' in window) {
    try {
      // Basic LCP measurement
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportWebVital({ name: 'LCP', value: lastEntry.startTime });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Basic FID measurement
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          reportWebVital({ 
            name: 'FID', 
            value: (entry as any).processingStart - entry.startTime 
          });
        });
      }).observe({ entryTypes: ['first-input'] });

      // Basic CLS measurement
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        reportWebVital({ name: 'CLS', value: clsValue });
      }).observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Failed to measure Web Vitals:', error);
    }
  }
}