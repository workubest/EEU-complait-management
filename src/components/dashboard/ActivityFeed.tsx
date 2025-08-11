import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  Phone,
  Mail,
  Settings,
  Users,
  Zap,
  MapPin,
  Calendar,
  RefreshCw,
  Filter,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'complaint_created' | 'complaint_updated' | 'complaint_resolved' | 'complaint_assigned' | 'user_login' | 'user_action' | 'system_alert' | 'maintenance' | 'report_generated';
  title: string;
  description: string;
  user?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: {
    complaintId?: string;
    priority?: string;
    region?: string;
    category?: string;
    status?: string;
    [key: string]: any;
  };
  isImportant?: boolean;
}

export function ActivityFeed() {
  const { user, role, canAccessRegion } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'complaints' | 'users' | 'system'>('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchActivities();
    
    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const result = await apiService.getActivityFeed();
      if (result.success && result.data && Array.isArray(result.data)) {
        // Validate and sanitize activity data
        const validActivities = result.data.filter((activity: any) => {
          return activity && 
                 (activity.id || activity.ID) && 
                 (activity.type || activity.Type) && 
                 (activity.title || activity.Title) && 
                 (activity.description || activity.Description);
        }).map((activity: any) => {
          // Transform backend data structure to frontend expected structure
          const transformedActivity = {
            id: activity.id || activity.ID || 'unknown',
            type: activity.type || activity.Type || 'user_action',
            title: activity.title || activity.Title || 'Unknown Activity',
            description: activity.description || activity.Description || 'No description available',
            timestamp: activity.timestamp || activity.Timestamp || new Date().toISOString(),
            isImportant: activity.isImportant || activity['Is Important'] || false,
            metadata: {}
          };

          // Handle user data - backend stores user info in separate fields
          if (activity['User ID'] || activity['User Name'] || activity['User Role']) {
            transformedActivity.user = {
              id: activity['User ID'] || 'unknown',
              name: activity['User Name'] || 'Unknown User',
              role: activity['User Role'] || 'unknown',
              avatar: undefined // Backend doesn't store avatars
            };
          } else if (activity.user && typeof activity.user === 'object') {
            // Handle case where user is already an object (from mock data)
            transformedActivity.user = {
              id: activity.user.id || 'unknown',
              name: activity.user.name || 'Unknown User',
              role: activity.user.role || 'unknown',
              avatar: activity.user.avatar || undefined
            };
          }

          // Handle metadata - backend stores as JSON string or object
          try {
            if (activity.metadata && typeof activity.metadata === 'string') {
              transformedActivity.metadata = JSON.parse(activity.metadata);
            } else if (activity.Metadata && typeof activity.Metadata === 'string') {
              transformedActivity.metadata = JSON.parse(activity.Metadata);
            } else if (activity.metadata && typeof activity.metadata === 'object') {
              transformedActivity.metadata = activity.metadata;
            } else {
              // Build metadata from individual fields
              transformedActivity.metadata = {
                complaintId: activity['Complaint ID'] || activity.complaintId,
                region: activity.Region || activity.region,
                priority: activity.Priority || activity.priority
              };
            }
          } catch (e) {
            transformedActivity.metadata = {
              complaintId: activity['Complaint ID'] || activity.complaintId,
              region: activity.Region || activity.region,
              priority: activity.Priority || activity.priority
            };
          }

          return transformedActivity;
        });

        // Filter activities based on user access
        const filteredActivities = validActivities.filter((activity: ActivityItem) => {
          if (activity.metadata?.region) {
            return canAccessRegion(activity.metadata.region);
          }
          return true;
        });
        
        setActivities(filteredActivities);
      } else {
        console.error('Failed to fetch activities:', result.error);
        // Set some fallback activities to prevent crashes
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };



  const getActivityIcon = (type: ActivityItem['type']) => {
    const icons = {
      complaint_created: FileText,
      complaint_updated: Clock,
      complaint_resolved: CheckCircle,
      complaint_assigned: Users,
      user_login: User,
      user_action: Users,
      system_alert: AlertTriangle,
      maintenance: Settings,
      report_generated: Activity
    };
    return icons[type] || FileText; // Fallback to FileText if type is not found
  };

  const getActivityColor = (type: ActivityItem['type'], priority?: string) => {
    if (priority === 'critical') return 'text-red-600 bg-red-50';
    if (priority === 'high') return 'text-orange-600 bg-orange-50';
    
    const colors = {
      complaint_created: 'text-blue-600 bg-blue-50',
      complaint_updated: 'text-yellow-600 bg-yellow-50',
      complaint_resolved: 'text-green-600 bg-green-50',
      complaint_assigned: 'text-purple-600 bg-purple-50',
      user_login: 'text-purple-600 bg-purple-50',
      user_action: 'text-indigo-600 bg-indigo-50',
      system_alert: 'text-red-600 bg-red-50',
      maintenance: 'text-gray-600 bg-gray-50',
      report_generated: 'text-teal-600 bg-teal-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50'; // Fallback color
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const configs = {
      low: { label: 'Low', className: 'bg-gray-100 text-gray-700' },
      medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700' },
      high: { label: 'High', className: 'bg-orange-100 text-orange-700' },
      critical: { label: 'Critical', className: 'bg-red-100 text-red-700' }
    };
    
    const config = configs[priority as keyof typeof configs];
    if (!config) return null;
    
    return (
      <Badge className={config.className} variant="secondary">
        {config.label}
      </Badge>
    );
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'complaints') {
      return activity.type.startsWith('complaint_');
    }
    if (filter === 'users') {
      return activity.type.startsWith('user_');
    }
    if (filter === 'system') {
      return activity.type === 'system_alert' || activity.type === 'maintenance';
    }
    return true;
  });

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 10);

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Live updates from your system
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={fetchActivities}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'complaints' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('complaints')}
          >
            Complaints
          </Button>
          <Button
            variant={filter === 'users' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('users')}
          >
            Users
          </Button>
          <Button
            variant={filter === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('system')}
          >
            System
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No recent activity</h3>
              <p className="text-muted-foreground">
                No activities found for the selected filter.
              </p>
            </div>
          ) : (
            displayedActivities.map((activity, index) => {
              // Additional safety check
              if (!activity) {
                console.warn('Skipping undefined activity at index:', index);
                return null;
              }

              try {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type, activity.metadata?.priority);
                
                return (
                <div 
                  key={activity.id} 
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 animate-fade-in ${
                    activity.isImportant ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-foreground">
                            {activity.title}
                          </h4>
                          {getPriorityBadge(activity.metadata?.priority)}
                          {activity.isImportant && (
                            <Badge variant="destructive" className="text-xs">
                              Important
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          {activity.user && activity.user.name ? (
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={activity.user.avatar || ''} />
                                <AvatarFallback className="text-xs">
                                  {activity.user.name ? activity.user.name.split(' ').map(n => n[0]).join('') : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{activity.user.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {activity.user.role || 'Unknown'}
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className="text-xs">S</AvatarFallback>
                              </Avatar>
                              <span>System</span>
                              <Badge variant="outline" className="text-xs">
                                system
                              </Badge>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {activity.timestamp ? 
                                formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : 
                                'Unknown time'
                              }
                            </span>
                          </div>
                          
                          {activity.metadata?.region && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.metadata.region}</span>
                            </div>
                          )}
                          
                          {activity.metadata?.complaintId && (
                            <div className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span className="text-primary">{activity.metadata.complaintId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
              } catch (error) {
                console.error('Error rendering activity at index:', index, error);
                return (
                  <div key={`error-${index}`} className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">Error displaying activity</p>
                  </div>
                );
              }
            })
          )}
          
          {filteredActivities.length > 10 && !showAll && (
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(true)}
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Show All Activities ({filteredActivities.length - 10} more)
              </Button>
            </div>
          )}
          
          {showAll && (
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(false)}
                className="w-full"
              >
                Show Less
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}