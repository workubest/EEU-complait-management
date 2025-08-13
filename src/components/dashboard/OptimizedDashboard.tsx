import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { optimizedApiService } from '@/lib/api-optimized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
  Loader2,
  BarChart3,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

interface DashboardData {
  roleInsights: {
    label: string;
    value: string;
    status: 'good' | 'warning' | 'error';
    trend?: 'up' | 'down' | 'stable';
  }[];
  systemStatus: {
    temperature: number;
    connectivity: string;
    batteryLevel: number;
    lastUpdate: Date;
    alerts: number;
    activeIncidents: number;
    serverLoad: number;
    uptime: string;
  };
  weatherData?: {
    temperature: number;
    condition: string;
    windSpeed: number;
    visibility: string;
    safetyLevel: 'safe' | 'caution' | 'danger';
  };
}

// Memoized components for better performance
const StatsCard = memo(({ 
  title, 
  value, 
  status, 
  trend, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  status: 'good' | 'warning' | 'error'; 
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}) => {
  const statusColors = useMemo(() => ({
    good: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }), []);

  const trendIcons = useMemo(() => ({
    up: '↗️',
    down: '↘️',
    stable: '→'
  }), []);

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className={`text-2xl font-bold ${statusColors[status]}`}>
            {value}
          </div>
          {trend && (
            <span className="text-sm text-muted-foreground">
              {trendIcons[trend]}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

const SystemStatusCard = memo(({ systemStatus }: { systemStatus: DashboardData['systemStatus'] }) => {
  const statusItems = useMemo(() => [
    { label: 'Server Load', value: `${systemStatus.serverLoad}%`, color: systemStatus.serverLoad > 80 ? 'text-red-600' : 'text-green-600' },
    { label: 'Uptime', value: systemStatus.uptime, color: 'text-green-600' },
    { label: 'Connectivity', value: systemStatus.connectivity, color: systemStatus.connectivity === 'online' ? 'text-green-600' : 'text-red-600' },
    { label: 'Active Alerts', value: systemStatus.alerts.toString(), color: systemStatus.alerts > 0 ? 'text-yellow-600' : 'text-green-600' }
  ], [systemStatus]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>System Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
          </div>
        ))}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Server Load</span>
            <span>{systemStatus.serverLoad}%</span>
          </div>
          <Progress value={systemStatus.serverLoad} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Battery Level</span>
            <span>{systemStatus.batteryLevel}%</span>
          </div>
          <Progress value={systemStatus.batteryLevel} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
});

const WeatherCard = memo(({ weatherData }: { weatherData?: DashboardData['weatherData'] }) => {
  if (!weatherData) return null;

  const safetyColors = useMemo(() => ({
    safe: 'text-green-600',
    caution: 'text-yellow-600',
    danger: 'text-red-600'
  }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Weather Conditions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Temperature</span>
          <span className="text-sm font-medium">{weatherData.temperature}°C</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Condition</span>
          <span className="text-sm font-medium">{weatherData.condition}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Wind Speed</span>
          <span className="text-sm font-medium">{weatherData.windSpeed} km/h</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Safety Level</span>
          <Badge className={safetyColors[weatherData.safetyLevel]}>
            {weatherData.safetyLevel.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});

const QuickActions = memo(({ role }: { role: string }) => {
  const actions = useMemo(() => {
    const baseActions = [
      { label: 'View Reports', icon: BarChart3, href: '/dashboard/reports' },
      { label: 'Analytics', icon: TrendingUp, href: '/dashboard/analytics' },
    ];

    if (role === 'admin' || role === 'manager') {
      baseActions.unshift(
        { label: 'New Complaint', icon: FileText, href: '/dashboard/complaints/new' },
        { label: 'User Management', icon: Users, href: '/dashboard/users' }
      );
    } else if (role !== 'customer') {
      baseActions.unshift(
        { label: 'New Complaint', icon: FileText, href: '/dashboard/complaints/new' }
      );
    }

    return baseActions;
  }, [role]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.location.href = action.href}
          >
            <action.icon className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
});

export const OptimizedDashboard = memo(() => {
  const { user, role, region } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchDashboardData = useCallback(async () => {
    try {
      const result = await optimizedApiService.getDashboardData(role, region);
      
      if (result.success && result.data) {
        const transformedData: DashboardData = {
          roleInsights: [
            {
              label: 'Total Complaints',
              value: result.data.totalComplaints?.toString() || '0',
              status: 'good' as const,
              trend: 'stable' as const
            },
            {
              label: 'Open Complaints',
              value: result.data.openComplaints?.toString() || '0',
              status: result.data.openComplaints > 20 ? 'warning' : 'good',
              trend: 'up' as const
            },
            {
              label: 'In Progress',
              value: result.data.inProgressComplaints?.toString() || '0',
              status: 'good' as const,
              trend: 'stable' as const
            },
            {
              label: 'Resolved',
              value: result.data.resolvedComplaints?.toString() || '0',
              status: 'good' as const,
              trend: 'up' as const
            },
            {
              label: 'Active Users',
              value: result.data.activeUsers?.toString() || '0',
              status: 'good' as const,
              trend: 'stable' as const
            },
            {
              label: 'Resolution Rate',
              value: `${result.data.performance?.resolutionRate || 85}%`,
              status: (result.data.performance?.resolutionRate || 85) > 80 ? 'good' : 'warning',
              trend: 'up' as const
            }
          ],
          systemStatus: {
            temperature: 22,
            connectivity: 'online',
            batteryLevel: 95,
            lastUpdate: new Date(),
            alerts: result.data.openComplaints || 0,
            activeIncidents: result.data.inProgressComplaints || 0,
            serverLoad: 45,
            uptime: '99.9%'
          },
          weatherData: {
            temperature: 24,
            condition: 'Clear',
            windSpeed: 12,
            visibility: 'Good',
            safetyLevel: 'safe' as const
          }
        };
        
        setDashboardData(transformedData);
      } else {
        toast({
          title: "Data Loading Error",
          description: result.error || "Failed to load dashboard data",
          variant: "destructive"
        });
      }
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Connection Issue",
        description: "Unable to connect to the server. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [role, region, toast]);

  // Effect with proper dependencies
  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 2 minutes (reduced from 30 seconds for better performance)
    const interval = setInterval(fetchDashboardData, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Memoized stats cards to prevent unnecessary re-renders
  const statsCards = useMemo(() => {
    if (!dashboardData) return [];
    
    const icons = [FileText, AlertTriangle, Clock, CheckCircle, Users, TrendingUp];
    
    return dashboardData.roleInsights.map((insight, index) => (
      <StatsCard
        key={insight.label}
        title={insight.label}
        value={insight.value}
        status={insight.status}
        trend={insight.trend}
        icon={icons[index] || FileText}
      />
    ));
  }, [dashboardData]);

  // Memoized refresh handler
  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening with your system.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {format(lastRefresh, 'HH:mm:ss')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsCards}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* System Status */}
        {dashboardData && (
          <SystemStatusCard systemStatus={dashboardData.systemStatus} />
        )}

        {/* Weather Card */}
        {dashboardData?.weatherData && (
          <WeatherCard weatherData={dashboardData.weatherData} />
        )}

        {/* Quick Actions */}
        <QuickActions role={role} />
      </div>

      {/* Cache Statistics (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs">
              {JSON.stringify(optimizedApiService.getCacheStats(), null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';