import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Zap,
  Clock,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/lib/api';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  createdAt: string;
  relatedComplaintId?: string;
  actionRequired?: boolean;
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date(dateString).toLocaleDateString();
  }
};

export function Notifications() {
  const { role, user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'action-required'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchNotifications();
    
    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getNotifications();
      if (result.success && result.data) {
        setNotifications(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('Failed to fetch notifications:', result.error);
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };



  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      error: Zap,
      system: Settings
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    const colors = {
      info: 'text-primary border-primary/20 bg-primary/5',
      warning: 'text-warning border-warning/20 bg-warning/5',
      success: 'text-success border-success/20 bg-success/5',
      error: 'text-destructive border-destructive/20 bg-destructive/5',
      system: 'text-muted-foreground border-border bg-muted/20'
    };
    return colors[type] || 'text-muted-foreground border-border bg-muted/20';
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const configs = {
      low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
      medium: { label: 'Medium', className: 'bg-primary/10 text-primary' },
      high: { label: 'High', className: 'bg-warning/10 text-warning' },
      critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive' }
    };
    return configs[priority] || { label: 'Unknown', className: 'bg-muted text-muted-foreground' };
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'action-required') return notification.actionRequired;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading notifications...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium text-destructive mb-2">Error loading notifications</h3>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with system alerts and complaint notifications
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {unreadCount} unread
          </Badge>
          {actionRequiredCount > 0 && (
            <Badge variant="outline" className="bg-warning/10 text-warning">
              {actionRequiredCount} action required
            </Badge>
          )}
          <Button variant="outline" onClick={markAllAsRead} size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Mark All Read</span>
            <span className="sm:hidden">Mark Read</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 animate-slide-up">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="flex items-center space-x-2"
        >
          <Bell className="h-4 w-4" />
          <span>All ({notifications.length})</span>
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className="flex items-center space-x-2"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Unread ({unreadCount})</span>
        </Button>
        <Button
          variant={filter === 'action-required' ? 'default' : 'outline'}
          onClick={() => setFilter('action-required')}
          className="flex items-center space-x-2"
        >
          <Clock className="h-4 w-4" />
          <span>Action Required ({actionRequiredCount})</span>
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {filteredNotifications.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "You're all caught up!" 
                  : filter === 'unread' 
                    ? "No unread notifications"
                    : "No action required at the moment"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            const priorityConfig = getPriorityBadge(notification.priority);
            
            return (
              <Card 
                key={notification.id} 
                className={`border transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? 'ring-2 ring-primary/20' : ''
                } ${getNotificationColor(notification.type, notification.priority)}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground">{notification.title}</h3>
                          <Badge className={priorityConfig.className} variant="secondary">
                            {priorityConfig.label}
                          </Badge>
                          {notification.actionRequired && (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                              Action Required
                            </Badge>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.relatedComplaintId && (
                            <span className="text-primary">
                              Related: {notification.relatedComplaintId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {notification.actionRequired && !notification.isRead && (
                  <CardContent className="pt-0">
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-gradient-primary">
                        Take Action
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Card */}
      <Card className="border-border animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Notification Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-primary">{unreadCount}</div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-warning">{actionRequiredCount}</div>
              <div className="text-sm text-muted-foreground">Action Required</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-success">
                {notifications.filter(n => n.type === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}