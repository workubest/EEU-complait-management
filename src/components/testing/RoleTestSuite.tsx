import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Home,
  FileText
} from 'lucide-react';

interface TestResult {
  page: string;
  role: UserRole;
  canAccess: boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  notes: string[];
}

export function RoleTestSuite() {
  const { role, switchRole, permissions } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const pages = [
    { key: 'dashboard', name: 'Dashboard', icon: Home, resource: null },
    { key: 'complaints', name: 'Complaints List', icon: MessageSquare, resource: 'complaints' },
    { key: 'users', name: 'User Management', icon: Users, resource: 'users' },
    { key: 'analytics', name: 'Analytics', icon: BarChart3, resource: 'reports' },
    { key: 'settings', name: 'Settings', icon: Settings, resource: 'settings' },
    { key: 'complaint-form', name: 'Complaint Form', icon: FileText, resource: 'complaints' }
  ];

  const roles: UserRole[] = ['admin', 'manager', 'foreman', 'call-attendant', 'technician'];

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    for (const testRole of roles) {
      // Switch to test role
      switchRole(testRole);
      
      // Wait for role switch to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      for (const page of pages) {
        const result: TestResult = {
          page: page.name,
          role: testRole,
          canAccess: true,
          canCreate: false,
          canRead: false,
          canUpdate: false,
          canDelete: false,
          notes: []
        };

        if (page.resource) {
          const resourcePermissions = permissions[page.resource as keyof typeof permissions];
          
          if (resourcePermissions) {
            result.canRead = resourcePermissions.read || false;
            result.canCreate = resourcePermissions.create || false;
            result.canUpdate = resourcePermissions.update || false;
            result.canDelete = resourcePermissions.delete || false;
            result.canAccess = result.canRead;
          } else {
            result.canAccess = false;
            result.notes.push('No permissions defined for this resource');
          }
        } else {
          // Dashboard is accessible to all authenticated users
          result.canAccess = true;
          result.canRead = true;
          result.notes.push('Dashboard accessible to all users');
        }

        // Add role-specific notes
        switch (testRole) {
          case 'admin':
            if (page.key === 'settings' && !result.canUpdate) {
              result.notes.push('Admin should have settings update access');
            }
            break;
          case 'technician':
            if (page.key === 'users' && result.canAccess) {
              result.notes.push('Technician should not access user management');
            }
            break;
          case 'call-attendant':
            if (page.key === 'complaints' && !result.canCreate) {
              result.notes.push('Call attendant should create complaints');
            }
            break;
        }

        results.push(result);
      }
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getRoleColor = (userRole: UserRole) => {
    const colors = {
      admin: 'bg-destructive/10 text-destructive',
      manager: 'bg-warning/10 text-warning',
      foreman: 'bg-primary/10 text-primary',
      'call-attendant': 'bg-success/10 text-success',
      technician: 'bg-muted text-muted-foreground'
    };
    return colors[userRole];
  };

  const getStatusIcon = (canAccess: boolean, hasAnyPermission: boolean) => {
    if (!canAccess) return <XCircle className="h-4 w-4 text-destructive" />;
    if (hasAnyPermission) return <CheckCircle className="h-4 w-4 text-success" />;
    return <AlertCircle className="h-4 w-4 text-warning" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Role-Based Access Control Test Suite</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              Test all pages and CRUD operations for each user role
            </p>
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Test Results</h3>
              
              {roles.map(testRole => (
                <div key={testRole} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={getRoleColor(testRole)}>
                      {testRole.charAt(0).toUpperCase() + testRole.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {testResults
                      .filter(result => result.role === testRole)
                      .map((result, index) => {
                        const hasAnyPermission = result.canCreate || result.canRead || result.canUpdate || result.canDelete;
                        
                        return (
                          <div key={index} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{result.page}</span>
                              {getStatusIcon(result.canAccess, hasAnyPermission)}
                            </div>
                            
                            <div className="grid grid-cols-4 gap-1 mb-2">
                              <div className={`text-xs p-1 rounded text-center ${result.canCreate ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                                C
                              </div>
                              <div className={`text-xs p-1 rounded text-center ${result.canRead ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                R
                              </div>
                              <div className={`text-xs p-1 rounded text-center ${result.canUpdate ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}`}>
                                U
                              </div>
                              <div className={`text-xs p-1 rounded text-center ${result.canDelete ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                                D
                              </div>
                            </div>
                            
                            {result.notes.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {result.notes.map((note, noteIndex) => (
                                  <div key={noteIndex}>• {note}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}