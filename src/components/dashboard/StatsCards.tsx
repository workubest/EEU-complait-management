import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  FileText,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // First try to get dashboard stats from the backend
        const response = await apiService.getDashboardStats();
        
        if (response.success && response.data) {
          const backendData = response.data;
          
          // If backend doesn't provide critical count, fetch complaints and calculate manually
          let criticalCount = backendData.complaints?.critical ?? 0;
          
          if (criticalCount === 0) {
            try {
              const complaintsResponse = await apiService.getComplaints();
              if (complaintsResponse.success && complaintsResponse.data) {
                const complaints = complaintsResponse.data;
                criticalCount = complaints.filter((complaint: any) => 
                  complaint.Priority?.toLowerCase() === 'critical'
                ).length;
              }
            } catch (complaintsErr) {
              console.warn('Failed to fetch complaints for critical count:', complaintsErr);
            }
          }
          
          const normalizedData: DashboardStats = {
            complaints: {
              total: backendData.complaints?.total ?? 0,
              open: backendData.complaints?.open ?? 0,
              inProgress: backendData.complaints?.inProgress ?? 0,
              // Map 'closed' from backend to 'resolved' for frontend
              resolved: backendData.complaints?.closed ?? backendData.complaints?.resolved ?? 0,
              // Use calculated critical count
              critical: criticalCount,
              // Map 'highPriority' from backend to 'high' for frontend
              high: backendData.complaints?.high ?? backendData.complaints?.highPriority ?? 0,
              medium: backendData.complaints?.medium ?? 0,
              low: backendData.complaints?.low ?? 0,
              active: backendData.complaints?.active ?? (backendData.complaints?.total ?? 0) - (backendData.complaints?.closed ?? backendData.complaints?.resolved ?? 0),
              inactive: backendData.complaints?.inactive ?? (backendData.complaints?.closed ?? backendData.complaints?.resolved ?? 0),
            },
            users: {
              total: backendData.users?.total ?? 0,
              active: backendData.users?.active ?? 0,
              inactive: backendData.users?.inactive ?? 0,
            },
            performance: {
              resolutionRate: backendData.performance?.resolutionRate ?? 0,
              averageResponseTime: backendData.performance?.averageResponseTime ?? '0h',
              customerSatisfaction: backendData.performance?.customerSatisfaction ?? 0,
            }
          };
          
          setStats(normalizedData);
        } else {
          setError('Failed to load dashboard statistics');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      color: 'text-primary'
    },
    {
      title: 'Open Cases',
      value: (complaintsStats.open ?? 0).toString(),
      description: 'Awaiting assignment',
      icon: AlertCircle,
      color: 'text-warning'
    },
    {
      title: 'In Progress',
      value: (complaintsStats.inProgress ?? 0).toString(),
      description: 'Currently being resolved',
      icon: Clock,
      color: 'text-primary'
    },
    {
      title: 'Resolved',
      value: (complaintsStats.resolved ?? 0).toString(),
      description: 'Successfully completed',
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'Critical Issues',
      value: (complaintsStats.critical ?? 0).toString(),
      description: 'Require immediate attention',
      icon: TrendingUp,
      color: 'text-destructive'
    },
    {
      title: 'High Priority',
      value: (complaintsStats.high ?? 0).toString(),
      description: 'Priority resolution needed',
      icon: Users,
      color: 'text-warning'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border-border hover:shadow-elevated transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}