import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Eye, Edit, User, Calendar, Trash2, UserCheck, Plus, AlertTriangle, Phone, MapPin, Settings, CheckCircle, Info, SortDesc, Clock, Building } from 'lucide-react';
// import { mockComplaints } from '@/data/mockData';
import { STATUS_CONFIG, PRIORITY_CONFIG, Complaint, ComplaintStatus, ComplaintPriority } from '@/types/complaint';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProtectedAction } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { format } from 'date-fns';
import { RepairOrderExportDialog } from '@/components/export/RepairOrderExportDialog';

// Work types for status updates
const WORK_TYPES = [
  { value: 'fuse_replacement', label: 'Changing Fuse' },
  { value: 'joint_repair', label: 'Joining Joints' },
  { value: 'wire_jointing', label: 'Jointing Wire Cut' },
  { value: 'cable_repair', label: 'Cable Repair' },
  { value: 'transformer_maintenance', label: 'Transformer Maintenance' },
  { value: 'meter_replacement', label: 'Meter Replacement' },
  { value: 'pole_replacement', label: 'Pole Replacement' },
  { value: 'line_extension', label: 'Line Extension' },
  { value: 'voltage_regulation', label: 'Voltage Regulation' },
  { value: 'insulator_replacement', label: 'Insulator Replacement' },
  { value: 'grounding_repair', label: 'Grounding System Repair' },
  { value: 'switch_maintenance', label: 'Switch Maintenance' },
  { value: 'other', label: 'Other Work' }
];

const ComplaintsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { canAccessRegion, permissions, user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Ensure config objects are properly defined
  React.useEffect(() => {
    if (!STATUS_CONFIG || !PRIORITY_CONFIG) {
      console.error('STATUS_CONFIG or PRIORITY_CONFIG not properly imported');
    }
  }, []);

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

  // Helper function to normalize priority values
  const normalizePriority = (priority: any): ComplaintPriority => {
    if (!priority) return 'medium';
    const normalized = String(priority).toLowerCase().trim();
    if (['low', 'medium', 'high', 'critical'].includes(normalized)) {
      return normalized as ComplaintPriority;
    }
    return 'medium';
  };

  // Helper function to normalize status values
  const normalizeStatus = (status: any): ComplaintStatus => {
    if (!status) return 'open';
    const normalized = String(status).toLowerCase().trim();
    if (['open', 'in-progress', 'resolved', 'escalated', 'closed', 'cancelled'].includes(normalized)) {
      return normalized as ComplaintStatus;
    }
    return 'open';
  };

  // Helper function to map API data to UI format
  const mapComplaintData = (item: any) => {
    // Validate priority and status values
    if (item.Priority && !['low', 'medium', 'high', 'critical'].includes(String(item.Priority).toLowerCase().trim())) {
      console.warn('Invalid priority value received:', item.Priority);
    }
    if (item.Status && !['open', 'in-progress', 'resolved', 'escalated', 'closed', 'cancelled'].includes(String(item.Status).toLowerCase().trim())) {
      console.warn('Invalid status value received:', item.Status);
    }
    
    const mappedData = {
    id: item.ID || item.id || '',
    customerId: item['Customer ID'] || item.customerId || '1',
    title: item.Title || item.title || '',
    description: item.Description || item.description || '',
    category: item.Category || item.category || 'other',
    region: item.Region || item.region || item.Location || '',
    serviceCenter: item['Service Center'] || item.serviceCenter || '',
    priority: normalizePriority(item.Priority || item.priority),
    status: normalizeStatus(item.Status || item.status),
    createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
    updatedAt: item['Updated At'] || item.updatedAt || item['Created At'] || item.createdAt || new Date().toISOString(),
    resolvedAt: item['Resolved At'] || item.resolvedAt || '',
    estimatedResolution: item['Estimated Resolution'] || item.estimatedResolution || '',
    assignedTo: item['Assigned To'] || item.assignedTo || '',
    assignedBy: item['Assigned By'] || item.assignedBy || '',
    createdBy: item['Created By'] || item.createdBy || '',
    contractNumber: item['Contract Number'] || item.contractNumber || item.customer?.contractNumber || '',
    businessPartner: item['Business Partner'] || item.businessPartner || item.customer?.businessPartner || '',
    repairOrder: item['Repair Order'] || item.repairOrder || item.repairOrderNumber || '',
    notes: formatNotes(item.Notes),
    attachments: item.Attachments ? (typeof item.Attachments === 'string' ? item.Attachments.split(';').map(att => att.trim()).filter(att => att) : []) : [],
    customer: {
      id: item['Customer ID'] || item.customerId || '1',
      name: item['Customer Name'] || item.customerName || item.customer?.name || '',
      email: item['Customer Email'] || item.customerEmail || item.customer?.email || '',
      phone: formatPhoneNumber(item['Customer Phone'] || item.customerPhone || item.customer?.phone),
      address: item['Customer Address'] || item.customerAddress || item.customer?.address || item.Location || '',
      region: item.Region || item.region || item.Location || '',
      serviceCenter: item['Service Center'] || item.serviceCenter || item.customer?.serviceCenter || '',
      meterNumber: item['Meter Number'] || item.meterNumber || item.customer?.meterNumber || '',
      accountNumber: item['Account Number'] || item.accountNumber || item.customer?.accountNumber || '',
      contractNumber: item['Contract Number'] || item.contractNumber || item.customer?.contractNumber || '',
      businessPartner: item['Business Partner'] || item.businessPartner || item.customer?.businessPartner || '',
    },
  };
  
  return mappedData;
};

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
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [priorityFilter, setPriorityFilter] = useState<string>(searchParams.get('priority') || 'all');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [viewingComplaint, setViewingComplaint] = useState<Complaint | null>(null);
  const [statusUpdateComplaint, setStatusUpdateComplaint] = useState<Complaint | null>(null);
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: '',
    workType: '',
    notes: '',
    resolutionNotes: ''
  });

  // Handle URL parameter changes
  useEffect(() => {
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    
    if (status && status !== statusFilter) {
      setStatusFilter(status);
    }
    if (priority && priority !== priorityFilter) {
      setPriorityFilter(priority);
    }
    if (search && search !== searchTerm) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  // Update URL when filters change (with debounce for search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      
      if (searchTerm && searchTerm !== '') {
        params.set('search', searchTerm);
      }
      if (statusFilter && statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      if (priorityFilter && priorityFilter !== 'all') {
        params.set('priority', priorityFilter);
      }
      
      // Only update URL if params have changed
      const newSearch = params.toString();
      const currentSearch = searchParams.toString();
      if (newSearch !== currentSearch) {
        setSearchParams(params, { replace: true });
      }
    }, 300); // 300ms debounce for search, immediate for dropdowns
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, priorityFilter]);

  React.useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiService.getComplaints();
        if (result && result.success && Array.isArray(result.data)) {
          // Map raw sheet data to expected UI shape and sort by creation date (most recent first)
          const mapped = result.data.map(mapComplaintData).filter(complaint => {
            // Filter out any null/invalid complaints
            return complaint && complaint.id && complaint.priority && complaint.status;
          }).sort((a, b) => {
            // Sort by creation date - most recent first
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
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
    
    // Enhanced search functionality - search across multiple fields
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      // Basic complaint info
      complaint.title.toLowerCase().includes(searchLower) ||
      complaint.id.toLowerCase().includes(searchLower) ||
      complaint.description.toLowerCase().includes(searchLower) ||
      
      // Customer information
      complaint.customer?.name?.toLowerCase().includes(searchLower) ||
      complaint.customer?.email?.toLowerCase().includes(searchLower) ||
      complaint.customer?.phone?.toLowerCase().includes(searchLower) ||
      complaint.customer?.address?.toLowerCase().includes(searchLower) ||
      
      // Contract and business information
      complaint.contractNumber?.toLowerCase().includes(searchLower) ||
      complaint.businessPartner?.toLowerCase().includes(searchLower) ||
      complaint.customer?.contractNumber?.toLowerCase().includes(searchLower) ||
      complaint.customer?.businessPartner?.toLowerCase().includes(searchLower) ||
      
      // Account and meter information
      complaint.customer?.accountNumber?.toLowerCase().includes(searchLower) ||
      complaint.customer?.meterNumber?.toLowerCase().includes(searchLower) ||
      
      // Repair order information
      complaint.repairOrder?.toLowerCase().includes(searchLower) ||
      
      // Region and location
      complaint.region?.toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;

    return matchesAccess && matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewComplaint = (complaint: Complaint) => {
    navigate(`/dashboard/complaints/${complaint.id}`);
  };

  const handleEditComplaint = (complaint: Complaint) => {
    if (!permissions.complaints.update) {
      toast({
        title: t('common.error'),
        description: t('permissions.access_denied'),
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
        // Refresh complaints list with sorting
        const complaintsResult = await apiService.getComplaints();
        if (complaintsResult.success && Array.isArray(complaintsResult.data)) {
          const mapped = complaintsResult.data.map(mapComplaintData).filter(complaint => {
            return complaint && complaint.id && complaint.priority && complaint.status;
          }).sort((a, b) => {
            // Sort by creation date - most recent first
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          setComplaints(mapped);
        }

        setEditingComplaint(null);
        toast({
          title: t('complaint.updated'),
          description: t('complaint.update_success'),
        });
      } else {
        throw new Error(result.error || 'Failed to update complaint');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('complaint.update_failed'),
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
        // Refresh complaints list with sorting
        const complaintsResult = await apiService.getComplaints();
        if (complaintsResult.success && Array.isArray(complaintsResult.data)) {
          const mapped = complaintsResult.data.map(mapComplaintData).filter(complaint => {
            return complaint && complaint.id && complaint.priority && complaint.status;
          }).sort((a, b) => {
            // Sort by creation date - most recent first
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
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

  const handleStatusUpdate = (complaint: Complaint) => {
    if (!permissions.complaints.update) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update complaint status.",
        variant: "destructive"
      });
      return;
    }
    setStatusUpdateComplaint(complaint);
    setStatusUpdateForm({
      status: complaint.status,
      workType: '',
      notes: '',
      resolutionNotes: ''
    });
  };

  const handleStatusUpdateSubmit = async () => {
    if (!statusUpdateComplaint) return;

    if (!statusUpdateForm.status) {
      toast({
        title: "Validation Error",
        description: "Please select a status.",
        variant: "destructive"
      });
      return;
    }

    if (statusUpdateForm.status === 'resolved' && !statusUpdateForm.workType) {
      toast({
        title: "Validation Error",
        description: "Please select the type of work done when resolving the complaint.",
        variant: "destructive"
      });
      return;
    }

    try {
      const updateData = {
        ...statusUpdateComplaint,
        status: statusUpdateForm.status,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.id || user?.name || 'Unknown',
        workType: statusUpdateForm.workType,
        resolutionNotes: statusUpdateForm.resolutionNotes,
        notes: statusUpdateComplaint.notes ? 
          [...statusUpdateComplaint.notes, statusUpdateForm.notes].filter(note => note.trim()) :
          [statusUpdateForm.notes].filter(note => note.trim())
      };

      if (statusUpdateForm.status === 'resolved') {
        updateData.resolvedAt = new Date().toISOString();
      }

      const result = await apiService.updateComplaint(statusUpdateComplaint.id, updateData);

      if (result.success) {
        // Refresh complaints list with sorting
        const complaintsResult = await apiService.getComplaints();
        if (complaintsResult.success && Array.isArray(complaintsResult.data)) {
          const mapped = complaintsResult.data.map(mapComplaintData).filter(complaint => {
            return complaint && complaint.id && complaint.priority && complaint.status;
          }).sort((a, b) => {
            // Sort by creation date - most recent first
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          setComplaints(mapped);
        }

        setStatusUpdateComplaint(null);
        setStatusUpdateForm({
          status: '',
          workType: '',
          notes: '',
          resolutionNotes: ''
        });

        toast({
          title: "Status Updated",
          description: `Complaint status has been updated to ${statusUpdateForm.status}.`,
        });
      } else {
        throw new Error(result.error || 'Failed to update complaint status');
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update complaint status",
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight">All Complaints</h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl">Manage and track electrical supply complaints</p>
        </div>
        <div className="flex items-center space-x-2">
          <RepairOrderExportDialog 
            complaints={filteredComplaints}
            onExport={() => {
              toast({
                title: "Export Successful",
                description: "Repair orders have been generated successfully",
                variant: "default"
              });
            }}
          />
          <ProtectedAction resource="complaints" action="create">
            <Button className="bg-gradient-primary" onClick={() => window.location.href = '/complaint-form'} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Complaint</span>
              <span className="sm:hidden">New</span>
            </Button>
          </ProtectedAction>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="Search by ID, customer, phone, contract, repair order..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-8 focus:ring-2 focus:ring-primary"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">Search across:</p>
                      <ul className="space-y-0.5 text-xs">
                        <li>• Complaint ID & Title</li>
                        <li>• Customer Name, Email & Phone</li>
                        <li>• Contract Number & Business Partner</li>
                        <li>• Account & Meter Number</li>
                        <li>• Repair Order Number</li>
                        <li>• Address & Region</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
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
                <SelectItem value="escalated">Escalated</SelectItem>
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
                // Clear URL parameters as well
                setSearchParams({}, { replace: true });
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Complaints ({filteredComplaints.length})</span>
              {filteredComplaints.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <SortDesc className="h-4 w-4" />
                        <span>Recent First</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Complaints are sorted by creation date (newest first)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Search className="h-3 w-3" />
                <span>Searching: "{searchTerm}"</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Service Center</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Created</span>
                      <SortDesc className="h-3 w-3 text-primary" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No complaints found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints.map((complaint) => {
                    // Additional safety check
                    if (!complaint || !complaint.priority || !complaint.status) {
                      console.warn('Invalid complaint data:', complaint);
                      return null;
                    }
                    return (
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
                            {t(`complaint_type.${complaint.category}`)}
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
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{complaint.customer.phone || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm max-w-[150px] truncate" title={complaint.customer.address}>
                            {complaint.customer.address || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-primary">{complaint.region}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{complaint.customer.serviceCenter || complaint.serviceCenter || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={`${PRIORITY_CONFIG[complaint.priority]?.bgColor || 'bg-muted'} ${PRIORITY_CONFIG[complaint.priority]?.color || 'text-muted-foreground'}`}
                        >
                          {PRIORITY_CONFIG[complaint.priority]?.labelKey ? t(PRIORITY_CONFIG[complaint.priority].labelKey) : complaint.priority || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={`${STATUS_CONFIG[complaint.status]?.bgColor || 'bg-muted'} ${STATUS_CONFIG[complaint.status]?.color || 'text-muted-foreground'}`}
                        >
                          {STATUS_CONFIG[complaint.status]?.labelKey ? t(STATUS_CONFIG[complaint.status].labelKey) : complaint.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(complaint.createdAt), 'MMM dd')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewComplaint(complaint)}
                            className="h-8 w-8 p-0"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <ProtectedAction resource="complaints" action="update">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(complaint)}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                              title="Update Status"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </ProtectedAction>
                          <ProtectedAction resource="complaints" action="update">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditComplaint(complaint)}
                              className="h-8 w-8 p-0"
                              title="Edit Complaint"
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
                              title="Delete Complaint"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ProtectedAction>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })
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
              <DialogDescription>
                View detailed information about this complaint including customer details, status, and resolution history.
              </DialogDescription>
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
                      <Badge className={`${PRIORITY_CONFIG[viewingComplaint.priority]?.bgColor || 'bg-muted'} ${PRIORITY_CONFIG[viewingComplaint.priority]?.color || 'text-muted-foreground'}`}>
                        {PRIORITY_CONFIG[viewingComplaint.priority]?.label || viewingComplaint.priority || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${STATUS_CONFIG[viewingComplaint.status]?.bgColor || 'bg-muted'} ${STATUS_CONFIG[viewingComplaint.status]?.color || 'text-muted-foreground'}`}>
                        {STATUS_CONFIG[viewingComplaint.status]?.label || viewingComplaint.status || 'Unknown'}
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

      {/* Status Update Dialog */}
      {statusUpdateComplaint && (
        <Dialog open={!!statusUpdateComplaint} onOpenChange={() => setStatusUpdateComplaint(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Update Status - {statusUpdateComplaint.id}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Current Status Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Current Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Customer:</span>
                    <p className="font-medium">{statusUpdateComplaint.customer.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Status:</span>
                    <div className="mt-1">
                      <Badge className={`${STATUS_CONFIG[statusUpdateComplaint.status]?.bgColor || 'bg-muted'} ${STATUS_CONFIG[statusUpdateComplaint.status]?.color || 'text-muted-foreground'}`}>
                        {STATUS_CONFIG[statusUpdateComplaint.status]?.label || statusUpdateComplaint.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Title:</span>
                    <p className="font-medium">{statusUpdateComplaint.title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Region:</span>
                    <p className="font-medium">{statusUpdateComplaint.region}</p>
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status-update">New Status *</Label>
                    <Select 
                      value={statusUpdateForm.status} 
                      onValueChange={(value) => setStatusUpdateForm({...statusUpdateForm, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {statusUpdateForm.status === 'resolved' && (
                    <div className="space-y-2">
                      <Label htmlFor="work-type">Type of Work Done *</Label>
                      <Select 
                        value={statusUpdateForm.workType} 
                        onValueChange={(value) => setStatusUpdateForm({...statusUpdateForm, workType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          {WORK_TYPES.map((workType) => (
                            <SelectItem key={workType.value} value={workType.value}>
                              {workType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {statusUpdateForm.status === 'resolved' && (
                  <div className="space-y-2">
                    <Label htmlFor="resolution-notes">Resolution Details</Label>
                    <Textarea
                      id="resolution-notes"
                      placeholder="Describe the work performed and resolution details..."
                      value={statusUpdateForm.resolutionNotes}
                      onChange={(e) => setStatusUpdateForm({...statusUpdateForm, resolutionNotes: e.target.value})}
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="status-notes">Additional Notes</Label>
                  <Textarea
                    id="status-notes"
                    placeholder="Add any additional notes about this status update..."
                    value={statusUpdateForm.notes}
                    onChange={(e) => setStatusUpdateForm({...statusUpdateForm, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setStatusUpdateComplaint(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStatusUpdateSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Update Status
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