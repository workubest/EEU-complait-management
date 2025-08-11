// Simulate exactly what the frontend does
import fetch from 'node-fetch';

// Simulate the environment configuration
const environment = {
  isProduction: false,
  isDevelopment: true,
  googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec',
  apiBaseUrl: 'https://script.google.com/macros/s/AKfycbwRtSTJjIA9_Hx-SpX95dJ2hRg1SSkEGLlyqjWElWJoiGQWtLzt7pwYeyeycah7KpI/exec',
  forceRealBackend: true,
  forceDemoMode: false
};

// Simulate the API service makeRequest method
async function makeRequest(endpoint, options = {}) {
  try {
    let url;
    let fetchOptions;
    
    const baseUrl = environment.apiBaseUrl;
    
    console.log('🔧 Environment:', {
      isProduction: environment.isProduction,
      isDevelopment: environment.isDevelopment,
      apiBaseUrl: environment.apiBaseUrl
    });
    
    // This simulates the "Direct Google Apps Script mode" path
    if (options.method === 'POST' && options.body) {
      // For POST requests to GAS, use text/plain to avoid CORS preflight
      url = baseUrl;
      fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Avoids preflight
        },
        mode: 'cors',
        body: options.body // Send JSON as plain text
      };
      console.log(`Making POST request with text/plain to Google Apps Script:`, url);
      console.log('Request body:', options.body);
    } else {
      // For GET requests, use endpoint as query parameters
      url = `${baseUrl}${endpoint}`;
      fetchOptions = {
        method: 'GET',
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

    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Simulate the login API call
async function login(credentials) {
  return makeRequest('?action=login', {
    method: 'POST',
    body: JSON.stringify({
      action: 'login',
      ...credentials
    })
  });
}

// Simulate the Login component logic
async function simulateLogin() {
  console.log('🎭 Simulating Frontend Login Process...\n');
  
  const email = 'admin@eeu.gov.et';
  const password = 'admin123';
  
  try {
    console.log('📧 Attempting login with:', { email, password });
    
    // Call the simulated API service
    const response = await login({ email, password });
    
    console.log('\n🔍 Login component received response:', response);
    console.log('🔍 Response analysis:', {
      success: response.success,
      hasData: !!response.data,
      hasDataUser: !!(response.data && response.data.user),
      hasUser: !!response.user,
      dataKeys: response.data ? Object.keys(response.data) : [],
      responseKeys: Object.keys(response)
    });

    if (response.success) {
      // Get user data from the response - API service should have transformed it
      let user = null;
      
      if (response.data?.user) {
        user = response.data.user;
        console.log('✅ Using response.data.user');
      } else if (response.user) {
        user = response.user;
        console.log('✅ Using response.user');
      } else {
        console.error('❌ No user data found in successful response');
        throw new Error('No user data in login response');
      }
      
      console.log('👤 User data received:', user);
      
      // The API service should have already transformed the data, so use it directly
      // But add fallback for compatibility
      const userData = {
        id: user.id || user.ID || '',
        name: user.name || user.Name || '',
        email: user.email || user.Email || '',
        role: user.role || user.Role || 'technician',
        region: user.region || user.Region || '',
        serviceCenter: user.serviceCenter || user.ServiceCenter || '',
        phone: user.phone || user.Phone || '',
        isActive: user.isActive !== undefined ? user.isActive : (user['Is Active'] !== undefined ? user['Is Active'] : true),
        createdAt: user.createdAt || user['Created At'] || new Date().toISOString(),
      };

      console.log('✅ Final user data for login:', userData);
      console.log('\n🎉 LOGIN SHOULD SUCCEED!');
      
    } else {
      console.error('❌ Login failed - response.success is false');
      throw new Error(response.error || response.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error('\n💥 Login error:', error.message);
    console.log('\n❌ THIS IS THE EXACT ERROR THE FRONTEND SEES');
  }
}

simulateLogin().catch(console.error);