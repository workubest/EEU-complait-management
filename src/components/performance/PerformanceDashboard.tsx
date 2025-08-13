import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  Database, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { performanceMonitor, usePerformanceMonitor } from '@/utils/performance';
import { optimizedApiService } from '@/lib/api-optimized';
import { useServiceWorker } from '@/utils/service-worker';

interface PerformanceMetrics {
  webVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  timing: {
    pageLoad: number;
    domContentLoaded: number;
    firstPaint: number;
  };
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  cache: {
    hitRate: number;
    size: number;
    requests: number;
  };
  network: {
    requests: number;
    errors: number;
    avgResponseTime: number;
  };
}

const MetricCard = memo(({ 
  title, 
  value, 
  unit, 
  status, 
  trend, 
  icon: Icon 
}: {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}) => {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-600" />,
    down: <TrendingDown className="h-4 w-4 text-red-600" />,
    stable: <div className="h-4 w-4" />
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`text-2xl font-bold ${statusColors[status]}`}>
            {value.toFixed(value < 10 ? 2 : 0)}{unit}
          </div>
          {trend && trendIcons[trend]}
        </div>
      </CardContent>
    </Card>
  );
});

const WebVitalsCard = memo(({ webVitals }: { webVitals: PerformanceMetrics['webVitals'] }) => {
  const getVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2500, warning: 4000 },
      fid: { good: 100, warning: 300 },
      cls: { good: 0.1, warning: 0.25 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.warning) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Core Web Vitals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Largest Contentful Paint (LCP)</span>
            <Badge variant={getVitalStatus('lcp', webVitals.lcp) === 'good' ? 'default' : 'destructive'}>
              {webVitals.lcp.toFixed(0)}ms
            </Badge>
          </div>
          <Progress 
            value={Math.min((webVitals.lcp / 4000) * 100, 100)} 
            className="h-2"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">First Input Delay (FID)</span>
            <Badge variant={getVitalStatus('fid', webVitals.fid) === 'good' ? 'default' : 'destructive'}>
              {webVitals.fid.toFixed(0)}ms
            </Badge>
          </div>
          <Progress 
            value={Math.min((webVitals.fid / 300) * 100, 100)} 
            className="h-2"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Cumulative Layout Shift (CLS)</span>
            <Badge variant={getVitalStatus('cls', webVitals.cls) === 'good' ? 'default' : 'destructive'}>
              {webVitals.cls.toFixed(3)}
            </Badge>
          </div>
          <Progress 
            value={Math.min((webVitals.cls / 0.25) * 100, 100)} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
});

const MemoryUsageCard = memo(({ memory }: { memory: PerformanceMetrics['memory'] }) => {
  const usagePercent = (memory.used / memory.total) * 100;
  const limitPercent = (memory.used / memory.limit) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Memory Usage</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Heap Used</span>
            <span className="text-sm font-medium">
              {(memory.used / 1024 / 1024).toFixed(1)} MB
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Heap</span>
            <span className="text-sm font-medium">
              {(memory.total / 1024 / 1024).toFixed(1)} MB
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Heap Limit</span>
            <span className="text-sm font-medium">
              {(memory.limit / 1024 / 1024).toFixed(1)} MB
            </span>
          </div>
          <Progress value={limitPercent} className="h-2" />
        </div>
        
        {limitPercent > 80 && (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">High memory usage detected</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

const CacheStatsCard = memo(({ cache }: { cache: PerformanceMetrics['cache'] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Cache Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Hit Rate</span>
          <Badge variant={cache.hitRate > 80 ? 'default' : 'secondary'}>
            {cache.hitRate.toFixed(1)}%
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Cache Size</span>
          <span className="text-sm font-medium">{cache.size} entries</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Requests</span>
          <span className="text-sm font-medium">{cache.requests}</span>
        </div>
        
        <Progress value={cache.hitRate} className="h-2" />
      </CardContent>
    </Card>
  );
});

const NetworkStatsCard = memo(({ network }: { network: PerformanceMetrics['network'] }) => {
  const errorRate = (network.errors / network.requests) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Network Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Avg Response Time</span>
          <Badge variant={network.avgResponseTime < 1000 ? 'default' : 'destructive'}>
            {network.avgResponseTime.toFixed(0)}ms
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Requests</span>
          <span className="text-sm font-medium">{network.requests}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Error Rate</span>
          <Badge variant={errorRate < 5 ? 'default' : 'destructive'}>
            {errorRate.toFixed(1)}%
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Failed Requests</span>
          <span className="text-sm font-medium text-red-600">{network.errors}</span>
        </div>
      </CardContent>
    </Card>
  );
});

export const PerformanceDashboard = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { generateReport } = usePerformanceMonitor();
  const { isOnline, isRegistered } = useServiceWorker();

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Get performance metrics
      const performanceMetrics = performanceMonitor.getMetrics();
      const cacheStats = optimizedApiService.getCacheStats();
      
      // Get memory info if available
      const memoryInfo = (performance as any).memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      };

      // Calculate metrics
      const timingMetrics = performanceMetrics.filter(m => m.type === 'timing');
      const networkMetrics = performanceMetrics.filter(m => m.name.includes('api') || m.name.includes('request'));
      
      const webVitals = {
        lcp: performanceMonitor.getLatestMetric('largest_contentful_paint')?.value || 0,
        fid: performanceMonitor.getLatestMetric('first_input_delay')?.value || 0,
        cls: performanceMonitor.getLatestMetric('cumulative_layout_shift')?.value || 0
      };

      const timing = {
        pageLoad: performanceMonitor.getLatestMetric('page_load_time')?.value || 0,
        domContentLoaded: performanceMonitor.getLatestMetric('dom_content_loaded')?.value || 0,
        firstPaint: performanceMonitor.getLatestMetric('first_paint')?.value || 0
      };

      const memory = {
        used: memoryInfo.usedJSHeapSize,
        total: memoryInfo.totalJSHeapSize,
        limit: memoryInfo.jsHeapSizeLimit
      };

      const cache = {
        hitRate: cacheStats.active > 0 ? (cacheStats.active / cacheStats.total) * 100 : 0,
        size: cacheStats.total,
        requests: cacheStats.total + cacheStats.expired
      };

      const successfulRequests = networkMetrics.filter(m => m.name.includes('success')).length;
      const errorRequests = networkMetrics.filter(m => m.name.includes('error')).length;
      const avgResponseTime = networkMetrics.length > 0 
        ? networkMetrics.reduce((sum, m) => sum + m.value, 0) / networkMetrics.length 
        : 0;

      const network = {
        requests: successfulRequests + errorRequests,
        errors: errorRequests,
        avgResponseTime
      };

      setMetrics({
        webVitals,
        timing,
        memory,
        cache,
        network
      });
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleExportReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor application performance and optimization metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          {isRegistered && (
            <Badge variant="outline">SW Active</Badge>
          )}
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Page Load Time"
          value={metrics.timing.pageLoad}
          unit="ms"
          status={metrics.timing.pageLoad < 3000 ? 'good' : metrics.timing.pageLoad < 5000 ? 'warning' : 'error'}
          trend="stable"
          icon={Clock}
        />
        <MetricCard
          title="Memory Usage"
          value={(metrics.memory.used / 1024 / 1024)}
          unit="MB"
          status={metrics.memory.used / metrics.memory.limit < 0.8 ? 'good' : 'warning'}
          trend="up"
          icon={Database}
        />
        <MetricCard
          title="Cache Hit Rate"
          value={metrics.cache.hitRate}
          unit="%"
          status={metrics.cache.hitRate > 80 ? 'good' : metrics.cache.hitRate > 60 ? 'warning' : 'error'}
          trend="up"
          icon={Zap}
        />
        <MetricCard
          title="Avg Response Time"
          value={metrics.network.avgResponseTime}
          unit="ms"
          status={metrics.network.avgResponseTime < 1000 ? 'good' : metrics.network.avgResponseTime < 2000 ? 'warning' : 'error'}
          trend="down"
          icon={Activity}
        />
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <WebVitalsCard webVitals={metrics.webVitals} />
            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {Math.round((
                      (metrics.webVitals.lcp < 2500 ? 100 : metrics.webVitals.lcp < 4000 ? 50 : 0) +
                      (metrics.webVitals.fid < 100 ? 100 : metrics.webVitals.fid < 300 ? 50 : 0) +
                      (metrics.webVitals.cls < 0.1 ? 100 : metrics.webVitals.cls < 0.25 ? 50 : 0)
                    ) / 3)}
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Performance Score</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <MemoryUsageCard memory={metrics.memory} />
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <CacheStatsCard cache={metrics.cache} />
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <NetworkStatsCard network={metrics.network} />
        </TabsContent>
      </Tabs>
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';