import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Shield, 
  Phone,
  Mail,
  MapPin,
  UserCheck,
  UserX
} from 'lucide-react';
import { User, UserRole, ETHIOPIAN_REGIONS } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { apiService } from '@/lib/api';
import { ProtectedAction } from '@/components/auth/ProtectedRoute';

export function UserManagement() {
  const { permissions, role: currentUserRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Load users on component mount
  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await apiService.getUsers();
        if (result && result.success && Array.isArray(result.data)) {
          const mapped = result.data.map((item: any) => ({
            id: item.ID || item.id || '',
            name: item.Name || item.name || '',
            email: item.Email || item.email || '',
            phone: item.Phone || item.phone || '',
            role: item.Role || item.role || 'technician',
            region: item.Region || item.region || '',
            department: item.Department || item.department || '',
            isActive: item['Is Active'] || item.isActive || true,
            createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
            updatedAt: item['Updated At'] || item.updatedAt || new Date().toISOString(),
          }));
          setUsers(mapped);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'technician' as UserRole,
    region: '',
    department: '',
    phone: ''
  });

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check for duplicate email
  const isDuplicateEmail = (email: string, excludeId?: string): boolean => {
    return users.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.id !== excludeId
    );
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async () => {
    if (!permissions.users.create) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create users.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced validation
    if (!newUser.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!newUser.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidEmail(newUser.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (isDuplicateEmail(newUser.email)) {
      toast({
        title: "Validation Error",
        description: "A user with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    if (!newUser.region) {
      toast({
        title: "Validation Error",
        description: "Region is required.",
        variant: "destructive"
      });
      return;
    }

    if (!newUser.department.trim()) {
      toast({
        title: "Validation Error",
        description: "Department is required.",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      const result = await apiService.createUser({
        ...newUser,
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        department: newUser.department.trim(),
        phone: newUser.phone.trim(),
        isActive: true
      });

      if (result.success) {
        // Refresh users list to get the latest data
        const usersResult = await apiService.getUsers();
        if (usersResult && usersResult.success && Array.isArray(usersResult.data)) {
          const mapped = usersResult.data.map((item: any) => ({
            id: item.ID || item.id || '',
            name: item.Name || item.name || '',
            email: item.Email || item.email || '',
            phone: item.Phone || item.phone || '',
            role: item.Role || item.role || 'technician',
            region: item.Region || item.region || '',
            department: item.Department || item.department || '',
            isActive: item['Is Active'] || item.isActive || true,
            createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
            updatedAt: item['Updated At'] || item.updatedAt || new Date().toISOString(),
          }));
          setUsers(mapped);
        }

        setNewUser({
          name: '',
          email: '',
          role: 'technician',
          region: '',
          department: '',
          phone: ''
        });
        setIsAddUserOpen(false);

        toast({
          title: "User Created",
          description: "New user has been successfully created.",
        });
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
    } finally {
      setCreating(false);
    }
  };

  const handleEditUser = (user: User) => {
    if (!permissions.users.update) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit users.",
        variant: "destructive"
      });
      return;
    }
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !permissions.users.update) {
      return;
    }

    // Enhanced validation for update
    if (!editingUser.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!editingUser.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidEmail(editingUser.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (isDuplicateEmail(editingUser.email, editingUser.id)) {
      toast({
        title: "Validation Error",
        description: "A user with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    if (!editingUser.region) {
      toast({
        title: "Validation Error",
        description: "Region is required.",
        variant: "destructive"
      });
      return;
    }

    if (!editingUser.department.trim()) {
      toast({
        title: "Validation Error",
        description: "Department is required.",
        variant: "destructive"
      });
      return;
    }

    setUpdating(true);
    try {
      const result = await apiService.updateUser({
        id: editingUser.id,
        name: editingUser.name.trim(),
        email: editingUser.email.trim().toLowerCase(),
        phone: editingUser.phone.trim(),
        role: editingUser.role,
        region: editingUser.region,
        department: editingUser.department.trim(),
        isActive: editingUser.isActive
      });

      if (result.success) {
        // Refresh users list to get the latest data
        const usersResult = await apiService.getUsers();
        if (usersResult && usersResult.success && Array.isArray(usersResult.data)) {
          const mapped = usersResult.data.map((item: any) => ({
            id: item.ID || item.id || '',
            name: item.Name || item.name || '',
            email: item.Email || item.email || '',
            phone: item.Phone || item.phone || '',
            role: item.Role || item.role || 'technician',
            region: item.Region || item.region || '',
            department: item.Department || item.department || '',
            isActive: item['Is Active'] || item.isActive || true,
            createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
            updatedAt: item['Updated At'] || item.updatedAt || new Date().toISOString(),
          }));
          setUsers(mapped);
        }

        setEditingUser(null);

        toast({
          title: "User Updated",
          description: "User information has been successfully updated.",
        });
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
    } finally {
      setUpdating(false);
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

    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(userId);
    try {
      const result = await apiService.deleteUser(userId);

      if (result.success) {
        // Refresh users list to get the latest data
        const usersResult = await apiService.getUsers();
        if (usersResult && usersResult.success && Array.isArray(usersResult.data)) {
          const mapped = usersResult.data.map((item: any) => ({
            id: item.ID || item.id || '',
            name: item.Name || item.name || '',
            email: item.Email || item.email || '',
            phone: item.Phone || item.phone || '',
            role: item.Role || item.role || 'technician',
            region: item.Region || item.region || '',
            department: item.Department || item.department || '',
            isActive: item['Is Active'] || item.isActive || true,
            createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
            updatedAt: item['Updated At'] || item.updatedAt || new Date().toISOString(),
          }));
          setUsers(mapped);
        }

        toast({
          title: "User Deleted",
          description: `${userToDelete.name} has been successfully deleted.`,
        });
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
    } finally {
      setDeleting(null);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!permissions.users.update) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to modify user status.",
        variant: "destructive"
      });
      return;
    }

    const userToUpdate = users.find(user => user.id === userId);
    if (!userToUpdate) {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await apiService.updateUser({
        id: userId,
        isActive: !currentStatus
      });

      if (result.success) {
        // Refresh users list to get the latest data
        const usersResult = await apiService.getUsers();
        if (usersResult && usersResult.success && Array.isArray(usersResult.data)) {
          const mapped = usersResult.data.map((item: any) => ({
            id: item.ID || item.id || '',
            name: item.Name || item.name || '',
            email: item.Email || item.email || '',
            phone: item.Phone || item.phone || '',
            role: item.Role || item.role || 'technician',
            region: item.Region || item.region || '',
            department: item.Department || item.department || '',
            isActive: item['Is Active'] || item.isActive || true,
            createdAt: item['Created At'] || item.createdAt || new Date().toISOString(),
            updatedAt: item['Updated At'] || item.updatedAt || new Date().toISOString(),
          }));
          setUsers(mapped);
        }

        toast({
          title: "Status Updated",
          description: `${userToUpdate.name} has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
        });
      } else {
        throw new Error(result.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: UserRole) => {
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

  // Check if user has read permission
  if (!permissions.users.read) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">You don't have permission to view user management</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight">User Management</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">Manage system users and their permissions</p>
        </div>
        <ProtectedAction resource="users" action="create">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="call-attendant">Call Attendant</SelectItem>
                      <SelectItem value="foreman">Foreman</SelectItem>
                      {(currentUserRole === 'admin') && (
                        <>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select value={newUser.region} onValueChange={(value) => setNewUser(prev => ({ ...prev, region: value }))}>
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
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={newUser.department}
                    onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddUserOpen(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddUser}
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </ProtectedAction>
      </div>

      {/* Search and Filters */}
      <Card className="border-none shadow-card bg-gradient-to-br from-primary/10 to-primary-glow/10 animate-slide-up hover:shadow-elevated transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Filter by role" />
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

            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleTitle(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {user.region}
                        </div>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <UserX className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ProtectedAction resource="users" action="update">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </ProtectedAction>
                          <ProtectedAction resource="users" action="update">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserStatus(user.id, user.isActive)}
                              className="h-8 w-8 p-0"
                            >
                              {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                          </ProtectedAction>
                          <ProtectedAction resource="users" action="delete">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={deleting === user.id}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className={`h-4 w-4 ${deleting === user.id ? 'animate-spin' : ''}`} />
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

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value: UserRole) => setEditingUser(prev => prev ? { ...prev, role: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="call-attendant">Call Attendant</SelectItem>
                    <SelectItem value="foreman">Foreman</SelectItem>
                    {(currentUserRole === 'admin') && (
                      <>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-region">Region *</Label>
                <Select 
                  value={editingUser.region} 
                  onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, region: value } : null)}
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
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Input
                  id="edit-department"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, department: e.target.value } : null)}
                  placeholder="Enter department"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingUser(null)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateUser}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update User"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default UserManagement;