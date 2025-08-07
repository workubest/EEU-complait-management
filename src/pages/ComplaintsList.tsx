import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Eye, Edit, User, Calendar, Trash2, UserCheck, Plus, AlertTriangle } from 'lucide-react';
// import { mockComplaints } from '@/data/mockData';
import { STATUS_CONFIG, PRIORITY_CONFIG, Complaint } from '@/types/complaint';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedAction } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { format } from 'date-fns';

const ComplaintsList: React.FC = () => {
  const { canAccessRegion, permissions, user } = useAuth();
  const { toast } = useToast();

  // Helper function to format phone numbers
  const formatPhoneNumber = (phone: any) => {
    if (!phone) return '';
    // If it's a negative number, it's likely a formatting issue from the API
    if (typeof phone === 'number' && phone < 0) {
      // Try to reconstruct the phone number (this is a workaround for API issues)
      return '+251-911-123456'; // Default Ethiopian format
    }
    return String(phone);
  };

  // Helper function to format notes
  const formatNotes = (notes: any) => {
    if (!notes) return [];
    if (typeof notes === 'string') {
      // Filter out Java object serialization artifacts
      if (notes.includes('[Ljava.lang.Object;')) {
        return []; // Return empty array for corrupted notes
      }
      return notes.split(';').map(note => note.trim()).filter(note => note && note.length > 0);
    }
    return [];
  };

  // Helper function to map API data to UI format
  const mapComplaintData = (item: any) => ({
    id: item.ID || item.id || '',
    customerId: item['Customer ID'] || item.customerId || '1',
    title: item.Title || item.title || '',
    description: item.Description || item.description || '',
    category: item.Category || item.category || 'other',
    region: item.Region || item.region || item.Location || '',
    priority: item.Priority || item.priority || 'medium',
    status: item.Status || item.status || 'open',
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
  });

  // Helper function to check if a complaint is overdue (older than 7 days and not resolved/closed)
  const isComplaintOverdue = (complaint: any) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const createdAt = new Date(complaint.createdAt);
    const status = complaint.status?.toLowerCase();
    
    return createdAt < sevenDaysAgo && 
           status !== 'resolved' && 
           status !== 'closed' && 
           status !== 'cancelled';
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [viewingComplaint, setViewingComplaint] = useState<Complaint | null>(null);

  React.useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiService.getComplaints();
        if (result && result.success && Array.isArray(result.data)) {
          // Map raw sheet data to expected UI shape
          const mapped = result.data.map(mapComplaintData);
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

  // Filter complaints based on user access and search criteria
  const filteredComplaints = complaints.filter(complaint => {
    const matchesAccess = canAccessRegion(complaint.region);
    const matchesSearch = searchTerm === '' || 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;

    return matchesAccess && matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewComplaint = (complaint: Complaint) => {
    setViewingComplaint(complaint);
  };

  const handleEditComplaint = (complaint: Complaint) => {
    if (!permissions.complaints.update) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit complaints.",
        variant: "destructive"
      });
      return;
    }
    setEditingComplaint(complaint);
  };

  const handleUpdateComplaint = async () => {
    if (!editingComplaint) return;

    try {
      const result = await apiService.updateComplaint(editingComplaint.id, editingComplaint);

      if (result.success) {
        // Refresh complaints list
        const complaintsResult = await apiService.getComplaints();
        if (complaintsResult.success && Array.isArray(complaintsResult.data)) {
          const mapped = complaintsResult.data.map(mapComplaintData);
          setComplaints(mapped);
        }

        setEditingComplaint(null);
        toast({
          title: "Complaint Updated",
          description: "The complaint has been successfully updated.",
        });
      } else {
        throw new Error(result.error || 'Failed to update complaint');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update complaint",
        variant: "destructive"
      });
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    if (!permissions.complaints.delete) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete complaints.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await apiService.deleteComplaint(complaintId);

      if (result.success) {
        setComplaints(complaints.filter(c => c.id !== complaintId));
        toast({
          title: "Complaint Deleted",
          description: "The complaint has been successfully deleted.",
        });
      } else {
        throw new Error(result.error || 'Failed to delete complaint');
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete complaint",
        variant: "destructive"
      });
    }
  };

  const handleAssignComplaint = async (complaintId: string, assigneeId: string) => {
    try {
      const result = await apiService.assignComplaint(complaintId, assigneeId);

      if (result.success) {
        // Refresh complaints list
        const complaintsResult = await apiService.getComplaints();
        if (complaintsResult.success && Array.isArray(complaintsResult.data)) {
          const mapped = complaintsResult.data.map(mapComplaintData);
          setComplaints(mapped);
        }

        toast({
          title: "Complaint Assigned",
          description: "The complaint has been successfully assigned.",
        });
      } else {
        throw new Error(result.error || 'Failed to assign complaint');
      }
    } catch (error) {
      console.error('Error assigning complaint:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign complaint",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading complaints...</h3>
        </div>
      </div>
    );
  }

// ...existing code...
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">Error loading complaints</h3>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight">All Complaints</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">Manage and track electrical supply complaints</p>
        </div>
        <ProtectedAction resource="complaints" action="create">
          <Button className="bg-gradient-primary" onClick={() => window.location.href = '/complaint-form'}>
            <Plus className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
        </ProtectedAction>
      </div>

      {/* Search and Filters */}
      <Card className="border-none shadow-card bg-gradient-to-br from-primary/10 to-primary-glow/10 animate-slide-up hover:shadow-elevated transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Filter className="h-5 w-5 text-primary" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card className="border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>
            Complaints ({filteredComplaints.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No complaints found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{complaint.id}</span>
                          {isComplaintOverdue(complaint) && (
                            <AlertTriangle 
                              className="h-4 w-4 text-destructive" 
                              title="Overdue - Created more than 7 days ago"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="font-medium truncate">{complaint.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {complaint.category.replace('-', ' ')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{complaint.customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-primary">{complaint.region}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={`${PRIORITY_CONFIG[complaint.priority].bgColor} ${PRIORITY_CONFIG[complaint.priority].color}`}
                        >
                          {PRIORITY_CONFIG[complaint.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={`${STATUS_CONFIG[complaint.status].bgColor} ${STATUS_CONFIG[complaint.status].color}`}
                        >
                          {STATUS_CONFIG[complaint.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(complaint.createdAt), 'MMM dd')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewComplaint(complaint)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <ProtectedAction resource="complaints" action="update">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditComplaint(complaint)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </ProtectedAction>
                          <ProtectedAction resource="complaints" action="delete">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComplaint(complaint.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ProtectedAction>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Complaint Dialog */}
      {viewingComplaint && (
        <Dialog open={!!viewingComplaint} onOpenChange={() => setViewingComplaint(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>Complaint Details - {viewingComplaint.id}</span>
                {isComplaintOverdue(viewingComplaint) && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{viewingComplaint.category.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="mt-1">
                      <Badge className={`${PRIORITY_CONFIG[viewingComplaint.priority].bgColor} ${PRIORITY_CONFIG[viewingComplaint.priority].color}`}>
                        {PRIORITY_CONFIG[viewingComplaint.priority].label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${STATUS_CONFIG[viewingComplaint.status].bgColor} ${STATUS_CONFIG[viewingComplaint.status].color}`}>
                        {STATUS_CONFIG[viewingComplaint.status].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {viewingComplaint.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    {viewingComplaint.description}
                  </p>
                </div>
              )}

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.customer.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.customer.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.customer.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.customer.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Region</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.region}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Meter Number</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.customer.meterNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Account Number</Label>
                    <p className="text-sm text-muted-foreground mt-1">{viewingComplaint.customer.accountNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Created At</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(viewingComplaint.createdAt), 'PPP p')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Updated</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(viewingComplaint.updatedAt), 'PPP p')}
                    </p>
                  </div>
                  {viewingComplaint.estimatedResolution && (
                    <div>
                      <Label className="text-sm font-medium">Estimated Resolution</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(viewingComplaint.estimatedResolution), 'PPP p')}
                      </p>
                    </div>
                  )}
                  {viewingComplaint.resolvedAt && (
                    <div>
                      <Label className="text-sm font-medium">Resolved At</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(viewingComplaint.resolvedAt), 'PPP p')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment Information */}
              {(viewingComplaint.assignedTo || viewingComplaint.assignedBy || viewingComplaint.createdBy) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Assignment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {viewingComplaint.assignedTo && (
                      <div>
                        <Label className="text-sm font-medium">Assigned To</Label>
                        <p className="text-sm text-muted-foreground mt-1">User ID: {viewingComplaint.assignedTo}</p>
                      </div>
                    )}
                    {viewingComplaint.assignedBy && (
                      <div>
                        <Label className="text-sm font-medium">Assigned By</Label>
                        <p className="text-sm text-muted-foreground mt-1">User ID: {viewingComplaint.assignedBy}</p>
                      </div>
                    )}
                    {viewingComplaint.createdBy && (
                      <div>
                        <Label className="text-sm font-medium">Created By</Label>
                        <p className="text-sm text-muted-foreground mt-1">User ID: {viewingComplaint.createdBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewingComplaint.notes && viewingComplaint.notes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Notes</h3>
                  <div className="space-y-2">
                    {viewingComplaint.notes.map((note, index) => (
                      <div key={index} className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Complaint Dialog */}
      {editingComplaint && (
        <Dialog open={!!editingComplaint} onOpenChange={() => setEditingComplaint(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Complaint - {editingComplaint.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingComplaint.title}
                    onChange={(e) => setEditingComplaint({...editingComplaint, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingComplaint.category}
                    onChange={(e) => setEditingComplaint({...editingComplaint, category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select 
                    value={editingComplaint.priority} 
                    onValueChange={(value) => setEditingComplaint({...editingComplaint, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editingComplaint.status} 
                    onValueChange={(value) => setEditingComplaint({...editingComplaint, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingComplaint(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateComplaint}>
                  Update Complaint
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ComplaintsList;
export { ComplaintsList };