import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  FileText, 
  Users, 
  Settings,
  Bell,
  Download,
  Upload,
  Calendar,
  MapPin,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PermissionGate } from '@/components/ui/permission-gate';
import { useToast } from '@/hooks/use-toast';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
  bgColor: string;
  resource?: string;
  permission?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export function QuickActions() {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'new-complaint':
        navigate('/dashboard/complaints/new');
        break;
      case 'search-complaints':
        navigate('/dashboard/complaints/search');
        break;
      case 'view-all-complaints':
        navigate('/dashboard/complaints');
        break;
      case 'analytics':
        navigate('/dashboard/analytics');
        break;
      case 'user-management':
        navigate('/dashboard/users');
        break;
      case 'settings':
        navigate('/dashboard/settings');
        break;
      case 'notifications':
        navigate('/dashboard/notifications');
        break;
      case 'reports':
        navigate('/dashboard/reports');
        break;
      case 'emergency-response':
        toast({
          title: "Emergency Response Activated",
          description: "Emergency response team has been notified.",
          variant: "destructive"
        });
        break;
      case 'bulk-import':
        toast({
          title: "Bulk Import",
          description: "Bulk import feature coming soon.",
        });
        break;
      case 'schedule-maintenance':
        toast({
          title: "Maintenance Scheduled",
          description: "Maintenance scheduling feature coming soon.",
        });
        break;
      case 'customer-callback':
        toast({
          title: "Customer Callback",
          description: "Customer callback system activated.",
        });
        break;
      case 'send-sms':
        toast({
          title: "SMS Service",
          description: "SMS notification system activated.",
        });
        break;
      case 'live-chat':
        toast({
          title: "Live Chat",
          description: "Live chat support coming soon.",
        });
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'new-complaint',
      title: 'New Complaint',
      description: 'Register a new customer complaint',
      icon: Plus,
      action: () => handleQuickAction('new-complaint'),
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
      badge: { text: 'Quick', variant: 'default' }
    },
    {
      id: 'search-complaints',
      title: 'Search & Filter',
      description: 'Find specific complaints quickly',
      icon: Search,
      action: () => handleQuickAction('search-complaints'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      id: 'view-all-complaints',
      title: 'All Complaints',
      description: 'View and manage all complaints',
      icon: FileText,
      action: () => handleQuickAction('view-all-complaints'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
    },
    {
      id: 'emergency-response',
      title: 'Emergency Response',
      description: 'Activate emergency response protocol',
      icon: AlertTriangle,
      action: () => handleQuickAction('emergency-response'),
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      badge: { text: 'Critical', variant: 'destructive' }
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'View performance metrics and trends',
      icon: BarChart3,
      action: () => handleQuickAction('analytics'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      resource: 'reports',
      permission: 'read'
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      action: () => handleQuickAction('user-management'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      resource: 'users',
      permission: 'read'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View system alerts and updates',
      icon: Bell,
      action: () => handleQuickAction('notifications'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      badge: { text: '3 New', variant: 'secondary' }
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      description: 'Create and download reports',
      icon: Download,
      action: () => handleQuickAction('reports'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      resource: 'reports',
      permission: 'create'
    },
    {
      id: 'bulk-import',
      title: 'Bulk Import',
      description: 'Import multiple complaints from file',
      icon: Upload,
      action: () => handleQuickAction('bulk-import'),
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      resource: 'complaints',
      permission: 'create'
    },
    {
      id: 'schedule-maintenance',
      title: 'Schedule Maintenance',
      description: 'Plan preventive maintenance',
      icon: Calendar,
      action: () => handleQuickAction('schedule-maintenance'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
    },
    {
      id: 'customer-callback',
      title: 'Customer Callback',
      description: 'Schedule customer callbacks',
      icon: Phone,
      action: () => handleQuickAction('customer-callback'),
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
    },
    {
      id: 'send-sms',
      title: 'Send SMS Updates',
      description: 'Send SMS notifications to customers',
      icon: MessageSquare,
      action: () => handleQuickAction('send-sms'),
      color: 'text-violet-600',
      bgColor: 'bg-violet-50 hover:bg-violet-100',
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      action: () => handleQuickAction('settings'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      resource: 'settings',
      permission: 'read'
    }
  ];

  // Filter actions based on role and permissions
  const getFilteredActions = () => {
    return quickActions.filter(action => {
      // Role-based filtering
      if (role === 'technician') {
        const technicianAllowed = [
          'search-complaints', 'view-all-complaints', 'notifications', 
          'emergency-response', 'customer-callback', 'send-sms'
        ];
        if (!technicianAllowed.includes(action.id)) return false;
      }
      
      if (role === 'call-attendant') {
        const attendantAllowed = [
          'new-complaint', 'search-complaints', 'view-all-complaints', 
          'notifications', 'customer-callback', 'send-sms', 'live-chat'
        ];
        if (!attendantAllowed.includes(action.id)) return false;
      }

      return true;
    });
  };

  const filteredActions = getFilteredActions();

  const renderAction = (action: QuickAction) => {
    const Icon = action.icon;
    
    const ActionButton = (
      <Card 
        key={action.id}
        className={`border-border hover:shadow-elevated transition-all duration-300 cursor-pointer group animate-scale-in ${action.bgColor}`}
        onClick={action.action}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
              <Icon className={`h-6 w-6 ${action.color}`} />
            </div>
            {action.badge && (
              <Badge variant={action.badge.variant} className="text-xs">
                {action.badge.text}
              </Badge>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
              {action.description}
            </p>
          </div>
        </CardContent>
      </Card>
    );

    // Wrap with permission gate if needed
    if (action.resource && action.permission) {
      return (
        <PermissionGate 
          key={action.id}
          resource={action.resource as any} 
          action={action.permission as any}
        >
          {ActionButton}
        </PermissionGate>
      );
    }

    return ActionButton;
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Frequently used actions for {role} role
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredActions.map((action, index) => (
            <div 
              key={action.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {renderAction(action)}
            </div>
          ))}
        </div>
        
        {filteredActions.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No actions available</h3>
            <p className="text-muted-foreground">
              No quick actions are available for your current role and permissions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}