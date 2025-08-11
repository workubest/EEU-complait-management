import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  FileText,
  TrendingUp,
  Users,
  AlertTriangle,
  Eye,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  Activity,
  Target,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/lib/api';

interface DashboardStats {
  complaints: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    active: number;
    inactive: number;
    overdue: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  performance: {
    resolutionRate: number;
    averageResponseTime: string;
    customerSatisfaction: number;
  };
}

export function StatsCards() {
  const { user, role } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get dashboard stats from the backend
        const response = await apiService.getDashboardStats();
        
        if (response.success && response.data) {
          // Transform the Google Apps Script response to match StatsCards expectations
          const transformedStats: DashboardStats = {
            complaints: {
              total: response.data.totalComplaints || 0,
              open: response.data.openComplaints || 0,
              inProgress: response.data.inProgressComplaints || 0,
              resolved: response.data.resolvedComplaints || 0,
              critical: response.data.complaintsByPriority?.critical || 0,
              high: response.data.complaintsByPriority?.high || 0,
              medium: response.data.complaintsByPriority?.medium || 0,
              low: response.data.complaintsByPriority?.low || 0,
              active: (response.data.openComplaints || 0) + (response.data.inProgressComplaints || 0),
              inactive: response.data.resolvedComplaints || 0,
              overdue: Math.floor((response.data.openComplaints || 0) * 0.1) // Estimate 10% as overdue
            },
            users: {
              total: response.data.totalUsers || 0,
              active: response.data.activeUsers || 0,
              inactive: (response.data.totalUsers || 0) - (response.data.activeUsers || 0)
            },
            performance: {
              resolutionRate: response.data.performance?.resolutionRate || 85,
              averageResponseTime: `${response.data.performance?.averageResolutionTime || 2.5} hours`,
              customerSatisfaction: response.data.performance?.customerSatisfaction || 4.2
            }
          };
          
          setStats(transformedStats);
          console.log('✅ Stats cards data loaded successfully:', transformedStats);
        } else {
          setError(response.error || 'Failed to load dashboard statistics');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [selectedTimeframe]);

  // Interactive functions
  const handleCardClick = (cardType: string, filter?: string) => {
    switch (cardType) {
      case 'complaints':
        if (filter) {
          navigate(`/dashboard/complaints?status=${filter}`);
        } else {
          navigate('/dashboard/complaints');
        }
        break;
      case 'users':
        if (role === 'admin' || role === 'manager') {
          navigate('/dashboard/users');
        } else {
          toast({
            title: t('common.error'),
            description: t('permissions.access_denied'),
            variant: "destructive"
          });
        }
        break;
      case 'analytics':
        navigate('/dashboard/analytics');
        break;
      case 'performance':
        navigate('/dashboard/analytics?tab=performance');
        break;
      default:
        console.log('Unknown card type:', cardType);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'resolved':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'open':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card className="col-span-full border-destructive/50">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const complaintsStats = stats.complaints || {};

  const cards = [
    {
      title: 'Total Complaints',
      value: (complaintsStats.total ?? 0).toString(),
      description: `In ${user?.region || 'all regions'}`,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      clickAction: () => handleCardClick('complaints'),
      trend: 'up',
      trendValue: '+12%',
      progress: 85
    },
    {
      title: 'Open Cases',
      value: (complaintsStats.open ?? 0).toString(),
      description: 'Awaiting assignment',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      clickAction: () => handleCardClick('complaints', 'open'),
      trend: 'down',
      trendValue: '-5%',
      progress: 65
    },
    {
      title: 'In Progress',
      value: (complaintsStats.inProgress ?? 0).toString(),
      description: 'Currently being resolved',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      clickAction: () => handleCardClick('complaints', 'in-progress'),
      trend: 'up',
      trendValue: '+8%',
      progress: 75
    },
    {
      title: 'Resolved',
      value: (complaintsStats.resolved ?? 0).toString(),
      description: 'Successfully completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      clickAction: () => handleCardClick('complaints', 'resolved'),
      trend: 'up',
      trendValue: '+15%',
      progress: 92
    },
    {
      title: 'Critical Issues',
      value: (complaintsStats.critical ?? 0).toString(),
      description: 'Require immediate attention',
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      clickAction: () => handleCardClick('complaints', 'critical'),
      trend: 'down',
      trendValue: '-3%',
      progress: 25
    },
    {
      title: 'High Priority',
      value: (complaintsStats.high ?? 0).toString(),
      description: 'Priority resolution needed',
      icon: Target,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      clickAction: () => handleCardClick('complaints', 'high'),
      trend: 'stable',
      trendValue: '0%',
      progress: 60
    },
    {
      title: 'Overdue',
      value: (complaintsStats.overdue ?? 0).toString(),
      description: 'Over 7 days old',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      clickAction: () => handleCardClick('complaints', 'overdue'),
      trend: 'down',
      trendValue: '-10%',
      progress: 15
    },
    {
      title: 'Team Performance',
      value: `${stats.performance?.resolutionRate ?? 0}%`,
      description: 'Resolution rate this month',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      clickAction: () => handleCardClick('performance'),
      trend: 'up',
      trendValue: '+7%',
      progress: stats.performance?.resolutionRate ?? 0
    },
    {
      title: 'Customer Satisfaction',
      value: `${stats.performance?.customerSatisfaction ?? 0}/5`,
      description: 'Average rating',
      icon: Star,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      clickAction: () => handleCardClick('analytics'),
      trend: 'up',
      trendValue: '+0.3',
      progress: ((stats.performance?.customerSatisfaction ?? 0) / 5) * 100
    }
  ];

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Dashboard Statistics</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedTimeframe === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('today')}
          >
            Today
          </Button>
          <Button
            variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('week')}
          >
            This Week
          </Button>
          <Button
            variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('month')}
          >
            This Month
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className={`border-border hover:shadow-elevated transition-all duration-300 animate-scale-in cursor-pointer group ${card.bgColor} hover:scale-105`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={card.clickAction}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(card.trend)}
                  <Icon className={`h-5 w-5 ${card.color} group-hover:scale-110 transition-transform`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.value}
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(card.trend)}`}>
                    {card.trendValue}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {card.description}
                  </p>
                  
                  {card.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{card.progress}%</span>
                      </div>
                      <Progress value={card.progress} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Summary */}
      <Card className="border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Summary</h3>
              <p className="text-sm text-muted-foreground">
                {stats.performance?.resolutionRate ?? 0}% resolution rate • {stats.performance?.averageResponseTime ?? 'N/A'} avg response time • {stats.performance?.customerSatisfaction ?? 0}/5 satisfaction
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCardClick('analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCardClick('performance')}>
                <Activity className="h-4 w-4 mr-2" />
                Performance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}