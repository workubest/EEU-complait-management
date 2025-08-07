// API service for Google Apps Script backend integration

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
  private baseUrl = '/api';

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
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
}

export const apiService = new ApiService();
