import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  RefreshCw,
  X,
  SlidersHorizontal,
  Eye,
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Save,
  Share2,
  Bookmark,
  BookmarkCheck,
  Star,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Loader2,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { Complaint, STATUS_CONFIG, PRIORITY_CONFIG, COMPLAINT_CATEGORIES } from '@/types/complaint';
import { ETHIOPIAN_REGIONS } from '@/types/user';
import { useNavigate } from 'react-router-dom';

interface SearchFilters {
  query: string;
  category: string;
  priority: string;
  status: string;
  region: string;
  assignedTo: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  customerName: string;
  complaintId: string;
  tags: string[];
  hasAttachments: boolean;
  isOverdue: boolean;
  customerRating: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  isDefault: boolean;
}

export function ComplaintsSearch() {
  const { user, role, canAccessRegion, permissions } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'status' | 'region'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    region: 'all',
    assignedTo: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    customerName: '',
    complaintId: '',
    tags: [],
    hasAttachments: false,
    isOverdue: false,
    customerRating: 'all'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      setFilters(prev => ({ ...prev, query: queryParam }));
      performSearch({ ...filters, query: queryParam });
    }
    
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      const result = await apiService.getSavedSearches?.();
      if (result?.success && result.data) {
        setSavedSearches(result.data);
      } else {
        // Mock saved searches
        setSavedSearches([
          {
            id: '1',
            name: 'High Priority Open',
            filters: { ...filters, priority: 'high', status: 'open' },
            createdAt: new Date().toISOString(),
            isDefault: false
          },
          {
            id: '2',
            name: 'My Region Critical',
            filters: { ...filters, priority: 'critical', region: user?.region || 'all' },
            createdAt: new Date().toISOString(),
            isDefault: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  const performSearch = async (searchFilters = filters, page = currentPage) => {
    setLoading(true);
    try {
      const result = await apiService.searchComplaints({
        query: searchFilters.query,
        category: searchFilters.category !== 'all' ? searchFilters.category : undefined,
        priority: searchFilters.priority !== 'all' ? searchFilters.priority : undefined,
        status: searchFilters.status !== 'all' ? searchFilters.status : undefined,
        region: searchFilters.region !== 'all' ? searchFilters.region : undefined,
        assignedTo: searchFilters.assignedTo !== 'all' ? searchFilters.assignedTo : undefined,
        dateFrom: searchFilters.dateFrom?.toISOString(),
        dateTo: searchFilters.dateTo?.toISOString(),
        customerName: searchFilters.customerName || undefined,
        complaintId: searchFilters.complaintId || undefined,
        tags: searchFilters.tags.length > 0 ? searchFilters.tags : undefined,
        hasAttachments: searchFilters.hasAttachments || undefined,
        isOverdue: searchFilters.isOverdue || undefined,
        customerRating: searchFilters.customerRating !== 'all' ? searchFilters.customerRating : undefined,
        page,
        limit: resultsPerPage,
        sortBy,
        sortOrder
      });

      if (result.success && result.data) {
        setComplaints(result.data.complaints || []);
        setTotalResults(result.data.total || 0);
      } else {
        console.error('Failed to search complaints:', result.error);
        setComplaints([]);
        setTotalResults(0);
        toast({
          title: "Search Failed",
          description: result.error || "Failed to search complaints.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error searching complaints:', error);
      setComplaints([]);
      setTotalResults(0);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      priority: 'all',
      status: 'all',
      region: 'all',
      assignedTo: 'all',
      dateFrom: undefined,
      dateTo: undefined,
      customerName: '',
      complaintId: '',
      tags: [],
      hasAttachments: false,
      isOverdue: false,
      customerRating: 'all'
    });
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch(filters, 1);
  };

  const saveSearch = async () => {
    if (!saveSearchName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for the saved search.",
        variant: "destructive"
      });
      return;
    }

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      isDefault: false
    };

    setSavedSearches(prev => [...prev, newSearch]);
    setSaveSearchName('');
    setShowSaveDialog(false);
    
    toast({
      title: "Search Saved",
      description: `Search "${saveSearchName}" has been saved successfully.`,
    });
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    performSearch(search.filters, 1);
    setCurrentPage(1);
    
    toast({
      title: "Search Loaded",
      description: `Loaded saved search "${search.name}".`,
    });
  };

  const exportResults = async () => {
    try {
      const csvContent = [
        ['ID', 'Title', 'Category', 'Priority', 'Status', 'Customer', 'Region', 'Created', 'Assigned To'].join(','),
        ...complaints.map(complaint => [
          complaint.id,
          complaint.title,
          complaint.category,
          complaint.priority,
          complaint.status,
          complaint.customerName,
          complaint.region,
          format(new Date(complaint.createdAt), 'yyyy-MM-dd HH:mm'),
          complaint.assignedTo || 'Unassigned'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `search-results-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Search results have been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export search results.",
        variant: "destructive"
      });
    }
  };

  const handleComplaintSelect = (complaintId: string, selected: boolean) => {
    if (selected) {
      setSelectedComplaints(prev => [...prev, complaintId]);
    } else {
      setSelectedComplaints(prev => prev.filter(id => id !== complaintId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedComplaints(complaints.map(c => c.id));
    } else {
      setSelectedComplaints([]);
    }
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selectedComplaints.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select complaints to update.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await apiService.bulkUpdateComplaints?.(selectedComplaints, { status: newStatus });
      if (result?.success) {
        toast({
          title: "Bulk Update Complete",
          description: `Updated ${selectedComplaints.length} complaints to ${newStatus}.`,
        });
        setSelectedComplaints([]);
        performSearch();
      }
    } catch (error) {
      toast({
        title: "Bulk Update Failed",
        description: "Failed to update selected complaints.",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      pending: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight">Search Complaints</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
            Find and filter complaints with advanced search capabilities
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportResults} disabled={complaints.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
            {viewMode === 'list' ? <Grid className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
            {viewMode === 'list' ? 'Grid View' : 'List View'}
          </Button>
        </div>
      </div>

      {/* Search Form */}
      <Card className="border-border animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Main Search */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Search complaints by title, description, or ID..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="text-base"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {COMPLAINT_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {ETHIOPIAN_REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      placeholder="Search by customer name"
                      value={filters.customerName}
                      onChange={(e) => handleFilterChange('customerName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="complaintId">Complaint ID</Label>
                    <Input
                      id="complaintId"
                      placeholder="e.g., CMP-2024-001"
                      value={filters.complaintId}
                      onChange={(e) => handleFilterChange('complaintId', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assignees</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="Ahmed Hassan">Ahmed Hassan</SelectItem>
                        <SelectItem value="Daniel Worku">Daniel Worku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateFrom}
                          onSelect={(date) => handleFilterChange('dateFrom', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Date To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateTo}
                          onSelect={(date) => handleFilterChange('dateTo', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasAttachments"
                      checked={filters.hasAttachments}
                      onCheckedChange={(checked) => handleFilterChange('hasAttachments', checked)}
                    />
                    <Label htmlFor="hasAttachments">Has Attachments</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isOverdue"
                      checked={filters.isOverdue}
                      onCheckedChange={(checked) => handleFilterChange('isOverdue', checked)}
                    />
                    <Label htmlFor="isOverdue">Overdue</Label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      <Save className="mr-2 h-4 w-4" />
                      Save Search
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Search</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="searchName">Search Name</Label>
                        <Input
                          id="searchName"
                          placeholder="Enter a name for this search"
                          value={saveSearchName}
                          onChange={(e) => setSaveSearchName(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveSearch}>
                          Save Search
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {savedSearches.length > 0 && (
                <Select onValueChange={(value) => {
                  const search = savedSearches.find(s => s.id === value);
                  if (search) loadSavedSearch(search);
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Load saved search" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedSearches.map(search => (
                      <SelectItem key={search.id} value={search.id}>
                        <div className="flex items-center space-x-2">
                          <span>{search.name}</span>
                          {search.isDefault && <Star className="h-3 w-3 text-yellow-500" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Search Results ({totalResults})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {selectedComplaints.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-muted-foreground">
                {selectedComplaints.length} selected
              </span>
              <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus('in-progress')}>
                Mark In Progress
              </Button>
              <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus('resolved')}>
                Mark Resolved
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Searching complaints...</span>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No complaints found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find more results.
              </p>
              <Button onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  checked={selectedComplaints.length === complaints.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-sm">Select All</Label>
              </div>

              {/* Results List */}
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {complaints.map((complaint, index) => (
                    <div 
                      key={complaint.id}
                      className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Checkbox
                        checked={selectedComplaints.includes(complaint.id)}
                        onCheckedChange={(checked) => handleComplaintSelect(complaint.id, checked as boolean)}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer"
                                onClick={() => navigate(`/complaints/${complaint.id}`)}>
                              {complaint.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {complaint.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge className={getPriorityColor(complaint.priority)} variant="secondary">
                              {complaint.priority}
                            </Badge>
                            <Badge className={getStatusColor(complaint.status)} variant="secondary">
                              {complaint.status}
                            </Badge>
                            {isComplaintOverdue(complaint) && (
                              <Badge variant="destructive">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{complaint.id}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{complaint.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{complaint.region}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</span>
                          </div>
                          {complaint.assignedTo && (
                            <div className="flex items-center space-x-1">
                              <Target className="h-3 w-3" />
                              <span>Assigned to {complaint.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/complaints/${complaint.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {permissions.complaints.update && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/complaints/${complaint.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complaints.map((complaint, index) => (
                    <Card 
                      key={complaint.id}
                      className="border-border hover:shadow-elevated transition-all duration-300 cursor-pointer animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedComplaints.includes(complaint.id)}
                              onCheckedChange={(checked) => handleComplaintSelect(complaint.id, checked as boolean)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Badge className={getPriorityColor(complaint.priority)} variant="secondary">
                              {complaint.priority}
                            </Badge>
                          </div>
                          <Badge className={getStatusColor(complaint.status)} variant="secondary">
                            {complaint.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{complaint.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {complaint.description}
                        </p>
                        
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>ID:</span>
                            <span className="font-mono">{complaint.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Customer:</span>
                            <span>{complaint.customerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Region:</span>
                            <span>{complaint.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span>{formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * resultsPerPage) + 1} to {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults} results
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage(1);
                        performSearch(filters, 1);
                      }}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPage = currentPage - 1;
                        setCurrentPage(newPage);
                        performSearch(filters, newPage);
                      }}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        performSearch(filters, newPage);
                      }}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage(totalPages);
                        performSearch(filters, totalPages);
                      }}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}