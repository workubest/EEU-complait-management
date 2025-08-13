import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, User, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { Complaint } from '@/types/complaint';

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  medium: { label: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  high: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' }
};

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  'in-progress': { label: 'In Progress', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  resolved: { label: 'Resolved', color: 'text-green-700', bgColor: 'bg-green-100' },
  closed: { label: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-100' }
};

export function RecentComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { canAccessRegion } = useAuth();
  const navigate = useNavigate();

  const handleViewComplaint = (id: string) => {
    navigate(`/dashboard/complaints/${id}`);
  };

  const handleViewAll = () => {
    navigate('/dashboard/complaints');
  };

  // Helper functions to normalize data
  const normalizePriority = (priority: string): keyof typeof PRIORITY_CONFIG => {
    const normalized = priority.toLowerCase();
    if (normalized === 'low' || normalized === 'medium' || normalized === 'high' || normalized === 'critical' || normalized === 'urgent') {
      return normalized === 'urgent' ? 'critical' : normalized as keyof typeof PRIORITY_CONFIG;
    }
    return 'medium';
  };

  const normalizeStatus = (status: string): keyof typeof STATUS_CONFIG => {
    const normalized = status.toLowerCase().replace(/\s+/g, '-');
    if (normalized === 'open' || normalized === 'in-progress' || normalized === 'resolved' || normalized === 'closed') {
      return normalized as keyof typeof STATUS_CONFIG;
    }
    return 'open';
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await apiService.getComplaints();
        
        if (response.success && response.data) {
          // Transform the data to match our Complaint interface
          const mappedComplaints: Complaint[] = response.data.map((item: any) => ({
            id: item.ID || item.id || '',
            customer: {
              name: item['Customer Name'] || item.customerName || '',
              email: item['Customer Email'] || item.customerEmail || '',
              phone: item['Customer Phone'] || item.customerPhone || '',
              address: item['Customer Address'] || item.customerAddress || '',
              region: item['Customer Region'] || item.customerRegion || item.Region || item.region || '',
              meterNumber: item['Meter Number'] || item.meterNumber || '',
              accountNumber: item['Account Number'] || item.accountNumber || ''
            },
            title: item.Title || item.title || '',
            description: item.Description || item.description || '',
            category: item.Category || item.category || 'other',
            priority: normalizePriority(item.Priority || item.priority || 'medium'),
            status: normalizeStatus(item.Status || item.status || 'open'),
            region: item.Region || item.region || '',
            assignedTo: item['Assigned To'] || item.assignedTo || '',
            assignedBy: item['Assigned By'] || item.assignedBy || '',
            createdBy: item['Created By'] || item.createdBy || '',
            createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
            updatedAt: item['Updated At'] || item.updatedAt || new Date().toISOString(),
            estimatedResolution: item['Estimated Resolution'] || item.estimatedResolution || '',
            resolvedAt: item['Resolved At'] || item.resolvedAt || '',
            notes: item.Notes ? (Array.isArray(item.Notes) ? item.Notes : [item.Notes]) : []
          }));
          setComplaints(mappedComplaints);
        } else {
          setError('Failed to load complaints');
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const recentComplaints = complaints
    .filter(complaint => canAccessRegion(complaint.region))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Complaints</CardTitle>
          <Button variant="outline" size="sm" disabled>View All</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start justify-between p-4 border border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2 ml-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Complaints</CardTitle>
          <Button variant="outline" size="sm" disabled>View All</Button>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-lg font-semibold">Recent Complaints</CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          <span className="hidden sm:inline">View All</span>
          <span className="sm:hidden">All</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentComplaints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No complaints in your accessible regions
          </div>
        ) : (
          recentComplaints.map((complaint) => (
            <div key={complaint.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors space-y-3 sm:space-y-0">
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                    {complaint.title}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={`${PRIORITY_CONFIG[complaint.priority].bgColor} ${PRIORITY_CONFIG[complaint.priority].color} w-fit`}
                  >
                    {PRIORITY_CONFIG[complaint.priority].label}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {complaint.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-24 sm:max-w-none">{complaint.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(complaint.createdAt), 'MMM dd, HH:mm')}</span>
                  </div>
                  <span className="text-primary truncate max-w-20 sm:max-w-none">{complaint.region}</span>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start space-x-2 sm:space-x-0 sm:space-y-2 sm:ml-4">
                <Badge 
                  variant="secondary"
                  className={`${STATUS_CONFIG[complaint.status].bgColor} ${STATUS_CONFIG[complaint.status].color}`}
                >
                  {STATUS_CONFIG[complaint.status].label}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleViewComplaint(complaint.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}