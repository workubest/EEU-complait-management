import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Users,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

interface PerformanceMetric {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  category: 'efficiency' | 'quality' | 'speed' | 'satisfaction';
}

interface TeamPerformance {
  teamMember: string;
  role: string;
  completedTasks: number;
  averageTime: string;
  satisfactionScore: number;
  efficiency: number;
}

export function PerformanceMetrics() {
  const { user, role } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedPeriod]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const result = await apiService.getPerformanceMetrics(selectedPeriod);
      if (result.success && result.data) {
        // Transform backend data to include icons and styling
        const transformedMetrics = (result.data.metrics || []).map((metric: any) => ({
          ...metric,
          icon: getMetricIcon(metric.category),
          color: getMetricColor(metric.category),
          bgColor: getMetricBgColor(metric.category)
        }));
        
        setMetrics(transformedMetrics);
        setTeamPerformance(result.data.teamPerformance || []);
      } else {
        console.error('Failed to fetch performance data:', result.error);
        setMetrics([]);
        setTeamPerformance([]);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setMetrics([]);
      setTeamPerformance([]);
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'efficiency': return CheckCircle;
      case 'speed': return Clock;
      case 'satisfaction': return Award;
      case 'quality': return Target;
      default: return Activity;
    }
  };

  const getMetricColor = (category: string) => {
    switch (category) {
      case 'efficiency': return 'text-green-600';
      case 'speed': return 'text-blue-600';
      case 'satisfaction': return 'text-purple-600';
      case 'quality': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getMetricBgColor = (category: string) => {
    switch (category) {
      case 'efficiency': return 'bg-green-50';
      case 'speed': return 'bg-blue-50';
      case 'satisfaction': return 'bg-purple-50';
      case 'quality': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Activity;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean) => {
    if (trend === 'stable') return 'text-gray-500';
    if (trend === 'up') return isPositive ? 'text-green-500' : 'text-red-500';
    if (trend === 'down') return isPositive ? 'text-red-500' : 'text-green-500';
    return 'text-gray-500';
  };

  const getPerformanceColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 border border-border rounded-lg animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics Cards */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Performance Metrics</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Key performance indicators for {selectedPeriod}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {(['today', 'week', 'month', 'quarter'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={fetchPerformanceData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const TrendIcon = getTrendIcon(metric.trend);
              const isPositiveTrend = metric.trendValue > 0;
              const progressPercentage = Math.min((metric.value / metric.target) * 100, 100);
              
              return (
                <Card 
                  key={metric.id}
                  className={`border-border hover:shadow-elevated transition-all duration-300 animate-scale-in ${metric.bgColor}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <Icon className={`h-5 w-5 ${metric.color}`} />
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendIcon className={`h-4 w-4 ${getTrendColor(metric.trend, isPositiveTrend)}`} />
                        <span className={`text-sm font-medium ${getTrendColor(metric.trend, isPositiveTrend)}`}>
                          {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{metric.title}</h3>
                      <div className="flex items-baseline space-x-2">
                        <span className={`text-2xl font-bold ${getPerformanceColor(metric.value, metric.target)}`}>
                          {metric.value}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {metric.unit}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {metric.target}{metric.unit}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className="h-2"
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      {(role === 'admin' || role === 'manager') && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Team Performance</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Individual team member performance metrics
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member, index) => (
                <div 
                  key={member.teamMember}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{member.teamMember}</span>
                      <Badge variant="outline" className="text-xs w-fit">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{member.completedTasks}</div>
                      <div className="text-muted-foreground">Tasks</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{member.averageTime}</div>
                      <div className="text-muted-foreground">Avg Time</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{member.satisfactionScore}/5</div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${getPerformanceColor(member.efficiency, 90)}`}>
                        {member.efficiency}%
                      </div>
                      <div className="text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}