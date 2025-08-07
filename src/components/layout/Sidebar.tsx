import { 
  BarChart3, 
  Plus, 
  FileText, 
  Users, 
  Settings, 
  Home,
  Search,
  Bell
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGate, RoleGate } from '@/components/ui/permission-gate';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, requiresAuth: false },
  { name: 'New Complaint', href: '/complaints/new', icon: Plus, requiresAuth: false },
  { name: 'All Complaints', href: '/complaints', icon: FileText, requiresAuth: false },
  { name: 'Search Complaints', href: '/complaints/search', icon: Search, requiresAuth: false },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, resource: 'reports', action: 'read' },
  { name: 'User Management', href: '/users', icon: Users, resource: 'users', action: 'read' },
  { name: 'Notifications', href: '/notifications', icon: Bell, requiresAuth: false },
  { name: 'Settings', href: '/settings', icon: Settings, resource: 'settings', action: 'read' },
];

export function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const getDashboardTitle = () => {
    const titles = {
      admin: 'System Administration Dashboard',
      manager: 'Regional Management Dashboard',
      foreman: 'Field Operations Dashboard',
      'call-attendant': 'Customer Service Dashboard',
      technician: 'Technician Dashboard'
    };
    return titles[role];
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {getDashboardTitle()}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Role: {role.charAt(0).toUpperCase() + role.slice(1)}
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          if (item.resource && item.action) {
            return (
              <PermissionGate
                key={item.name}
                resource={item.resource as any}
                action={item.action as any}
              >
                <NavLink
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              </PermissionGate>
            );
          }

          // Special role restrictions
          if (item.name === 'New Complaint' && role === 'technician') {
            return null;
          }

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Ethiopian Electric Utility</p>
          <p>v2.1.0 • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}