import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, ROLE_PERMISSIONS, RolePermissions } from '@/types/user';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  permissions: RolePermissions;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  hasPermission: (resource: keyof RolePermissions, action: keyof RolePermissions['complaints']) => boolean;
  canAccessRegion: (region: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users removed - authentication now requires real backend

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('admin');

  const permissions = ROLE_PERMISSIONS[role];
  const isAuthenticated = user !== null;

  const login = (userData: User) => {
    setUser(userData);
    setRole(userData.role);
  };

  const logout = () => {
    setUser(null);
    setRole('call-attendant');
  };

  const switchRole = (newRole: UserRole) => {
    // Role switching disabled - requires real authentication
    console.warn('Role switching is disabled. Please login with appropriate credentials.');
  };

  const hasPermission = (resource: keyof RolePermissions, action: keyof RolePermissions['complaints']): boolean => {
    if (resource === 'canAssignComplaint' || resource === 'canSetHighPriority' || resource === 'accessibleRegions') {
      return false;
    }
    return permissions[resource][action];
  };

  const canAccessRegion = (region: string): boolean => {
    if (permissions.accessibleRegions === 'all') return true;
    if (Array.isArray(permissions.accessibleRegions)) {
      return permissions.accessibleRegions.length === 0 ? 
        region === user?.region : 
        permissions.accessibleRegions.includes(region);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      permissions,
      isAuthenticated,
      login,
      logout,
      switchRole,
      hasPermission,
      canAccessRegion
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}