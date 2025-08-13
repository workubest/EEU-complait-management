// API caching and optimization utilities
import { ApiResponse } from './api';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface RequestCache {
  [key: string]: Promise<any>;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private requestCache: RequestCache = {};
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100;

  // Cache configuration for different endpoints
  private readonly cacheConfig = {
    'getDashboardData': { ttl: 2 * 60 * 1000 }, // 2 minutes
    'getUsers': { ttl: 10 * 60 * 1000 }, // 10 minutes
    'getComplaints': { ttl: 1 * 60 * 1000 }, // 1 minute
    'getCustomers': { ttl: 15 * 60 * 1000 }, // 15 minutes
    'searchComplaints': { ttl: 30 * 1000 }, // 30 seconds
    'getComplaintById': { ttl: 5 * 60 * 1000 }, // 5 minutes
  };

  private getCacheKey(endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  private getTTL(endpoint: string): number {
    const config = this.cacheConfig[endpoint as keyof typeof this.cacheConfig];
    return config?.ttl || this.DEFAULT_TTL;
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }

  private enforceMaxSize(): void {
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.MAX_CACHE_SIZE + 10);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  get<T>(endpoint: string, params?: any): T | null {
    this.cleanupExpiredEntries();
    
    const key = this.getCacheKey(endpoint, params);
    const entry = this.cache.get(key);
    
    if (entry && entry.expiresAt > Date.now()) {
      console.log(`🎯 Cache hit for ${endpoint}`);
      return entry.data;
    }
    
    return null;
  }

  set<T>(endpoint: string, data: T, params?: any): void {
    const key = this.getCacheKey(endpoint, params);
    const ttl = this.getTTL(endpoint);
    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
    
    this.enforceMaxSize();
    console.log(`💾 Cached data for ${endpoint} (TTL: ${ttl}ms)`);
  }

  invalidate(endpoint: string, params?: any): void {
    if (params) {
      const key = this.getCacheKey(endpoint, params);
      this.cache.delete(key);
    } else {
      // Invalidate all entries for this endpoint
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${endpoint}:`)) {
          this.cache.delete(key);
        }
      }
    }
    console.log(`🗑️ Invalidated cache for ${endpoint}`);
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
    console.log(`🗑️ Invalidated cache entries matching pattern: ${pattern}`);
  }

  clear(): void {
    this.cache.clear();
    this.requestCache = {};
    console.log('🧹 Cleared all cache');
  }

  // Request deduplication
  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (this.requestCache[key]) {
      console.log(`🔄 Deduplicating request: ${key}`);
      return this.requestCache[key];
    }

    const promise = requestFn().finally(() => {
      delete this.requestCache[key];
    });

    this.requestCache[key] = promise;
    return promise;
  }

  // Cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const entry of this.cache.values()) {
      if (entry.expiresAt < now) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      pendingRequests: Object.keys(this.requestCache).length,
    };
  }
}

// Singleton instance
export const apiCache = new ApiCache();

// Cache invalidation helpers
export const invalidateComplaintCache = () => {
  apiCache.invalidatePattern('getComplaints');
  apiCache.invalidatePattern('searchComplaints');
  apiCache.invalidatePattern('getComplaintById');
  apiCache.invalidate('getDashboardData');
};

export const invalidateUserCache = () => {
  apiCache.invalidatePattern('getUsers');
  apiCache.invalidate('getDashboardData');
};

export const invalidateCustomerCache = () => {
  apiCache.invalidatePattern('getCustomers');
  apiCache.invalidatePattern('searchCustomer');
};

// Preload critical data
export const preloadCriticalData = async (apiService: any, user: any) => {
  try {
    console.log('🚀 Preloading critical data...');
    
    // Preload dashboard data
    const dashboardPromise = apiService.getDashboardData(user.role, user.region);
    
    // Preload recent complaints if user has access
    const complaintsPromise = user.role !== 'customer' 
      ? apiService.getComplaints({ limit: 10, status: 'open' })
      : Promise.resolve(null);
    
    await Promise.allSettled([dashboardPromise, complaintsPromise]);
    console.log('✅ Critical data preloaded');
  } catch (error) {
    console.warn('⚠️ Failed to preload some critical data:', error);
  }
};