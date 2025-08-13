import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { optimizedApiService } from '@/lib/api-optimized';
import { performanceMonitor } from '@/utils/performance';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  // Performance optimizations
  enableBackground?: boolean;
  enablePrefetch?: boolean;
  enableRetry?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

export function useOptimizedQuery<T>(options: OptimizedQueryOptions<T>) {
  const queryClient = useQueryClient();
  const performanceTimerRef = useRef<(() => void) | null>(null);

  const {
    queryKey,
    queryFn,
    enableBackground = true,
    enablePrefetch = false,
    enableRetry = true,
    cacheTime = 10 * 60 * 1000, // 10 minutes
    staleTime = 5 * 60 * 1000,  // 5 minutes
    ...queryOptions
  } = options;

  // Wrap query function with performance monitoring
  const wrappedQueryFn = useCallback(async () => {
    const timerName = `query_${queryKey.join('_')}`;
    performanceTimerRef.current = performanceMonitor.startTimer(timerName);
    
    try {
      const result = await queryFn();
      performanceMonitor.recordMetric(`${timerName}_success`, 1, 'counter');
      return result;
    } catch (error) {
      performanceMonitor.recordMetric(`${timerName}_error`, 1, 'counter');
      throw error;
    } finally {
      if (performanceTimerRef.current) {
        performanceTimerRef.current();
        performanceTimerRef.current = null;
      }
    }
  }, [queryKey, queryFn]);

  // Configure query options with performance optimizations
  const optimizedOptions: UseQueryOptions<T> = {
    queryKey,
    queryFn: wrappedQueryFn,
    cacheTime,
    staleTime,
    retry: enableRetry ? 2 : false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    refetchInterval: enableBackground ? 5 * 60 * 1000 : false, // 5 minutes
    ...queryOptions,
  };

  const query = useQuery(optimizedOptions);

  // Prefetch related data
  useEffect(() => {
    if (enablePrefetch && query.isSuccess) {
      // Prefetch related queries based on query key patterns
      const prefetchQueries = getPrefetchQueries(queryKey);
      prefetchQueries.forEach(({ key, fn }) => {
        queryClient.prefetchQuery({
          queryKey: key,
          queryFn: fn,
          staleTime: staleTime / 2, // Shorter stale time for prefetched data
        });
      });
    }
  }, [enablePrefetch, query.isSuccess, queryClient, queryKey, staleTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (performanceTimerRef.current) {
        performanceTimerRef.current();
      }
    };
  }, []);

  return query;
}

// Helper function to determine related queries to prefetch
function getPrefetchQueries(queryKey: string[]): Array<{ key: string[], fn: () => Promise<any> }> {
  const prefetchQueries: Array<{ key: string[], fn: () => Promise<any> }> = [];

  // Define prefetch patterns
  const patterns = {
    dashboard: () => [
      { key: ['complaints', 'recent'], fn: () => optimizedApiService.getComplaints({ limit: 10 }) },
      { key: ['users', 'active'], fn: () => optimizedApiService.getUsers() },
    ],
    complaints: () => [
      { key: ['customers'], fn: () => optimizedApiService.getCustomers() },
      { key: ['dashboard'], fn: () => optimizedApiService.getDashboardData() },
    ],
    users: () => [
      { key: ['dashboard'], fn: () => optimizedApiService.getDashboardData() },
    ],
  };

  // Match query key to patterns
  const mainResource = queryKey[0];
  if (patterns[mainResource as keyof typeof patterns]) {
    return patterns[mainResource as keyof typeof patterns]();
  }

  return prefetchQueries;
}

// Specialized hooks for common queries
export function useDashboardData(role?: string, region?: string) {
  return useOptimizedQuery({
    queryKey: ['dashboard', role || '', region || ''],
    queryFn: () => optimizedApiService.getDashboardData(role, region),
    enableBackground: true,
    enablePrefetch: true,
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard data
  });
}

export function useComplaints(filters?: any) {
  return useOptimizedQuery({
    queryKey: ['complaints', JSON.stringify(filters || {})],
    queryFn: () => optimizedApiService.getComplaints(filters),
    enableBackground: true,
    staleTime: 1 * 60 * 1000, // 1 minute for complaints
  });
}

export function useComplaint(id: string) {
  return useOptimizedQuery({
    queryKey: ['complaint', id],
    queryFn: () => optimizedApiService.getComplaintById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes for individual complaints
  });
}

export function useUsers() {
  return useOptimizedQuery({
    queryKey: ['users'],
    queryFn: () => optimizedApiService.getUsers(),
    staleTime: 10 * 60 * 1000, // 10 minutes for users
  });
}

export function useCustomers() {
  return useOptimizedQuery({
    queryKey: ['customers'],
    queryFn: () => optimizedApiService.getCustomers(),
    staleTime: 15 * 60 * 1000, // 15 minutes for customers
  });
}

// Hook for search queries with debouncing
export function useSearchComplaints(searchParams: any, debounceMs: number = 300) {
  const debouncedParams = useDebounce(searchParams, debounceMs);
  
  return useOptimizedQuery({
    queryKey: ['complaints', 'search', JSON.stringify(debouncedParams)],
    queryFn: () => optimizedApiService.searchComplaints(debouncedParams),
    enabled: Object.keys(debouncedParams).some(key => debouncedParams[key]),
    staleTime: 30 * 1000, // 30 seconds for search results
  });
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Import useState for the debounce hook
import { useState } from 'react';

// Query invalidation helpers
export function useQueryInvalidation() {
  const queryClient = useQueryClient();

  return {
    invalidateComplaints: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }, [queryClient]),

    invalidateUsers: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }, [queryClient]),

    invalidateCustomers: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }, [queryClient]),

    invalidateDashboard: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }, [queryClient]),

    invalidateAll: useCallback(() => {
      queryClient.invalidateQueries();
    }, [queryClient]),
  };
}

// Background sync for offline support
export function useBackgroundSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      queryClient.resumePausedMutations();
      queryClient.invalidateQueries();
    };

    const handleOffline = () => {
      // Pause mutations when offline
      queryClient.getQueryCache().getAll().forEach(query => {
        query.cancel();
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);
}