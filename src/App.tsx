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
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { ComplaintForm } from "@/pages/ComplaintForm";
import { ComplaintsList } from "@/pages/ComplaintsList";
import { ComplaintsSearch } from "@/pages/ComplaintsSearch";
import ComplaintDetail from "@/pages/ComplaintDetail";
import { Analytics } from "@/pages/Analytics";
import { Reports } from "@/pages/Reports";
import { UserManagement } from "@/pages/UserManagement";
import { Notifications } from "@/pages/Notifications";
import { Settings } from "@/pages/Settings";
import PermissionManagement from "@/pages/PermissionManagement";
import ComplaintFormAmharic from "@/components/forms/ComplaintFormAmharic";
import CustomerPortal from "@/pages/CustomerPortal";
import LandingPage from "@/pages/LandingPage";
import QuickReport from "@/pages/QuickReport";
import NotFound from "./pages/NotFound";
import { PDFTestComponent } from "@/components/test/PDFTestComponent";
import { SimplePDFTest } from "@/components/test/SimplePDFTest";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/customer-portal" element={<CustomerPortal />} />
      <Route path="/quick-report" element={<QuickReport />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pdf-test" element={<PDFTestComponent />} />
      <Route path="/pdf-diagnostic" element={<SimplePDFTest />} />
      
      {/* Redirect /notifications to /dashboard/notifications */}
      <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
      
      {/* Protected Routes */}
      {!isAuthenticated ? (
        <Route path="/dashboard/*" element={<Login />} />
      ) : (
        <Route path="/dashboard/*" element={
          <Layout>
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
          </Layout>
        } />
      )}
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;