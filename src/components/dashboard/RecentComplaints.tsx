import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Clock, User, AlertCircle } from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, Complaint } from '@/types/complaint';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { apiService } from '@/lib/api';

export function RecentComplaints() {
  const { canAccessRegion } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getComplaints();
        if (response.success && Array.isArray(response.data)) {
          // Map the response data to our Complaint interface
          const mappedComplaints = response.data.map((item: any) => ({
            id: item.ID || item.id || '',
            customerId: item['Customer ID'] || item.customerId || '',
            customer: {
              id: item['Customer ID'] || item.customerId || '',
              name: item['Customer Name'] || item.customerName || '',
              email: item['Customer Email'] || item.customerEmail || '',
              phone: item['Customer Phone'] || item.customerPhone || '',
              address: item['Customer Address'] || item.customerAddress || '',
              region: item.Region || item.region || '',
              meterNumber: item['Meter Number'] || item.meterNumber || '',
              accountNumber: item['Account Number'] || item.accountNumber || ''
            },
            title: item.Title || item.title || '',
            description: item.Description || item.description || '',
            category: item.Category || item.category || 'other',
            priority: item.Priority || item.priority || 'medium',
            status: item.Status || item.status || 'open',
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Complaints</CardTitle>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentComplaints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No complaints in your accessible regions
          </div>
        ) : (
          recentComplaints.map((complaint) => (
            <div key={complaint.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                    {complaint.title}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={`${PRIORITY_CONFIG[complaint.priority].bgColor} ${PRIORITY_CONFIG[complaint.priority].color}`}
                  >
                    {PRIORITY_CONFIG[complaint.priority].label}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {complaint.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{complaint.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(complaint.createdAt), 'MMM dd, HH:mm')}</span>
                  </div>
                  <span className="text-primary">{complaint.region}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2 ml-4">
                <Badge 
                  variant="secondary"
                  className={`${STATUS_CONFIG[complaint.status].bgColor} ${STATUS_CONFIG[complaint.status].color}`}
                >
                  {STATUS_CONFIG[complaint.status].label}
                </Badge>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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