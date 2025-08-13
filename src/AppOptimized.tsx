import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Suspense, lazy, memo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { performanceMonitor, measureWebVitals } from "@/utils/performance";
import { useBackgroundSync } from "@/hooks/useOptimizedQuery";

// Lazy load components with better error boundaries
const Login = lazy(() => 
  import("@/pages/Login")
    .then(module => ({ default: module.Login }))
    .catch(() => ({ default: () => <div>Error loading Login</div> }))
);

const Dashboard = lazy(() => 
  import("@/components/dashboard/OptimizedDashboard")
    .then(module => ({ default: module.OptimizedDashboard }))
    .catch(() => ({ default: () => <div>Error loading Dashboard</div> }))
);

const ComplaintForm = lazy(() => 
  import("@/pages/ComplaintForm")
    .then(module => ({ default: module.ComplaintForm }))
    .catch(() => ({ default: () => <div>Error loading Complaint Form</div> }))
);

const ComplaintsList = lazy(() => 
  import("@/pages/ComplaintsList")
    .then(module => ({ default: module.ComplaintsList }))
    .catch(() => ({ default: () => <div>Error loading Complaints List</div> }))
);

const ComplaintsSearch = lazy(() => 
  import("@/pages/ComplaintsSearch")
    .then(module => ({ default: module.ComplaintsSearch }))
    .catch(() => ({ default: () => <div>Error loading Complaints Search</div> }))
);

const ComplaintDetail = lazy(() => 
  import("@/pages/ComplaintDetail")
    .catch(() => ({ default: () => <div>Error loading Complaint Detail</div> }))
);

const Analytics = lazy(() => 
  import("@/pages/Analytics")
    .then(module => ({ default: module.Analytics }))
    .catch(() => ({ default: () => <div>Error loading Analytics</div> }))
);

const Reports = lazy(() => 
  import("@/pages/Reports")
    .then(module => ({ default: module.Reports }))
    .catch(() => ({ default: () => <div>Error loading Reports</div> }))
);

const UserManagement = lazy(() => 
  import("@/pages/UserManagement")
    .then(module => ({ default: module.UserManagement }))
    .catch(() => ({ default: () => <div>Error loading User Management</div> }))
);

const Notifications = lazy(() => 
  import("@/pages/Notifications")
    .then(module => ({ default: module.Notifications }))
    .catch(() => ({ default: () => <div>Error loading Notifications</div> }))
);

const Settings = lazy(() => 
  import("@/pages/Settings")
    .then(module => ({ default: module.Settings }))
    .catch(() => ({ default: () => <div>Error loading Settings</div> }))
);

const PermissionManagement = lazy(() => 
  import("@/pages/PermissionManagement")
    .catch(() => ({ default: () => <div>Error loading Permission Management</div> }))
);

const ComplaintFormAmharic = lazy(() => 
  import("@/components/forms/ComplaintFormAmharic")
    .catch(() => ({ default: () => <div>Error loading Amharic Form</div> }))
);

const CustomerPortal = lazy(() => 
  import("@/pages/CustomerPortal")
    .catch(() => ({ default: () => <div>Error loading Customer Portal</div> }))
);

const LandingPage = lazy(() => 
  import("@/pages/LandingPage")
    .catch(() => ({ default: () => <div>Error loading Landing Page</div> }))
);

const QuickReport = lazy(() => 
  import("@/pages/QuickReport")
    .catch(() => ({ default: () => <div>Error loading Quick Report</div> }))
);

const NotFound = lazy(() => 
  import("./pages/NotFound")
    .catch(() => ({ default: () => <div>Page Not Found</div> }))
);

// Optimized loading component with better UX
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Error boundary component
const ErrorFallback = memo(({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4 p-6 max-w-md">
      <div className="text-red-500 text-6xl">⚠️</div>
      <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

// Background sync component
const BackgroundSync = memo(() => {
  useBackgroundSync();
  return null;
});

BackgroundSync.displayName = 'BackgroundSync';

// Routes component with performance monitoring
const AppRoutes = memo(() => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    performanceMonitor.recordMetric('route_render', 1, 'counter');
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/customer-portal" element={<CustomerPortal />} />
        <Route path="/quick-report" element={<QuickReport />} />
        <Route path="/login" element={<Login />} />
        
        {/* Redirect /notifications to /dashboard/notifications */}
        <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
        
        {/* Protected Routes */}
        {!isAuthenticated ? (
          <Route path="/dashboard/*" element={<Login />} />
        ) : (
          <Route path="/dashboard/*" element={
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route 
                    path="/complaints/new" 
                    element={
                      <ProtectedRoute resource="complaints" action="create">
                        <ComplaintForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/complaints/new-amharic" 
                    element={
                      <ProtectedRoute resource="complaints" action="create">
                        <ComplaintFormAmharic />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/complaints" 
                    element={
                      <ProtectedRoute resource="complaints" action="read">
                        <ComplaintsList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/complaints/:id" 
                    element={
                      <ProtectedRoute resource="complaints" action="read">
                        <ComplaintDetail />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/complaints/search" 
                    element={
                      <ProtectedRoute resource="complaints" action="read">
                        <ComplaintsSearch />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute resource="reports" action="read">
                        <Analytics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute resource="reports" action="read">
                        <Reports />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/users" 
                    element={
                      <ProtectedRoute resource="users" action="read">
                        <UserManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute resource="settings" action="read">
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/permissions" 
                    element={
                      <ProtectedRoute resource="settings" action="update">
                        <PermissionManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          } />
        )}
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
});

AppRoutes.displayName = 'AppRoutes';

// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      // Don't refetch on window focus in production
      refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      // Refetch on reconnect
      refetchOnReconnect: 'always',
      // Use exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Use exponential backoff for mutation retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Performance monitoring setup
const setupPerformanceMonitoring = () => {
  // Measure Web Vitals
  measureWebVitals();
  
  // Log performance metrics periodically in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const report = performanceMonitor.generateReport();
      console.log('📊 Performance Report:', JSON.parse(report));
    }, 60000); // Every minute
  }
  
  // Monitor memory usage
  if ('memory' in performance) {
    setInterval(() => {
      const memory = (performance as any).memory;
      performanceMonitor.recordMetric('memory_used', memory.usedJSHeapSize, 'gauge');
      performanceMonitor.recordMetric('memory_total', memory.totalJSHeapSize, 'gauge');
      
      // Warn if memory usage is high
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (usagePercent > 80) {
        console.warn(`⚠️ High memory usage: ${usagePercent.toFixed(1)}%`);
      }
    }, 30000); // Every 30 seconds
  }
};

const AppOptimized = memo(() => {
  useEffect(() => {
    setupPerformanceMonitoring();
    
    // Cleanup on unmount
    return () => {
      performanceMonitor.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LanguageProvider>
            <AuthProvider>
              <BrowserRouter>
                <BackgroundSync />
                <AppRoutes />
              </BrowserRouter>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
});

AppOptimized.displayName = 'AppOptimized';

export default AppOptimized;