# Netlify Function Proxy Setup

## 🎯 Overview

This document explains how the frontend is configured to use Netlify Functions as a proxy to Google Apps Script, eliminating CORS issues and providing a seamless backend integration.

## 🏗️ Architecture

```
Frontend (React) → Netlify Function (Proxy) → Google Apps Script (Backend)
```

### Benefits:
- ✅ **No CORS Issues**: Netlify Functions handle CORS headers properly
- ✅ **Secure**: Backend URL is hidden from frontend
- ✅ **Reliable**: Automatic retry and error handling
- ✅ **Scalable**: Netlify Functions auto-scale
- ✅ **Fast**: Edge deployment for low latency

## 📁 File Structure

```
netlify/
└── functions/
    ├── proxy.js          # Main proxy function
    └── test.js           # Test function for verification

src/
├── config/
│   └── environment.ts    # Environment configuration
└── lib/
    └── api.ts           # API service with proxy support
```

## 🔧 Configuration

### 1. Environment Configuration (`src/config/environment.ts`)

```typescript
export const environment: EnvironmentConfig = {
  isProduction,
  isDevelopment,
  googleAppsScriptUrl: GOOGLE_APPS_SCRIPT_URL,
  // Uses Netlify Functions proxy in production
  apiBaseUrl: isProduction ? '/.netlify/functions/proxy' : '/api',
  forceRealBackend
};
```

### 2. API Service (`src/lib/api.ts`)

The API service automatically detects the environment and uses the appropriate endpoint:

```typescript
// Production: Uses Netlify Functions proxy
if (this.baseUrl.includes('/.netlify/functions/')) {
  url = `${this.baseUrl}${endpoint}`;
  fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
    mode: 'cors',
  };
}
```

### 3. Netlify Function (`netlify/functions/proxy.js`)

The proxy function:
- Accepts requests from the frontend
- Forwards them to Google Apps Script
- Handles CORS headers properly
- Returns responses with proper headers

## 🚀 Request Flow

### 1. Frontend Request
```javascript
// Frontend makes request to Netlify Function
const response = await fetch('/.netlify/functions/proxy?action=login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'login',
    email: 'user@example.com',
    password: 'password123'
  })
});
```

### 2. Netlify Function Processing
```javascript
// Netlify Function receives request
const requestBody = JSON.parse(event.body);

// Forwards to Google Apps Script
const gasResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestBody)
});
```

### 3. Response with CORS Headers
```javascript
// Returns response with proper CORS headers
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
};
```

## 🧪 Testing

### 1. Test Netlify Functions
```bash
# Test the test function
curl https://your-site.netlify.app/.netlify/functions/test

# Expected response:
{
  "success": true,
  "message": "Netlify Functions are working!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Proxy Function
```bash
# Test login through proxy
curl -X POST https://your-site.netlify.app/.netlify/functions/proxy \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"admin@eeu.gov.et","password":"admin123"}'
```

### 3. Browser Console Testing
```javascript
// Test from browser console
fetch('/.netlify/functions/proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'login',
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔒 Security Features

### 1. CORS Configuration
- Proper CORS headers set for all responses
- Handles preflight OPTIONS requests
- Allows necessary headers and methods

### 2. Environment Variables
```bash
# Set in Netlify dashboard or netlify.toml
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 3. Request Validation
- Validates request format
- Handles malformed JSON gracefully
- Provides meaningful error messages

## 📊 Monitoring & Debugging

### 1. Console Logging
The proxy function provides detailed logging:
```
🔄 Netlify Function - Proxy Request
📝 Method: POST
🎯 Action: login
📦 Request Body: {"action":"login","email":"..."}
🌐 Final URL: https://script.google.com/macros/s/.../exec
📥 Google Apps Script Response Status: 200
✅ Google Apps Script Response: {"success":true,...}
```

### 2. Error Handling
```javascript
// Comprehensive error handling
try {
  const response = await fetch(scriptUrl, fetchOptions);
  // ... process response
} catch (error) {
  console.error('❌ Proxy Error:', error);
  return {
    statusCode: 500,
    headers: { /* CORS headers */ },
    body: JSON.stringify({
      success: false,
      error: 'Proxy error',
      details: error.message
    })
  };
}
```

## 🚀 Deployment

### 1. Netlify Configuration (`netlify.toml`)
```toml
[build]
  publish = "dist"
  command = "npm run build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

### 2. Environment Variables
Set in Netlify dashboard:
- `GOOGLE_APPS_SCRIPT_URL`: Your Google Apps Script URL
- `NODE_ENV`: production

### 3. Build Process
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Netlify (automatic via Git integration)
git push origin main
```

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check that CORS headers are properly set in proxy function
   - Verify preflight OPTIONS requests are handled

2. **Function Not Found**
   - Ensure `netlify/functions/` directory structure is correct
   - Check `netlify.toml` functions configuration

3. **Google Apps Script Errors**
   - Verify the Google Apps Script URL is correct
   - Check Google Apps Script logs for errors
   - Ensure the script is deployed and accessible

4. **Request Format Issues**
   - Verify request body is valid JSON
   - Check that required parameters are included
   - Ensure action parameter is specified

### Debug Steps:

1. **Check Netlify Function Logs**
   ```bash
   # View function logs in Netlify dashboard
   # Or use Netlify CLI
   netlify functions:log
   ```

2. **Test Direct Google Apps Script**
   ```bash
   # Test Google Apps Script directly
   curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
     -H "Content-Type: application/json" \
     -d '{"action":"login","email":"test@example.com","password":"test"}'
   ```

3. **Verify Environment Variables**
   ```bash
   # Check environment variables in Netlify dashboard
   # Ensure GOOGLE_APPS_SCRIPT_URL is set correctly
   ```

## ✅ Success Indicators

When everything is working correctly, you should see:

1. **Frontend Console**:
   ```
   🚀 API Service initialized
   📡 Backend URL: /.netlify/functions/proxy
   Making POST request to Netlify Functions: /.netlify/functions/proxy?action=login
   Response received: {"success":true,"data":{"user":{...}}}
   ```

2. **Netlify Function Logs**:
   ```
   🔄 Netlify Function - Proxy Request
   📥 Google Apps Script Response Status: 200
   ✅ Google Apps Script Response: {"success":true,...}
   ```

3. **No CORS Errors**: Browser console should be free of CORS-related errors

4. **Successful Authentication**: Users can log in and access the dashboard

## 🎉 Result

The application now successfully:
- ✅ Uses Netlify Functions as a proxy to Google Apps Script
- ✅ Eliminates all CORS issues
- ✅ Provides secure backend communication
- ✅ Maintains excellent performance
- ✅ Offers comprehensive error handling and logging
- ✅ Supports both development and production environments

The Netlify proxy setup is complete and ready for production use!