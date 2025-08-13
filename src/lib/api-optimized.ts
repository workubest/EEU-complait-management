// Optimized API service with caching and performance improvements
import { environment } from '../config/environment';
import { apiCache, invalidateComplaintCache, invalidateUserCache, invalidateCustomerCache } from './api-cache';

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

class OptimizedApiService {
  private baseUrl: string;
  private isProduction: boolean;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor() {
    this.isProduction = environment.isProduction;
    this.baseUrl = environment.apiBaseUrl;
    
    console.log('🚀 Optimized API Service initialized');
    console.log('📡 Backend URL:', this.baseUrl);
    console.log('🔧 Production mode:', this.isProduction);
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {},
    useCache: boolean = false,
    cacheKey?: string,
    cacheParams?: any
  ): Promise<ApiResponse<T>> {
    // Check cache first for GET requests
    if (useCache && cacheKey && (!options.method || options.method === 'GET')) {
      const cached = apiCache.get(cacheKey, cacheParams);
      if (cached) {
        return cached;
      }
    }

    // Create abort controller for request cancellation
    const requestId = `${endpoint}-${Date.now()}`;
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

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
          signal: abortController.signal,
        };
        
        if (options.method === 'POST' && options.body) {
          fetchOptions.body = options.body;
        }
      } else if (this.baseUrl.includes('/.netlify/functions/')) {
        // Production mode: use Netlify Functions proxy
        url = `${this.baseUrl}${endpoint}`;
        fetchOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: abortController.signal,
        };
        
        if (options.body) {
          fetchOptions.body = options.body;
        } else {
          const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
          const params: any = {};
          urlParams.forEach((value, key) => {
            params[key] = value;
          });
          fetchOptions.body = JSON.stringify(params);
        }
      } else {
        // Direct Google Apps Script mode
        if (options.method === 'POST' && options.body) {
          url = this.baseUrl;
          fetchOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            mode: 'cors',
            signal: abortController.signal,
            body: options.body
          };
        } else {
          url = `${this.baseUrl}${endpoint}`;
          fetchOptions = {
            method: 'GET',
            mode: 'cors',
            signal: abortController.signal,
          };
        }
      }
      
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      // Cache successful responses
      if (useCache && cacheKey && data.success) {
        apiCache.set(cacheKey, data, cacheParams);
      }
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        throw new Error('Request cancelled');
      }
      console.error('API request failed:', error);
      throw error;
    } finally {
      this.abortControllers.delete(requestId);
    }
  }

  // Cancel all pending requests
  cancelAllRequests() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }

  // Data transformation methods (same as original)
  private transformUserData(user: any) {
    return {
      id: user.id || user.ID || '',
      name: user.name || user.Name || '',
      email: user.email || user.Email || '',
      role: user.role || user.Role || 'technician',
      region: user.region || user.Region || '',
      department: user.department || user.Department || '',
      phone: user.phone || user.Phone || '',
      isActive: user.isActive !== undefined ? user.isActive : (user['Is Active'] !== undefined ? user['Is Active'] : true),
      createdAt: user.createdAt || user['Created At'] || new Date().toISOString(),
      lastLogin: user.lastLogin || user['Last Login'] || null,
      updatedAt: user.updatedAt || user['Updated At'] || new Date().toISOString()
    };
  }

  private transformComplaintData(complaint: any) {
    return {
      id: complaint.id || complaint.ID || '',
      title: complaint.title || complaint.Title || '',
      description: complaint.description || complaint.Description || '',
      category: complaint.category || complaint.Category || 'other',
      priority: complaint.priority || complaint.Priority || 'medium',
      status: complaint.status || complaint.Status || 'open',
      customerName: complaint.customerName || complaint['Customer Name'] || '',
      customerEmail: complaint.customerEmail || complaint['Customer Email'] || '',
      customerPhone: complaint.customerPhone || complaint['Customer Phone'] || '',
      customerAddress: complaint.customerAddress || complaint['Customer Address'] || '',
      region: complaint.region || complaint.Region || '',
      serviceCenter: complaint.serviceCenter || complaint['Service Center'] || '',
      location: complaint.location || complaint.Location || '',
      assignedTo: complaint.assignedTo || complaint['Assigned To'] || '',
      assignedBy: complaint.assignedBy || complaint['Assigned By'] || '',
      createdBy: complaint.createdBy || complaint['Created By'] || '',
      accountNumber: complaint.accountNumber || complaint['Account Number'] || '',
      meterNumber: complaint.meterNumber || complaint['Meter Number'] || '',
      createdAt: complaint.createdAt || complaint['Created At'] || new Date().toISOString(),
      updatedAt: complaint.updatedAt || complaint['Updated At'] || new Date().toISOString(),
      estimatedResolution: complaint.estimatedResolution || complaint['Estimated Resolution'] || null,
      resolvedAt: complaint.resolvedAt || complaint['Resolved At'] || null,
      notes: complaint.notes || complaint.Notes || [],
      attachments: complaint.attachments || complaint.Attachments || [],
      tags: complaint.tags || complaint.Tags || [],
      customerRating: complaint.customerRating || complaint['Customer Rating'] || 0,
      feedback: complaint.feedback || complaint.Feedback || ''
    };
  }

  private transformCustomerData(customer: any) {
    return {
      id: customer.id || customer.ID || '',
      name: customer.name || customer.Name || '',
      email: customer.email || customer.Email || '',
      phone: customer.phone || customer.Phone || '',
      address: customer.address || customer.Address || customer['Customer Address'] || '',
      region: customer.region || customer.Region || '',
      serviceCenter: customer.serviceCenter || customer['Service Center'] || '',
      meterNumber: customer.meterNumber || customer['Meter Number'] || '',
      accountNumber: customer.accountNumber || customer['Account Number'] || ''
    };
  }

  // Optimized API Methods with caching
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const requestBody = {
      action: 'login',
      ...credentials,
      timestamp: new Date().toISOString()
    };
    
    return this.makeRequest('?action=login', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  }

  async getDashboardData(role?: string, region?: string): Promise<ApiResponse> {
    const cacheKey = 'getDashboardData';
    const cacheParams = { role, region };
    
    return apiCache.deduplicate(`${cacheKey}:${JSON.stringify(cacheParams)}`, async () => {
      const params = new URLSearchParams({ action: 'getDashboardStats' });
      if (role) params.append('role', role);
      if (region) params.append('region', region);
      
      return this.makeRequest(`?${params.toString()}`, {}, true, cacheKey, cacheParams);
    });
  }

  async getUsers(): Promise<ApiResponse> {
    const cacheKey = 'getUsers';
    
    return apiCache.deduplicate(cacheKey, async () => {
      const response = await this.makeRequest('?action=getUsers', {}, true, cacheKey);
      if (response.success && response.data) {
        response.data = response.data.map((user: any) => this.transformUserData(user));
      }
      return response;
    });
  }

  async getComplaints(filters?: any): Promise<ApiResponse> {
    const cacheKey = 'getComplaints';
    const cacheParams = filters;
    
    return apiCache.deduplicate(`${cacheKey}:${JSON.stringify(cacheParams)}`, async () => {
      const queryParams = new URLSearchParams({ action: 'getComplaints' });
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) queryParams.append(key, filters[key]);
        });
      }
      
      const response = await this.makeRequest(`?${queryParams.toString()}`, {}, true, cacheKey, cacheParams);
      if (response.success && response.data) {
        response.data = response.data.map((complaint: any) => {
          const transformed = this.transformComplaintData(complaint);
          if (complaint.customer) {
            transformed.customer = this.transformCustomerData(complaint.customer);
          }
          return transformed;
        });
      }
      return response;
    });
  }

  async searchComplaints(searchParams: any): Promise<ApiResponse> {
    const cacheKey = 'searchComplaints';
    const cacheParams = searchParams;
    
    return apiCache.deduplicate(`${cacheKey}:${JSON.stringify(cacheParams)}`, async () => {
      const queryParams = new URLSearchParams({ action: 'getComplaints' });
      
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== '') {
          queryParams.append(key, searchParams[key]);
        }
      });
      
      const response = await this.makeRequest(`?${queryParams.toString()}`, {}, true, cacheKey, cacheParams);
      if (response.success && response.data) {
        const transformedData = response.data.map((complaint: any) => {
          const transformed = this.transformComplaintData(complaint);
          if (complaint.customer) {
            transformed.customer = this.transformCustomerData(complaint.customer);
          }
          return transformed;
        });

        return {
          success: true,
          data: transformedData,
          pagination: {
            page: 1,
            limit: transformedData.length,
            total: transformedData.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        };
      }
      return response;
    });
  }

  async getComplaintById(id: string): Promise<ApiResponse> {
    const cacheKey = 'getComplaintById';
    const cacheParams = { id };
    
    return apiCache.deduplicate(`${cacheKey}:${id}`, async () => {
      const response = await this.makeRequest(`?action=getComplaintById&id=${id}`, {}, true, cacheKey, cacheParams);
      if (response.success && response.data) {
        response.data = this.transformComplaintData(response.data);
        if (response.data.customer) {
          response.data.customer = this.transformCustomerData(response.data.customer);
        }
      }
      return response;
    });
  }

  async createComplaint(complaintData: any): Promise<ApiResponse> {
    const result = await this.makeRequest('?action=createComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createComplaint',
        ...complaintData
      })
    });
    
    // Invalidate related caches
    if (result.success) {
      invalidateComplaintCache();
    }
    
    return result;
  }

  async updateComplaint(complaintData: any): Promise<ApiResponse> {
    const result = await this.makeRequest('?action=updateComplaint', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateComplaint',
        ...complaintData
      })
    });
    
    // Invalidate related caches
    if (result.success) {
      invalidateComplaintCache();
    }
    
    return result;
  }

  async createUser(userData: any): Promise<ApiResponse> {
    const result = await this.makeRequest('?action=createUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createUser',
        ...userData
      })
    });
    
    // Invalidate related caches
    if (result.success) {
      invalidateUserCache();
    }
    
    return result;
  }

  async updateUser(userData: any): Promise<ApiResponse> {
    const result = await this.makeRequest('?action=updateUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateUser',
        ...userData
      })
    });
    
    // Invalidate related caches
    if (result.success) {
      invalidateUserCache();
    }
    
    return result;
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    const result = await this.makeRequest('?action=deleteUser', {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteUser',
        id: userId
      })
    });
    
    // Invalidate related caches
    if (result.success) {
      invalidateUserCache();
    }
    
    return result;
  }

  async getCustomers(): Promise<ApiResponse> {
    const cacheKey = 'getCustomers';
    
    return apiCache.deduplicate(cacheKey, async () => {
      return this.makeRequest('?action=getCustomers', {}, true, cacheKey);
    });
  }

  async searchCustomer(searchParams: { type: 'contract' | 'business', value: string }): Promise<ApiResponse> {
    const cacheKey = 'searchCustomer';
    const cacheParams = searchParams;
    
    return apiCache.deduplicate(`${cacheKey}:${JSON.stringify(cacheParams)}`, async () => {
      const queryParams = new URLSearchParams({ 
        action: 'searchCustomer',
        type: searchParams.type,
        value: searchParams.value
      });
      
      const response = await this.makeRequest(`?${queryParams.toString()}`, {}, true, cacheKey, cacheParams);
      if (response.success && response.data) {
        response.data = this.transformCustomerData(response.data);
      }
      return response;
    });
  }

  async healthCheck(): Promise<ApiResponse> {
    try {
      return await this.makeRequest('?action=healthCheck');
    } catch (error) {
      return {
        success: false,
        error: 'Health check failed'
      };
    }
  }

  async exportData(type: string, options: any): Promise<ApiResponse> {
    return this.makeRequest('?action=exportData', {
      method: 'POST',
      body: JSON.stringify({
        action: 'exportData',
        type,
        ...options
      })
    });
  }

  // Cache management methods
  clearCache() {
    apiCache.clear();
  }

  getCacheStats() {
    return apiCache.getStats();
  }
}

// Create singleton instance
export const optimizedApiService = new OptimizedApiService();
export default optimizedApiService;