// API service for Google Apps Script backend integration
import { environment } from '../config/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: any;
  data?: {
    user: any;
    token?: string;
  };
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;
  private isProduction: boolean;
  private isDemoMode: boolean;

  constructor() {
    this.isProduction = environment.isProduction;
    this.baseUrl = environment.apiBaseUrl;
    // Check if demo mode is forced via environment variable
    const forceDemoMode = import.meta.env.VITE_FORCE_DEMO_MODE === 'true';
    this.isDemoMode = forceDemoMode; // Force demo mode if environment variable is set
    
    console.log('🚀 API Service initialized');
    console.log('📡 Backend URL:', this.baseUrl);
    console.log('🔧 Production mode:', this.isProduction);
    console.log('🎭 Demo mode:', this.isDemoMode);
    console.log('🌍 Environment variables:', {
      VITE_FORCE_DEMO_MODE: import.meta.env.VITE_FORCE_DEMO_MODE,
      VITE_FORCE_REAL_BACKEND: import.meta.env.VITE_FORCE_REAL_BACKEND
    });
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // If in demo mode, return mock data immediately
    if (this.isDemoMode) {
      console.log(`Demo mode: Simulating API call to ${endpoint}`);
      return this.getMockResponse<T>(endpoint, options);
    }

    try {
      let url: string;
      let fetchOptions: RequestInit;
      
      if (this.baseUrl.startsWith('/api')) {
        // Development mode: use local proxy server
        url = `${this.baseUrl}${endpoint}`;
        fetchOptions = {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        };
        
        if (options.method === 'POST' && options.body) {
          fetchOptions.body = options.body;
        }
        
        console.log(`Making ${fetchOptions.method} request to local proxy:`, url);
      } else if (this.baseUrl.includes('/.netlify/functions/')) {
        // Production mode: use Netlify Functions proxy
        url = `${this.baseUrl}${endpoint}`;
        fetchOptions = {
          method: 'POST', // Always use POST for Netlify Functions
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        };
        
        // For Netlify Functions, always send data in the body
        if (options.body) {
          fetchOptions.body = options.body;
        } else {
          // Extract query parameters from endpoint and send in body
          const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
          const params: any = {};
          urlParams.forEach((value, key) => {
            params[key] = value;
          });
          fetchOptions.body = JSON.stringify(params);
        }
        
        console.log(`Making ${fetchOptions.method} request to Netlify Functions:`, url);
        console.log('Request body:', fetchOptions.body);
      } else {
        // Direct Google Apps Script mode (fallback)
        if (options.method === 'POST' && options.body) {
          // For POST requests with body, convert to URL parameters for GAS
          const bodyData = JSON.parse(options.body as string);
          const params = new URLSearchParams();
          
          // Add all parameters to URL
          Object.keys(bodyData).forEach(key => {
            params.append(key, bodyData[key]);
          });
          
          url = `${this.baseUrl}?${params.toString()}`;
        } else {
          // For GET requests, use endpoint as-is
          url = `${this.baseUrl}${endpoint}`;
        }

        fetchOptions = {
          method: 'GET', // Use GET to avoid CORS preflight
          mode: 'cors',
        };
        
        console.log(`Making GET request directly to Google Apps Script:`, url);
      }
      
      const response = await fetch(url, fetchOptions);

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response received:', data);
      return data;
    } catch (error) {
      console.error('API request failed, falling back to demo mode:', error);
      // Fallback to mock data if API fails
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  private async getMockResponse<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    const action = new URLSearchParams(endpoint.split('?')[1] || '').get('action');
    
    switch (action) {
      case 'login':
        return this.getMockLoginResponse(options);
      case 'getUsers':
        return this.getMockUsers();
      case 'createUser':
        return this.getMockCreateUser(options);
      case 'updateUser':
        return this.getMockUpdateUser(options);
      case 'deleteUser':
        return this.getMockDeleteUser(options);
      case 'resetUserPassword':
        return this.getMockResetPassword(options);
      case 'getDashboardData':
        return this.getMockDashboardData();
      case 'getDashboardStats':
        return this.getMockDashboardStats();
      case 'getActivityFeed':
        return this.getMockActivityFeed();
      case 'getPerformanceMetrics':
        return this.getMockPerformanceMetrics();
      case 'getComplaints':
        return this.getMockComplaints();
      case 'getSavedSearches':
        return this.getMockSavedSearches();
      case 'getSettings':
        return this.getMockSettings();
      case 'updateSettings':
        return this.getMockUpdateSettings(options);
      case 'getPermissionMatrix':
        return this.getMockPermissionMatrix();
      case 'updatePermissionMatrix':
        return this.getMockUpdatePermissionMatrix(options);
      default:
        return {
          success: true,
          data: {} as T,
          message: 'Demo mode: Mock response'
        };
    }
  }

  private getMockLoginResponse(options: RequestInit): ApiResponse<any> {
    try {
      const body = options.body ? JSON.parse(options.body as string) : {};
      const { email, password } = body;

      // Mock authentication - accept any email/password for demo
      if (email && password) {
        return {
          success: true,
          data: {
            user: {
              id: '1',
              name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              email: email,
              role: email.includes('admin') ? 'admin' : 
                    email.includes('manager') ? 'manager' : 
                    email.includes('foreman') ? 'foreman' :
                    email.includes('technician') ? 'technician' : 'call-attendant',
              region: 'Addis Ababa',
              permissions: {
                complaints: { create: true, read: true, update: true, delete: false },
                users: { create: false, read: true, update: false, delete: false },
                reports: { create: true, read: true, update: false, delete: false },
                analytics: { create: false, read: true, update: false, delete: false }
              }
            },
            token: 'demo-token-' + Date.now()
          },
          message: 'Login successful (Demo Mode)'
        };
      } else {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid login request'
      };
    }
  }

  private getMockDashboardData(): ApiResponse<any> {
    return {
      success: true,
      data: {
        roleInsights: [
          { label: 'System Health', value: '98.5%', status: 'good', trend: 'stable' },
          { label: 'Active Users', value: '247', status: 'good', trend: 'up' },
          { label: 'Server Load', value: '23%', status: 'good', trend: 'down' },
          { label: 'Data Backup', value: 'Current', status: 'good', trend: 'stable' }
        ],
        systemStatus: {
          temperature: 24 + Math.random() * 6,
          connectivity: Math.random() > 0.1 ? 'Strong' : 'Weak',
          batteryLevel: 85 + Math.random() * 15,
          lastUpdate: new Date(),
          alerts: Math.floor(Math.random() * 5),
          activeIncidents: Math.floor(Math.random() * 3),
          serverLoad: Math.random() * 50,
          uptime: '99.8%'
        },
        weatherData: {
          temperature: 25 + Math.random() * 10,
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
          windSpeed: Math.random() * 20,
          visibility: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
          safetyLevel: Math.random() > 0.8 ? 'caution' : 'safe'
        }
      }
    };
  }

  private getMockDashboardStats(): ApiResponse<any> {
    return {
      success: true,
      data: {
        complaints: {
          total: 156,
          open: 23,
          inProgress: 45,
          resolved: 88,
          critical: 5,
          high: 18,
          medium: 67,
          low: 66,
          active: 68,
          inactive: 88,
          overdue: 12
        },
        users: {
          total: 45,
          active: 38,
          inactive: 7
        },
        performance: {
          resolutionRate: 87.5,
          averageResponseTime: '2.3h',
          customerSatisfaction: 4.2
        }
      }
    };
  }

  private getMockActivityFeed(): ApiResponse<any> {
    return {
      success: true,
      data: [
        {
          id: '1',
          type: 'complaint_created',
          title: 'New Critical Complaint',
          description: 'Power outage reported in Addis Ababa - Bole area',
          user: { id: '1', name: 'Sarah Johnson', role: 'call-attendant' },
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          metadata: { priority: 'critical', region: 'Addis Ababa' },
          isImportant: true
        },
        {
          id: '2',
          type: 'complaint_resolved',
          title: 'Billing Issue Resolved',
          description: 'Customer billing discrepancy has been resolved',
          user: { id: '2', name: 'Ahmed Hassan', role: 'technician' },
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          metadata: { priority: 'medium', region: 'Oromia' }
        }
      ]
    };
  }

  private getMockPerformanceMetrics(): ApiResponse<any> {
    return {
      success: true,
      data: {
        metrics: [
          {
            id: 'resolution-rate',
            title: 'Resolution Rate',
            value: 87.5,
            target: 90,
            unit: '%',
            trend: 'up',
            trendValue: 5.2,
            description: 'Percentage of complaints resolved within SLA',
            category: 'efficiency'
          }
        ],
        teamPerformance: [
          {
            teamMember: 'Sarah Johnson',
            role: 'Call Attendant',
            completedTasks: 45,
            averageTime: '2.3h',
            satisfactionScore: 4.6,
            efficiency: 92
          }
        ]
      }
    };
  }

  private getMockComplaints(): ApiResponse<any> {
    return {
      success: true,
      data: [
        {
          ID: 'CMP-2024-001',
          Title: 'Power outage in Bole area',
          Description: 'Complete power outage affecting residential area',
          Category: 'power-outage',
          Priority: 'critical',
          Status: 'in-progress',
          'Customer Name': 'Almaz Tesfaye',
          'Customer Email': 'almaz.tesfaye@email.com',
          'Customer Phone': '+251-911-123-456',
          Region: 'Addis Ababa',
          'Assigned To': 'Ahmed Hassan',
          'Created At': new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  private getMockSavedSearches(): ApiResponse<any> {
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'High Priority Open',
          filters: { priority: 'high', status: 'open' },
          createdAt: new Date().toISOString(),
          isDefault: false
        }
      ]
    };
  }

  private getMockUsers(): ApiResponse<any> {
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@eeu.gov.et',
          phone: '+251-911-123-456',
          role: 'call-attendant',
          region: 'Addis Ababa',
          department: 'Customer Service',
          isActive: true,
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            loginCount: 245,
            lastIpAddress: '192.168.1.100',
            twoFactorEnabled: true,
            passwordLastChanged: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            accountLocked: false,
            failedLoginAttempts: 0
          }
        },
        {
          id: '2',
          name: 'Ahmed Hassan',
          email: 'ahmed.hassan@eeu.gov.et',
          phone: '+251-911-234-567',
          role: 'technician',
          region: 'Dire Dawa',
          department: 'Field Operations',
          isActive: true,
          lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            loginCount: 189,
            lastIpAddress: '192.168.1.101',
            twoFactorEnabled: false,
            passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            accountLocked: false,
            failedLoginAttempts: 1
          }
        },
        {
          id: '3',
          name: 'Meron Tadesse',
          email: 'meron.tadesse@eeu.gov.et',
          phone: '+251-911-345-678',
          role: 'manager',
          region: 'Hawassa',
          department: 'Regional Management',
          isActive: true,
          lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          metadata: {
            loginCount: 312,
            lastIpAddress: '192.168.1.102',
            twoFactorEnabled: true,
            passwordLastChanged: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            accountLocked: false,
            failedLoginAttempts: 0
          }
        },
        {
          id: '4',
          name: 'Daniel Worku',
          email: 'daniel.worku@eeu.gov.et',
          phone: '+251-911-456-789',
          role: 'foreman',
          region: 'Bahir Dar',
          department: 'Field Operations',
          isActive: false,
          lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            loginCount: 156,
            lastIpAddress: '192.168.1.103',
            twoFactorEnabled: false,
            passwordLastChanged: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            accountLocked: true,
            failedLoginAttempts: 5
          }
        },
        {
          id: '5',
          name: 'Hanan Gebru',
          email: 'hanan.gebru@eeu.gov.et',
          phone: '+251-911-567-890',
          role: 'admin',
          region: 'Tigray',
          department: 'IT Administration',
          isActive: true,
          lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          metadata: {
            loginCount: 567,
            lastIpAddress: '192.168.1.104',
            twoFactorEnabled: true,
            passwordLastChanged: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            accountLocked: false,
            failedLoginAttempts: 0
          }
        }
      ]
    };
  }

  private getMockCreateUser(options: RequestInit): ApiResponse<any> {
    try {
      const body = options.body ? JSON.parse(options.body as string) : {};
      const newUser = {
        id: 'user-' + Date.now(),
        ...body,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          loginCount: 0,
          twoFactorEnabled: false,
          accountLocked: false,
          failedLoginAttempts: 0
        }
      };
      
      return {
        success: true,
        data: newUser,
        message: 'User created successfully (Demo Mode)'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid user data'
      };
    }
  }

  private getMockUpdateUser(options: RequestInit): ApiResponse<any> {
    try {
      const body = options.body ? JSON.parse(options.body as string) : {};
      const updatedUser = {
        ...body,
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedUser,
        message: 'User updated successfully (Demo Mode)'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid user data'
      };
    }
  }

  private getMockDeleteUser(options: RequestInit): ApiResponse<any> {
    return {
      success: true,
      message: 'User deleted successfully (Demo Mode)'
    };
  }

  private getMockResetPassword(options: RequestInit): ApiResponse<any> {
    return {
      success: true,
      message: 'Password reset successfully (Demo Mode). User will be notified via email.'
    };
  }

  private getMockSettings(): ApiResponse<any> {
    return {
      success: true,
      data: {
        companyName: 'Ethiopian Electric Utility',
        supportEmail: 'support@eeu.gov.et',
        supportPhone: '+251-11-123-4567',
        address: 'Addis Ababa, Ethiopia',
        autoAssignment: true,
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
        sessionTimeout: 60,
        maxFileSize: 10,
        defaultPriority: 'medium',
        workingHours: {
          start: '08:00',
          end: '17:00'
        }
      },
      message: 'Settings retrieved successfully (Demo Mode)'
    };
  }

  private getMockUpdateSettings(options: RequestInit): ApiResponse<any> {
    try {
      const body = options.body ? JSON.parse(options.body as string) : {};
      return {
        success: true,
        data: body,
        message: 'Settings updated successfully (Demo Mode)'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid settings data'
      };
    }
  }

  private getMockPermissionMatrix(): ApiResponse<any> {
    return {
      success: true,
      data: {
        admin: {
          users: { create: true, read: true, update: true, delete: true },
          complaints: { create: true, read: true, update: true, delete: true },
          reports: { create: true, read: true, update: true, delete: true },
          settings: { create: true, read: true, update: true, delete: true },
          notifications: { create: true, read: true, update: true, delete: true }
        },
        manager: {
          users: { create: false, read: true, update: true, delete: false },
          complaints: { create: true, read: true, update: true, delete: true },
          reports: { create: true, read: true, update: true, delete: false },
          settings: { create: false, read: true, update: false, delete: false },
          notifications: { create: true, read: true, update: true, delete: true }
        },
        foreman: {
          users: { create: false, read: true, update: false, delete: false },
          complaints: { create: true, read: true, update: true, delete: false },
          reports: { create: false, read: true, update: false, delete: false },
          settings: { create: false, read: false, update: false, delete: false },
          notifications: { create: false, read: true, update: false, delete: false }
        },
        'call-attendant': {
          users: { create: false, read: false, update: false, delete: false },
          complaints: { create: true, read: true, update: true, delete: false },
          reports: { create: false, read: false, update: false, delete: false },
          settings: { create: false, read: false, update: false, delete: false },
          notifications: { create: false, read: true, update: false, delete: false }
        },
        technician: {
          users: { create: false, read: false, update: false, delete: false },
          complaints: { create: false, read: true, update: true, delete: false },
          reports: { create: false, read: false, update: false, delete: false },
          settings: { create: false, read: false, update: false, delete: false },
          notifications: { create: false, read: true, update: false, delete: false }
        }
      },
      message: 'Permission matrix retrieved successfully (Demo Mode)'
    };
  }

  private getMockUpdatePermissionMatrix(options: RequestInit): ApiResponse<any> {
    try {
      const body = options.body ? JSON.parse(options.body as string) : {};
      return {
        success: true,
        data: body.permissionMatrix,
        message: 'Permission matrix updated successfully (Demo Mode)'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid permission matrix data'
      };
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 Attempting login for:', credentials.email);
    console.log('🎭 Demo mode active:', this.isDemoMode);
    
    const response = await this.makeRequest('?action=login', {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        email: credentials.email,
        password: credentials.password
      })
    });
    
    console.log('📥 Login response received:', response);
    
    // Transform backend login response format to match frontend expectations
    if (response.success && response.user && !response.data) {
      // Backend returns { success: true, user: {...} }
      // Frontend expects { success: true, data: { user: {...} } }
      const transformedUser = this.transformUserData(response.user);
      return {
        success: true,
        data: {
          user: transformedUser,
          token: response.token || 'backend-token-' + Date.now()
        },
        message: response.message || 'Login successful'
      };
    }
    
    // Enhanced error handling
    if (!response.success) {
      console.error('❌ Login failed:', response.error || response.message);
      return {
        success: false,
        error: response.error || response.message || 'Login failed',
        message: response.message || 'Invalid credentials or server error'
      };
    }
    
    return response;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('?action=healthCheck');
  }

  // Users
  async getUsers(): Promise<ApiResponse> {
    const response = await this.makeRequest('?action=getUsers');
    
    // Transform backend data format to match frontend expectations
    if (response.success && response.data && Array.isArray(response.data)) {
      response.data = response.data.map(user => this.transformUserData(user));
    }
    
    return response;
  }

  private transformUserData(backendUser: any): any {
    // Handle both backend format (uppercase) and mock format (lowercase)
    const role = backendUser.Role || backendUser.role || 'technician';
    
    return {
      id: backendUser.ID || backendUser.id || '',
      name: backendUser.Name || backendUser.name || '',
      email: backendUser.Email || backendUser.email || '',
      phone: backendUser.Phone || backendUser.phone || '',
      role: role,
      region: backendUser.Region || backendUser.region || '',
      department: backendUser.Department || backendUser.department || '',
      isActive: backendUser['Is Active'] !== undefined ? backendUser['Is Active'] : 
                (backendUser.isActive !== undefined ? backendUser.isActive : true),
      lastLogin: backendUser['Last Login'] || backendUser.lastLogin || null,
      createdAt: backendUser['Created At'] || backendUser.createdAt || new Date().toISOString(),
      updatedAt: backendUser['Updated At'] || backendUser.updatedAt || new Date().toISOString(),
      avatar: backendUser.Avatar || backendUser.avatar || null,
      permissions: backendUser.permissions || this.getRolePermissions(role),
      metadata: backendUser.metadata || {
        loginCount: 0,
        lastIpAddress: null,
        twoFactorEnabled: false,
        passwordLastChanged: null,
        accountLocked: false,
        failedLoginAttempts: 0
      }
    };
  }

  private getRolePermissions(role: string): any {
    // Define role-based permissions matching the frontend expectations
    const rolePermissions = {
      admin: {
        complaints: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
        reports: { create: true, read: true, update: true, delete: true },
        analytics: { create: true, read: true, update: true, delete: true }
      },
      manager: {
        complaints: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: true, update: true, delete: false },
        reports: { create: true, read: true, update: true, delete: false },
        analytics: { create: false, read: true, update: false, delete: false }
      },
      foreman: {
        complaints: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: true, update: false, delete: false },
        reports: { create: false, read: true, update: false, delete: false },
        analytics: { create: false, read: true, update: false, delete: false }
      },
      'call-attendant': {
        complaints: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        reports: { create: false, read: true, update: false, delete: false },
        analytics: { create: false, read: true, update: false, delete: false }
      },
      technician: {
        complaints: { create: false, read: true, update: true, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        reports: { create: false, read: false, update: false, delete: false },
        analytics: { create: false, read: false, update: false, delete: false }
      }
    };
    
    return rolePermissions[role] || rolePermissions.technician;
  }

  async createUser(userData: any): Promise<ApiResponse> {
    const response = await this.makeRequest('?action=createUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createUser',
        ...userData
      })
    });
    
    // Transform the created user data if present
    if (response.success && response.user) {
      response.user = this.transformUserData(response.user);
    }
    
    return response;
  }

  async updateUser(userId: string, userData: any): Promise<ApiResponse> {
    const response = await this.makeRequest('?action=updateUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateUser',
        id: userId,
        ...userData
      })
    });
    
    // Transform the updated user data if present
    if (response.success && response.user) {
      response.user = this.transformUserData(response.user);
    }
    
    return response;
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    return this.makeRequest('?action=deleteUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteUser',
        id: userId
      })
    });
  }

  async resetUserPassword(userId: string): Promise<ApiResponse> {
    return this.makeRequest('?action=resetUserPassword', {
      method: 'POST',
      body: JSON.stringify({
        action: 'resetUserPassword',
        userId: userId
      })
    });
  }

  // Complaints CRUD
  async getComplaints(filters?: any): Promise<ApiResponse> {
    const queryParams = filters ? `&${new URLSearchParams(filters).toString()}` : '';
    return this.makeRequest(`?action=getComplaints${queryParams}`);
  }

  async getComplaint(id: string): Promise<ApiResponse> {
    return this.makeRequest(`?action=getComplaint&id=${id}`);
  }

  async createComplaint(complaintData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=createComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createComplaint',
        ...complaintData
      })
    });
  }

  async updateComplaint(complaintData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=updateComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateComplaint',
        ...complaintData
      })
    });
  }

  async deleteComplaint(id: string): Promise<ApiResponse> {
    return this.makeRequest('?action=deleteComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteComplaint',
        id: id
      })
    });
  }

  async assignComplaint(complaintId: string, assigneeId: string): Promise<ApiResponse> {
    return this.makeRequest('?action=assignComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'assignComplaint',
        complaintId,
        assigneeId
      })
    });
  }

  async updateComplaintStatus(complaintId: string, status: string, notes?: string): Promise<ApiResponse> {
    return this.makeRequest('?action=updateComplaintStatus', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateComplaintStatus',
        complaintId,
        status,
        notes
      })
    });
  }

  // Dashboard data
  async getDashboardData(role: string, region?: string): Promise<ApiResponse> {
    const params = new URLSearchParams({ action: 'getDashboardData', role });
    if (region) params.append('region', region);
    return this.makeRequest(`?${params.toString()}`);
  }

  async getDashboardStats(): Promise<ApiResponse> {
    return this.makeRequest('?action=getDashboardStats');
  }

  async getActivityFeed(limit?: number): Promise<ApiResponse> {
    const params = new URLSearchParams({ action: 'getActivityFeed' });
    if (limit) params.append('limit', limit.toString());
    return this.makeRequest(`?${params.toString()}`);
  }

  async getPerformanceMetrics(period?: string): Promise<ApiResponse> {
    const params = new URLSearchParams({ action: 'getPerformanceMetrics' });
    if (period) params.append('period', period);
    return this.makeRequest(`?${params.toString()}`);
  }

  // Reports
  async getReports(filters?: any): Promise<ApiResponse> {
    const queryParams = filters ? `&${new URLSearchParams(filters).toString()}` : '';
    return this.makeRequest(`?action=getReports${queryParams}`);
  }

  async createReport(reportData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=createReport', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createReport',
        ...reportData
      })
    });
  }

  // Analytics
  async getAnalytics(period?: string, region?: string): Promise<ApiResponse> {
    const params = new URLSearchParams({ action: 'getAnalytics' });
    if (period) params.append('period', period);
    if (region) params.append('region', region);
    return this.makeRequest(`?${params.toString()}`);
  }

  // Search
  async searchComplaints(query: string, filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams({ action: 'searchComplaints', query });
    if (filters) {
      Object.keys(filters).forEach(key => {
        params.append(key, filters[key]);
      });
    }
    return this.makeRequest(`?${params.toString()}`);
  }

  async getSavedSearches(): Promise<ApiResponse> {
    return this.makeRequest('?action=getSavedSearches');
  }

  async saveSearch(searchData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=saveSearch', {
      method: 'POST',
      body: JSON.stringify({
        action: 'saveSearch',
        ...searchData
      })
    });
  }

  // Export
  async exportData(type: string, filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams({ action: 'exportData', type });
    if (filters) {
      Object.keys(filters).forEach(key => {
        params.append(key, filters[key]);
      });
    }
    return this.makeRequest(`?${params.toString()}`);
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse> {
    return this.makeRequest('?action=getNotifications');
  }

  async markNotificationRead(notificationId: string): Promise<ApiResponse> {
    return this.makeRequest('?action=markNotificationRead', {
      method: 'POST',
      body: JSON.stringify({
        action: 'markNotificationRead',
        notificationId
      })
    });
  }

  // Settings Management
  async getSettings(): Promise<ApiResponse> {
    return this.makeRequest('?action=getSettings');
  }

  async updateSettings(settings: any): Promise<ApiResponse> {
    return this.makeRequest('?action=updateSettings', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateSettings',
        ...settings
      })
    });
  }

  // Permission Management
  async getPermissionMatrix(): Promise<ApiResponse> {
    return this.makeRequest('?action=getPermissionMatrix');
  }

  async updatePermissionMatrix(permissionMatrix: any): Promise<ApiResponse> {
    return this.makeRequest('?action=updatePermissionMatrix', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updatePermissionMatrix',
        permissionMatrix
      })
    });
  }
}

export const apiService = new ApiService();