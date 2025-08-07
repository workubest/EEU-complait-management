import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { ComplaintForm } from "@/pages/ComplaintForm";
import { ComplaintsList } from "@/pages/ComplaintsList";
import { ComplaintsSearch } from "@/pages/ComplaintsSearch";
import { Analytics } from "@/pages/Analytics";
import { UserManagement } from "@/pages/UserManagement";
import { Notifications } from "@/pages/Notifications";
import { Settings } from "@/pages/Settings";
import { ComplaintFormAmharic } from "@/components/forms/ComplaintFormAmharic";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;