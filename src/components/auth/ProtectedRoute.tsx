import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  resource: keyof import('@/types/user').RolePermissions;
  action: 'create' | 'read' | 'update' | 'delete';
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  resource, 
  action, 
  fallback 
}: ProtectedRouteProps) {
  const { hasPermission, user } = useAuth();

  // Check if user has permission for this resource and action
  const hasAccess = hasPermission(resource, action);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              You don't have permission to {action} {resource}. 
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Current role: {user?.role}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

interface ProtectedActionProps {
  children: React.ReactNode;
  resource: keyof import('@/types/user').RolePermissions;
  action: 'create' | 'read' | 'update' | 'delete';
  fallback?: React.ReactNode;
}

export function ProtectedAction({ 
  children, 
  resource, 
  action, 
  fallback = null 
}: ProtectedActionProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}