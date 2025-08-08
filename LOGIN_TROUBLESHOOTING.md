# 🔐 Login Troubleshooting Guide

## 🚨 Current Issue: "Invalid credentials" Error

The error `Login error: Error: Invalid credentials` indicates that the Netlify proxy is working correctly (no CORS errors), but the Google Apps Script backend is rejecting the login credentials.

## 🔍 Immediate Solutions

### 1. **Enable Demo Mode (Quick Fix)**

**Problem:** Application is trying to connect to real Google Apps Script with test credentials.

**Solution:** Enable demo mode to use mock authentication:

```bash
# In .env.local file, uncomment:
VITE_FORCE_DEMO_MODE=true
```

**Result:** Application will use mock authentication and accept any valid email/password combination.

### 2. **Test Credentials**

Use the debug tool to test different credential combinations:

1. Open: `https://your-site.netlify.app/debug-login-credentials.html`
2. Test default credentials:
   - **Admin:** `admin@eeu.gov.et` / `admin123`
   - **Manager:** `manager@eeu.gov.et` / `manager123`
   - **Staff:** `staff@eeu.gov.et` / `staff123`
   - **Customer:** `customer@eeu.gov.et` / `customer123`

## 🔧 Root Cause Analysis

### Possible Causes:

1. **Google Apps Script Not Configured**
   - The Google Apps Script may not have user authentication set up
   - User database may be empty or have different credentials

2. **Request Format Issues**
   - Google Apps Script expects different parameter names
   - Authentication logic may be different than expected

3. **Environment Configuration**
   - Wrong Google Apps Script URL
   - Script not deployed or accessible

## 🧪 Debugging Steps

### Step 1: Check Environment Variables

```javascript
// Open browser console and check:
console.log('Environment:', {
  VITE_FORCE_DEMO_MODE: import.meta.env.VITE_FORCE_DEMO_MODE,
  VITE_FORCE_REAL_BACKEND: import.meta.env.VITE_FORCE_REAL_BACKEND,
  isProduction: !window.location.hostname.includes('localhost')
});
```

### Step 2: Test Direct Google Apps Script Connection

```javascript
// Test direct connection to Google Apps Script
fetch('https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'login',
    email: 'admin@eeu.gov.et',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => console.log('Direct GAS Response:', data))
.catch(error => console.error('Direct GAS Error:', error));
```

### Step 3: Check Netlify Function Logs

1. Go to Netlify Dashboard → Functions → proxy
2. Check recent invocations and logs
3. Look for error messages or request details

### Step 4: Verify Request Format

The Google Apps Script should expect this format:
```json
{
  "action": "login",
  "email": "admin@eeu.gov.et",
  "password": "admin123"
}
```

## 🛠️ Solutions by Scenario

### Scenario 1: Demo/Testing Environment

**Solution:** Enable demo mode
```bash
# .env.local
VITE_FORCE_DEMO_MODE=true
```

**Expected Result:** Login works with any valid email/password

### Scenario 2: Production with Real Backend

**Requirements:**
1. Google Apps Script must be properly configured
2. User database must exist with correct credentials
3. Authentication logic must match request format

**Steps:**
1. Verify Google Apps Script URL is correct
2. Check Google Apps Script has user authentication implemented
3. Ensure user database has the test credentials
4. Test direct connection to Google Apps Script

### Scenario 3: Development Environment

**Option A:** Use demo mode for development
```bash
# .env.development
VITE_FORCE_DEMO_MODE=true
```

**Option B:** Connect to real backend
```bash
# .env.development
VITE_FORCE_DEMO_MODE=false
VITE_FORCE_REAL_BACKEND=true
```

## 📋 Google Apps Script Requirements

For the login to work with real backend, your Google Apps Script should have:

### 1. **doPost Function**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'login') {
    return handleLogin(data.email, data.password);
  }
  
  // Handle other actions...
}
```

### 2. **Login Handler**
```javascript
function handleLogin(email, password) {
  // Your authentication logic here
  const user = authenticateUser(email, password);
  
  if (user) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: {
          user: user,
          token: generateToken()
        },
        message: 'Login successful'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. **User Database**
```javascript
function authenticateUser(email, password) {
  const users = {
    'admin@eeu.gov.et': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'manager@eeu.gov.et': { password: 'manager123', role: 'manager', name: 'Manager User' },
    'staff@eeu.gov.et': { password: 'staff123', role: 'staff', name: 'Staff User' },
    'customer@eeu.gov.et': { password: 'customer123', role: 'customer', name: 'Customer User' }
  };
  
  const user = users[email];
  if (user && user.password === password) {
    return {
      id: email,
      name: user.name,
      email: email,
      role: user.role,
      region: 'Addis Ababa'
    };
  }
  
  return null;
}
```

## 🎯 Quick Fix for Testing

**Immediate Solution:** Enable demo mode to test the application functionality:

1. **Update .env.local:**
   ```bash
   VITE_FORCE_DEMO_MODE=true
   ```

2. **Restart development server:**
   ```bash
   npm run dev
   ```

3. **Test login with any credentials:**
   - Email: `admin@eeu.gov.et`
   - Password: `admin123`

4. **Expected result:** Login should work and redirect to dashboard

## 🔄 Next Steps

1. **Short-term:** Use demo mode for testing and development
2. **Long-term:** Configure Google Apps Script with proper authentication
3. **Production:** Ensure real backend is properly set up before disabling demo mode

## 📞 Support

If you need help configuring the Google Apps Script backend:

1. Share the current Google Apps Script code
2. Provide the exact error messages from Google Apps Script logs
3. Test the direct connection using the debug tools provided

The Netlify proxy is working correctly - the issue is with the backend authentication logic.