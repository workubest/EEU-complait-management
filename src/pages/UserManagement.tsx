import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Key,
  UserCheck,
  UserX,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Activity,
  Settings,
  Lock,
  Unlock,
  UserPlus,
  FileText,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ETHIOPIAN_REGIONS, SERVICE_CENTERS, UserRole } from '@/types/user';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  region: string;
  serviceCenter?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  permissions?: {
    [key: string]: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
  metadata?: {
    loginCount: number;
    lastIpAddress?: string;
    twoFactorEnabled: boolean;
    passwordLastChanged?: string;
    accountLocked: boolean;
    failedLoginAttempts: number;
  };
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export function UserManagement() {
  const { user: currentUser, role, permissions } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'technician' as UserRole,
    region: '',
    serviceCenter: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, regionFilter, statusFilter, showInactiveUsers]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await apiService.getUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        console.error('Failed to fetch users:', result.error);
        setUsers([]);
        toast({
          title: "Error",
          description: result.error || "Failed to fetch users.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(user => user.region === regionFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.isActive);
      } else if (statusFilter === 'locked') {
        filtered = filtered.filter(user => user.metadata?.accountLocked);
      }
    }

    // Show/hide inactive users
    if (!showInactiveUsers) {
      filtered = filtered.filter(user => user.isActive);
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = async () => {
    if (!permissions.users.create) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create users.",
        variant: "destructive"
      });
      return;
    }

    // Validation
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (!newUser.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await apiService.createUser({
        ...newUser,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          loginCount: 0,
          twoFactorEnabled: false,
          accountLocked: false,
          failedLoginAttempts: 0
        }
      });

      if (result.success) {
        toast({
          title: "User Created",
          description: `User ${newUser.name} has been created successfully.`,
        });
        
        setIsCreateDialogOpen(false);
        setNewUser({
          name: '',
          email: '',
          phone: '',
          role: 'technician',
          region: '',
          serviceCenter: '',
          password: '',
          confirmPassword: ''
        });
        
        fetchUsers();
      } else {
        throw new Error(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    if (!permissions.users.update) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update users.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await apiService.updateUser(userId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      if (result.success) {
        toast({
          title: "User Updated",
          description: "User has been updated successfully.",
        });
        
        fetchUsers();
        setIsEditDialogOpen(false);
        setSelectedUser(null);
      } else {
        throw new Error(result.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!permissions.users.delete) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete users.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await apiService.deleteUser(userId);

      if (result.success) {
        toast({
          title: "User Deleted",
          description: "User has been deleted successfully.",
        });
        
        fetchUsers();
      } else {
        throw new Error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    await handleUpdateUser(userId, { isActive });
  };

  const handleResetPassword = async (userId: string) => {
    if (!permissions.users.update) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to reset passwords.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Are you sure you want to reset this user\'s password? They will need to set a new password on their next login.')) {
      return;
    }

    try {
      const result = await apiService.resetUserPassword(userId);

      if (result.success) {
        toast({
          title: "Password Reset",
          description: "Password has been reset successfully. The user will be notified via email.",
        });
      } else {
        throw new Error(result.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive"
      });
    }
  };

  const handleUnlockAccount = async (userId: string) => {
    await handleUpdateUser(userId, { 
      metadata: { 
        ...users.find(u => u.id === userId)?.metadata,
        accountLocked: false,
        failedLoginAttempts: 0
      } 
    });
  };

  const exportUsers = async () => {
    try {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Role', 'Region', 'Service Center', 'Status', 'Last Login', 'Created At'].join(','),
        ...filteredUsers.map(user => [
          user.name,
          user.email,
          user.phone || '',
          user.role,
          user.region,
          user.serviceCenter || '',
          user.isActive ? 'Active' : 'Inactive',
          user.lastLogin ? format(new Date(user.lastLogin), 'yyyy-MM-dd HH:mm') : 'Never',
          format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Users have been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export users.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      admin: 'bg-destructive/10 text-destructive',
      manager: 'bg-warning/10 text-warning',
      foreman: 'bg-primary/10 text-primary',
      'call-attendant': 'bg-success/10 text-success',
      technician: 'bg-muted text-muted-foreground'
    };
    return colors[role];
  };

  const getRoleTitle = (role: UserRole) => {
    const titles = {
      admin: 'Administrator',
      manager: 'Manager',
      foreman: 'Foreman',
      'call-attendant': 'Call Attendant',
      technician: 'Technician'
    };
    return titles[role];
  };

  if (!permissions.users.read) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to view user management</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight">User Management</h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl">
            Manage system users, roles, and permissions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportUsers} size="sm">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" onClick={fetchUsers} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          {permissions.users.create && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add User</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@eeu.gov.et"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+251-911-123-456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="foreman">Foreman</SelectItem>
                          <SelectItem value="call-attendant">Call Attendant</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="region">Region *</Label>
                      <Select 
                        value={newUser.region} 
                        onValueChange={(value) => setNewUser(prev => ({ ...prev, region: value, serviceCenter: '' }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {ETHIOPIAN_REGIONS.map(region => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceCenter">Service Center *</Label>
                    <Select 
                      value={newUser.serviceCenter} 
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, serviceCenter: value }))}
                      disabled={!newUser.region}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newUser.region ? "Select service center" : "Select region first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {newUser.region && SERVICE_CENTERS[newUser.region as keyof typeof SERVICE_CENTERS]?.map(center => (
                          <SelectItem key={center} value={center}>{center}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm password"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateUser}>
                      Create User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="roleFilter">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="foreman">Foreman</SelectItem>
                  <SelectItem value="call-attendant">Call Attendant</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="regionFilter">Region</Label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {ETHIOPIAN_REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showInactive"
                  checked={showInactiveUsers}
                  onCheckedChange={setShowInactiveUsers}
                />
                <Label htmlFor="showInactive" className="text-sm">
                  Show Inactive
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Users ({filteredUsers.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>{users.filter(u => u.isActive).length} active</span>
              <span>•</span>
              <span>{users.filter(u => !u.isActive).length} inactive</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                  <div className="w-20 h-6 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || roleFilter !== 'all' || regionFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'No users have been created yet.'}
              </p>
              {permissions.users.create && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add First User
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <Badge className={getRoleBadgeColor(user.role)} variant="secondary">
                          {getRoleTitle(user.role)}
                        </Badge>
                        {!user.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                        {user.metadata?.accountLocked && (
                          <Badge variant="destructive">
                            <Lock className="mr-1 h-3 w-3" />
                            Locked
                          </Badge>
                        )}
                        {user.metadata?.twoFactorEnabled && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Shield className="mr-1 h-3 w-3" />
                            2FA
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{user.region}</span>
                        </div>
                        {user.serviceCenter && (
                          <div className="flex items-center space-x-1">
                            <Settings className="h-3 w-3" />
                            <span>{user.serviceCenter}</span>
                          </div>
                        )}
                        {user.lastLogin && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Last login: {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {permissions.users.update && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {permissions.users.update && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                    )}
                    
                    {permissions.users.update && user.metadata?.accountLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnlockAccount(user.id)}
                      >
                        <Unlock className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {permissions.users.update && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {permissions.users.delete && user.id !== currentUser?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getRoleBadgeColor(selectedUser.role)} variant="secondary">
                      {getRoleTitle(selectedUser.role)}
                    </Badge>
                    {selectedUser.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-sm">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Region</Label>
                  <p className="text-sm">{selectedUser.region}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Service Center</Label>
                  <p className="text-sm">{selectedUser.serviceCenter || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm">{format(new Date(selectedUser.createdAt), 'PPP')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                  <p className="text-sm">
                    {selectedUser.lastLogin 
                      ? format(new Date(selectedUser.lastLogin), 'PPP p')
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
              
              {selectedUser.metadata && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Security Information</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Authentication</span>
                      {selectedUser.metadata.twoFactorEnabled ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">Enabled</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700">Disabled</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Account Status</span>
                      {selectedUser.metadata.accountLocked ? (
                        <Badge variant="destructive">Locked</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700">Unlocked</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Login Count</span>
                      <span className="text-sm font-medium">{selectedUser.metadata.loginCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Failed Attempts</span>
                      <span className="text-sm font-medium">{selectedUser.metadata.failedLoginAttempts}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}