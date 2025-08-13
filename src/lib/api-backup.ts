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
    // Try real backend first, fallback to demo mode if it fails
    this.isDemoMode = false; // Start with real backend, fallback to demo if needed
    
    console.log('🚀 API Service initialized');
    console.log('📡 Backend URL:', this.baseUrl);
    console.log('🔧 Production mode:', this.isProduction);
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
      // For Google Apps Script, use GET requests with URL parameters to avoid CORS issues
      let url: string;
      
      if (options.method === 'POST' && options.body) {
        // For POST requests with body, convert to URL parameters
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

      const fetchOptions: RequestInit = {
        method: 'GET', // Use GET to avoid CORS preflight
        mode: 'cors',
      };
      
      console.log(`Making GET request to Google Apps Script:`, url);
      
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

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest('?action=login', {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        email: credentials.email,
        password: credentials.password
      })
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('?action=healthCheck');
  }

  // Users
  async getUsers(): Promise<ApiResponse> {
    return this.makeRequest('?action=getUsers');
  }

  async createUser(userData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=createUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createUser',
        ...userData
      })
    });
  }

  async updateUser(userData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=updateUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateUser',
        ...userData
      })
    });
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

  async updateComplaint(id: string, complaintData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=updateComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateComplaint',
        id,
        ...complaintData
      })
    });
  }

  async deleteComplaint(id: string): Promise<ApiResponse> {
    return this.makeRequest('?action=deleteComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteComplaint',
        id
      })
    });
  }

  async assignComplaint(id: string, assigneeId: string): Promise<ApiResponse> {
    return this.makeRequest('?action=assignComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'assignComplaint',
        id,
        assigneeId
      })
    });
  }

  async updateComplaintStatus(id: string, status: string): Promise<ApiResponse> {
    return this.makeRequest('?action=updateComplaintStatus', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateComplaintStatus',
        id,
        status
      })
    });
  }

  // Reports CRUD
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

  async updateReport(id: string, reportData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=updateReport', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateReport',
        id,
        ...reportData
      })
    });
  }

  async deleteReport(id: string): Promise<ApiResponse> {
    return this.makeRequest('?action=deleteReport', {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteReport',
        id
      })
    });
  }

  // Settings CRUD
  async getSettings(): Promise<ApiResponse> {
    return this.makeRequest('?action=getSettings');
  }

  async updateSettings(settingsData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=updateSettings', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateSettings',
        ...settingsData
      })
    });
  }

  // Permission Matrix CRUD
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

  // Notifications
  async getNotifications(): Promise<ApiResponse> {
    return this.makeRequest('?action=getNotifications');
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse> {
    return this.makeRequest('?action=markNotificationAsRead', {
      method: 'POST',
      body: JSON.stringify({
        action: 'markNotificationAsRead',
        id
      })
    });
  }

  async deleteNotification(id: string): Promise<ApiResponse> {
    return this.makeRequest('?action=deleteNotification', {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteNotification',
        id
      })
    });
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse> {
    return this.makeRequest('?action=getDashboardStats');
  }

  async getActivityFeed(): Promise<ApiResponse> {
    return this.makeRequest('?action=getActivityFeed');
  }

  async getPerformanceMetrics(period: string = 'week'): Promise<ApiResponse> {
    return this.makeRequest(`?action=getPerformanceMetrics&period=${period}`);
  }

  async downloadReport(reportId: string): Promise<ApiResponse> {
    return this.makeRequest(`?action=downloadReport&reportId=${reportId}`);
  }

  // Additional utility methods
  async searchComplaints(query: string, filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams({ 
      action: 'searchComplaints', 
      query,
      ...(filters || {})
    });
    return this.makeRequest(`?${params.toString()}`);
  }

  async getSystemHealth(): Promise<ApiResponse> {
    return this.makeRequest('?action=getSystemHealth');
  }

  async exportData(type: string, filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams({ 
      action: 'exportData', 
      type,
      ...(filters || {})
    });
    return this.makeRequest(`?${params.toString()}`);
  }

  async bulkImport(data: any[], type: string): Promise<ApiResponse> {
    return this.makeRequest('?action=bulkImport', {
      method: 'POST',
      body: JSON.stringify({
        action: 'bulkImport',
        data,
        type
      })
    });
  }

  async scheduleTask(taskData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=scheduleTask', {
      method: 'POST',
      body: JSON.stringify({
        action: 'scheduleTask',
        ...taskData
      })
    });
  }

  async sendNotification(notificationData: any): Promise<ApiResponse> {
    return this.makeRequest('?action=sendNotification', {
      method: 'POST',
      body: JSON.stringify({
        action: 'sendNotification',
        ...notificationData
      })
    });
  }

  async getAnalytics(filters?: any): Promise<ApiResponse> {
    const queryParams = filters ? `&${new URLSearchParams(filters).toString()}` : '';
    return this.makeRequest(`?action=getAnalytics${queryParams}`);
  }

  async resetUserPassword(userId: string): Promise<ApiResponse> {
    return this.makeRequest('?action=resetUserPassword', {
      method: 'POST',
      body: JSON.stringify({
        action: 'resetUserPassword',
        userId
      })
    });
  }

  async getDashboardData(role?: string, region?: string): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (role) queryParams.append('role', role);
    if (region) queryParams.append('region', region);
    
    return this.makeRequest(`?action=getDashboardData&${queryParams.toString()}`);
  }

  async getSavedSearches(): Promise<ApiResponse> {
    return this.makeRequest('?action=getSavedSearches');
  }

  async bulkUpdateComplaints(complaintIds: string[], updates: any): Promise<ApiResponse> {
    return this.makeRequest('?action=bulkUpdateComplaints', {
      method: 'POST',
      body: JSON.stringify({
        action: 'bulkUpdateComplaints',
        complaintIds,
        updates
      })
    });
  }

  async getDashboardStats(): Promise<ApiResponse> {
    return this.makeRequest('?action=getDashboardStats');
  }

  async getActivityFeed(): Promise<ApiResponse> {
    return this.makeRequest('?action=getActivityFeed');
  }

  async getPerformanceMetrics(period: string): Promise<ApiResponse> {
    return this.makeRequest(`?action=getPerformanceMetrics&period=${period}`);
  }
}

export const apiService = new ApiService();
