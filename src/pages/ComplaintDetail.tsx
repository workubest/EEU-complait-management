import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, User, Calendar, AlertTriangle } from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, Complaint } from '@/types/complaint';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { format } from 'date-fns';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canAccessRegion, permissions } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format phone numbers
  const formatPhoneNumber = (phone: any) => {
    if (!phone) return '';
    if (typeof phone === 'number' && phone < 0) {
      return '+251-911-123456'; // Default Ethiopian format
    }
    return String(phone);
  };

  // Helper function to format notes
  const formatNotes = (notes: any) => {
    if (!notes) return [];
    if (typeof notes === 'string') {
      if (notes.includes('[Ljava.lang.Object;')) {
        return [];
      }
      return notes.split(';').map(note => note.trim()).filter(note => note && note.length > 0);
    }
    return [];
  };

  // Helper function to normalize priority values
  const normalizePriority = (priority: any) => {
    if (!priority) return 'medium';
    const normalized = String(priority).toLowerCase().trim();
    if (['low', 'medium', 'high', 'critical'].includes(normalized)) {
      return normalized;
    }
    return 'medium';
  };

  // Helper function to normalize status values
  const normalizeStatus = (status: any) => {
    if (!status) return 'open';
    const normalized = String(status).toLowerCase().trim();
    if (['open', 'in-progress', 'resolved', 'closed', 'cancelled'].includes(normalized)) {
      return normalized;
    }
    return 'open';
  };

  // Helper function to map API data to UI format
  const mapComplaintData = (item: any) => {
    return {
      id: item.ID || item.id || '',
      customerId: item['Customer ID'] || item.customerId || '1',
      title: item.Title || item.title || '',
      description: item.Description || item.description || '',
      category: item.Category || item.category || 'other',
      region: item.Region || item.region || item.Location || '',
      priority: normalizePriority(item.Priority || item.priority),
      status: normalizeStatus(item.Status || item.status),
      createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
      updatedAt: item['Updated At'] || item.updatedAt || item['Created At'] || item.createdAt || new Date().toISOString(),
      resolvedAt: item['Resolved At'] || item.resolvedAt || '',
      estimatedResolution: item['Estimated Resolution'] || item.estimatedResolution || '',
      assignedTo: item['Assigned To'] || item.assignedTo || '',
      assignedBy: item['Assigned By'] || item.assignedBy || '',
      createdBy: item['Created By'] || item.createdBy || '',
      notes: formatNotes(item.Notes),
      attachments: item.Attachments ? (typeof item.Attachments === 'string' ? item.Attachments.split(';').map(att => att.trim()).filter(att => att) : []) : [],
      customer: {
        id: item['Customer ID'] || item.customerId || '1',
        name: item['Customer Name'] || item.customerName || item.customer?.name || '',
        email: item['Customer Email'] || item.customerEmail || item.customer?.email || '',
        phone: formatPhoneNumber(item['Customer Phone'] || item.customerPhone || item.customer?.phone),
        address: item['Customer Address'] || item.customerAddress || item.customer?.address || item.Location || '',
        region: item.Region || item.region || item.Location || '',
        meterNumber: item['Meter Number'] || item.meterNumber || item.customer?.meterNumber || '',
        accountNumber: item['Account Number'] || item.accountNumber || item.customer?.accountNumber || '',
      },
    };
  };

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) {
        setError('No complaint ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch all complaints and find the one with matching ID
        const result = await apiService.getComplaints();
        
        if (result && result.success && Array.isArray(result.data)) {
          const complaints = result.data.map(mapComplaintData);
          const foundComplaint = complaints.find(c => c.id === id);
          
          if (foundComplaint) {
            // Check if user has access to this complaint's region
            if (!canAccessRegion(foundComplaint.region)) {
              setError('You do not have access to view this complaint');
              setLoading(false);
              return;
            }
            
            setComplaint(foundComplaint);
          } else {
            setError('Complaint not found');
          }
        } else {
          setError('Failed to fetch complaint data');
        }
      } catch (err) {
        console.error('Error fetching complaint:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch complaint');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, canAccessRegion]);

  const handleEdit = () => {
    if (!permissions.complaints.update) {
      toast({
        title: t('common.error'),
        description: t('permissions.access_denied'),
        variant: "destructive"
      });
      return;
    }
    // Navigate to edit mode or open edit dialog
    // For now, navigate back to complaints list
    navigate('/dashboard/complaints');
  };

  const isComplaintOverdue = (complaint: Complaint) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const createdAt = new Date(complaint.createdAt);
    const status = complaint.status?.toLowerCase();
    
    return createdAt < sevenDaysAgo && 
           status !== 'resolved' && 
           status !== 'closed' && 
           status !== 'cancelled';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading complaint...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">Error loading complaint</h3>
          <p className="text-destructive/80 mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard/complaints')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Complaints
          </Button>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Complaint not found</h3>
          <p className="text-muted-foreground/80 mb-4">The requested complaint could not be found.</p>
          <Button onClick={() => navigate('/dashboard/complaints')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Complaints
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate('/dashboard/complaints')} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Complaints
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Complaint Details
            </h1>
            <p className="text-muted-foreground mt-1">
              {complaint.id}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {permissions.complaints.update && (
            <Button onClick={handleEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Complaint Information</span>
                <div className="flex items-center space-x-2">
                  {isComplaintOverdue(complaint) && (
                    <Badge variant="destructive" className="flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                  <Badge 
                    variant={STATUS_CONFIG[complaint.status]?.variant || 'secondary'}
                    className={STATUS_CONFIG[complaint.status]?.className}
                  >
                    {STATUS_CONFIG[complaint.status]?.label || complaint.status}
                  </Badge>
                  <Badge 
                    variant={PRIORITY_CONFIG[complaint.priority]?.variant || 'secondary'}
                    className={PRIORITY_CONFIG[complaint.priority]?.className}
                  >
                    {PRIORITY_CONFIG[complaint.priority]?.label || complaint.priority}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {complaint.title}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {complaint.category.replace('-', ' ')}
                </p>
              </div>

              {complaint.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md mt-1">
                    {complaint.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.customer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.customer.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.customer.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Region</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.region}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Center</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.customer.serviceCenter || complaint.serviceCenter || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.customer.address || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Meter Number</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.customer.meterNumber || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account Number</Label>
                  <p className="text-sm text-muted-foreground mt-1">{complaint.customer.accountNumber || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Assignment */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Created At</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(complaint.createdAt), 'PPP p')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(complaint.updatedAt), 'PPP p')}
                </p>
              </div>
              {complaint.estimatedResolution && (
                <div>
                  <Label className="text-sm font-medium">Estimated Resolution</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(complaint.estimatedResolution), 'PPP p')}
                  </p>
                </div>
              )}
              {complaint.resolvedAt && (
                <div>
                  <Label className="text-sm font-medium">Resolved At</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(complaint.resolvedAt), 'PPP p')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Information */}
          {(complaint.assignedTo || complaint.assignedBy || complaint.createdBy) && (
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint.assignedTo && (
                  <div>
                    <Label className="text-sm font-medium">Assigned To</Label>
                    <p className="text-sm text-muted-foreground mt-1">User ID: {complaint.assignedTo}</p>
                  </div>
                )}
                {complaint.assignedBy && (
                  <div>
                    <Label className="text-sm font-medium">Assigned By</Label>
                    <p className="text-sm text-muted-foreground mt-1">User ID: {complaint.assignedBy}</p>
                  </div>
                )}
                {complaint.createdBy && (
                  <div>
                    <Label className="text-sm font-medium">Created By</Label>
                    <p className="text-sm text-muted-foreground mt-1">User ID: {complaint.createdBy}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {complaint.notes && complaint.notes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {complaint.notes.map((note, index) => (
                    <div key={index} className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {note}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {complaint.attachments.map((attachment, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {attachment}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;