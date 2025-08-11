import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  AlertTriangle,
  MapPin,
  Calendar
} from 'lucide-react';
// import { mockComplaints } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ETHIOPIAN_REGIONS } from '@/types/user';
import { COMPLAINT_CATEGORIES } from '@/types/complaint';
import { ProtectedAction } from '@/components/auth/ProtectedRoute';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, FileText, Share2 } from 'lucide-react';
export function Analytics() {
  const { canAccessRegion, permissions } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiService.getComplaints();
        if (result && result.success && Array.isArray(result.data)) {
          const mapped = result.data.map((item) => ({
            id: item.ID || item.id || '',
            title: item.Title || item.title || '',
            category: item.Category || item.category || '',
            region: item.Region || item.region || '',
            priority: item.Priority || item.priority || 'medium',
            status: item.Status || item.status || 'open',
            createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
            customer: {
              name: item['Customer Name'] || item.customerName || item.customer?.name || '',
              email: item['Customer Email'] || item.customerEmail || item.customer?.email || '',
              phone: item['Customer Phone'] || item.customerPhone || item.customer?.phone || '',
            },
          }));
          setComplaints(mapped);
          setError(null);
        } else {
          setComplaints([]);
          setError(result && result.error ? result.error : 'No complaints found');
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch complaints');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on user access
  const accessibleComplaints = complaints.filter(complaint => 
    canAccessRegion(complaint.region)
  );

  // Calculate analytics data
  const totalComplaints = accessibleComplaints.length;
  const resolvedComplaints = accessibleComplaints.filter(c => c.status === 'resolved').length;
  const openComplaints = accessibleComplaints.filter(c => c.status === 'open').length;
  const inProgressComplaints = accessibleComplaints.filter(c => c.status === 'in-progress').length;
  const criticalComplaints = accessibleComplaints.filter(c => c.priority === 'critical').length;

  const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0;
  const criticalRate = totalComplaints > 0 ? (criticalComplaints / totalComplaints) * 100 : 0;

  // Regional breakdown
  const regionStats = ETHIOPIAN_REGIONS.map(region => {
    const regionComplaints = accessibleComplaints.filter(c => c.region === region);
    return {
      region,
      total: regionComplaints.length,
      open: regionComplaints.filter(c => c.status === 'open').length,
      resolved: regionComplaints.filter(c => c.status === 'resolved').length
    };
  }).filter(stat => stat.total > 0);

  // Category breakdown
  const categoryStats = COMPLAINT_CATEGORIES.map(category => {
    const categoryComplaints = accessibleComplaints.filter(c => c.category === category.value);
    return {
      ...category,
      count: categoryComplaints.length,
      percentage: totalComplaints > 0 ? (categoryComplaints.length / totalComplaints) * 100 : 0
    };
  }).filter(stat => stat.count > 0).sort((a, b) => b.count - a.count);

  // Recent trends
  const trendData = [
    { period: 'This Week', complaints: accessibleComplaints.filter(c => 
      new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length },
    { period: 'Last Week', complaints: Math.floor(totalComplaints * 0.3) },
    { period: 'This Month', complaints: totalComplaints },
    { period: 'Last Month', complaints: Math.floor(totalComplaints * 0.8) }
  ];

  // Report generation functions
  const handleGenerateReport = async (reportType: string) => {
    if (!permissions.reports.create) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to generate reports.",
        variant: "destructive"
      });
      return;
    }

    try {
      const reportData = {
        type: reportType,
        data: {
          totalComplaints,
          resolvedComplaints,
          openComplaints,
          inProgressComplaints,
          criticalComplaints,
          resolutionRate,
          regionStats,
          categoryStats,
          trendData
        },
        generatedAt: new Date().toISOString(),
        generatedBy: 'current-user' // This should come from auth context
      };

      const result = await apiService.createReport(reportData);
      
      if (result.success) {
        toast({
          title: "Report Generated",
          description: `${reportType} report has been generated successfully.`,
        });
      } else {
        throw new Error(result.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive"
      });
    }
  };

  const handleExportData = () => {
    if (!permissions.reports.read) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to export data.",
        variant: "destructive"
      });
      return;
    }

    // Create CSV data
    const csvData = accessibleComplaints.map(complaint => ({
      ID: complaint.id,
      Title: complaint.title,
      Category: complaint.category,
      Region: complaint.region,
      Priority: complaint.priority,
      Status: complaint.status,
      'Customer Name': complaint.customer.name,
      'Customer Email': complaint.customer.email,
      'Customer Phone': complaint.customer.phone,
      'Created At': complaint.createdAt
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Analytics data has been exported to CSV.",
    });
  };

  if (!permissions.reports.read) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to view analytics</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading analytics...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium text-destructive mb-2">Error loading analytics</h3>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">Electrical supply complaint analytics and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <ProtectedAction resource="reports" action="read">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </ProtectedAction>
          <ProtectedAction resource="reports" action="create">
            <Button onClick={() => handleGenerateReport('Monthly Summary')}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </ProtectedAction>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {/* Total Complaints */}
        <Card className="border-none shadow-card bg-gradient-to-br from-primary to-primary-glow hover:scale-[1.03] transition-transform duration-300 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-primary-foreground group-hover:underline">Total Complaints</CardTitle>
            <BarChart3 className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-primary-foreground group-hover:tracking-wider transition-all">{totalComplaints}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={100} className="flex-1 bg-primary-foreground/20" />
              <span className="text-xs text-primary-foreground/80">100%</span>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Rate */}
        <Card className="border-none shadow-card bg-gradient-to-br from-success to-primary-glow hover:scale-[1.03] transition-transform duration-300 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-success-foreground group-hover:underline">Resolution Rate</CardTitle>
            <TrendingUp className="h-6 w-6 text-success-foreground group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-success-foreground group-hover:tracking-wider transition-all">{resolutionRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={resolutionRate} className="flex-1 bg-success-foreground/20" />
              <span className="text-xs text-success-foreground/80">{resolvedComplaints} resolved</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Cases */}
        <Card className="border-none shadow-card bg-gradient-to-br from-warning to-primary-glow hover:scale-[1.03] transition-transform duration-300 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-warning-foreground group-hover:underline">Pending Cases</CardTitle>
            <Clock className="h-6 w-6 text-warning-foreground group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-warning-foreground group-hover:tracking-wider transition-all">{openComplaints + inProgressComplaints}</div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex space-x-1">
                <Badge variant="outline" className="text-xs border-warning text-warning-foreground bg-warning/10">{openComplaints} Open</Badge>
                <Badge variant="outline" className="text-xs border-warning text-warning-foreground bg-warning/10">{inProgressComplaints} In Progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Issues */}
        <Card className="border-none shadow-card bg-gradient-to-br from-destructive to-primary-glow hover:scale-[1.03] transition-transform duration-300 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-destructive-foreground group-hover:underline">Critical Issues</CardTitle>
            <AlertTriangle className="h-6 w-6 text-destructive-foreground group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-destructive-foreground group-hover:tracking-wider transition-all">{criticalComplaints}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={criticalRate} className="flex-1 bg-destructive-foreground/20" />
              <span className="text-xs text-destructive-foreground/80">{criticalRate.toFixed(1)}% critical</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Breakdown */}
        <Card className="border-none shadow-card bg-gradient-to-br from-primary/10 to-primary-glow/10 animate-slide-up hover:shadow-elevated hover:scale-[1.02] transition-all duration-300 group" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary group-hover:underline">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Regional Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionStats.map((stat) => (
                <div key={stat.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{stat.region}</span>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/10">
                        {stat.total} total
                      </Badge>
                      <Badge variant="outline" className="text-xs border-success text-success bg-success/10">
                        {stat.resolved} resolved
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={stat.total > 0 ? (stat.resolved / stat.total) * 100 : 0} 
                    className="h-2 bg-primary/10"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Analysis */}
        <Card className="border-none shadow-card bg-gradient-to-br from-success/10 to-primary-glow/10 animate-slide-up hover:shadow-elevated hover:scale-[1.02] transition-all duration-300 group" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-success group-hover:underline">
              <Zap className="h-5 w-5 text-success" />
              <span>Complaint Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-success">{category.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-success/80">
                        {category.count} ({category.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2 bg-success/10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card className="border-none shadow-card bg-gradient-to-br from-primary/10 to-primary-glow/10 animate-slide-up hover:shadow-elevated hover:scale-[1.01] transition-all duration-300 group" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary group-hover:underline">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Complaint Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {trendData.map((trend, index) => (
              <div key={trend.period} className="text-center p-4 border border-primary/20 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <div className="text-2xl font-bold text-primary">{trend.complaints}</div>
                <div className="text-sm text-primary/80">{trend.period}</div>
                {index === 0 && (
                  <Badge variant="outline" className="mt-2 text-xs border-success text-success bg-success/10">
                    Current
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <Card className="border-none shadow-card bg-gradient-to-br from-success/10 to-primary-glow/10 animate-slide-up hover:shadow-elevated hover:scale-[1.01] transition-all duration-300 group" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-success group-hover:underline">
            <Users className="h-5 w-5 text-success" />
            <span>Performance Indicators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-success mb-2">
                {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0}%
              </div>
              <div className="text-sm text-success/80">Customer Satisfaction</div>
              <Progress value={totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0} className="mt-2 bg-success/10" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-extrabold text-primary mb-2">4.2h</div>
              <div className="text-sm text-primary/80">Avg Response Time</div>
              <Progress value={85} className="mt-2 bg-primary/10" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-extrabold text-warning mb-2">24h</div>
              <div className="text-sm text-warning/80">Avg Resolution Time</div>
              <Progress value={70} className="mt-2 bg-warning/10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

