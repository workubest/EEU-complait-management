# 🚀 Netlify Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Environment Configuration
- [ ] `.env.production` file created with correct Google Apps Script URL
- [ ] `VITE_FORCE_DEMO_MODE=false` set in production environment
- [ ] `VITE_FORCE_REAL_BACKEND=true` set in production environment

### 2. Netlify Function Setup
- [ ] `netlify/functions/proxy.js` exists and is properly configured
- [ ] `netlify/functions/test.js` exists for testing
- [ ] `netlify.toml` has correct functions directory configuration

### 3. Frontend Configuration
- [ ] `src/config/environment.ts` uses `/.netlify/functions/proxy` in production
- [ ] `src/lib/api.ts` properly handles Netlify Functions requests
- [ ] All API calls use POST method with JSON body for Netlify Functions

## 🔧 Netlify Dashboard Configuration

### 1. Build Settings
```
Build command: npm run build
Publish directory: dist
Functions directory: netlify/functions
```

### 2. Environment Variables
Set these in Netlify Dashboard → Site Settings → Environment Variables:
```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NODE_ENV=production
VITE_FORCE_DEMO_MODE=false
VITE_FORCE_REAL_BACKEND=true
```

### 3. Build & Deploy Settings
- [ ] Node.js version set to 18 or higher
- [ ] Auto-deploy enabled for main branch
- [ ] Build hooks configured if needed

## 🧪 Testing Checklist

### 1. Local Testing (Before Deploy)
```bash
# Test build process
npm run build

# Test Netlify Functions locally (if using Netlify CLI)
netlify dev

# Run proxy test script
node test-netlify-proxy.js
```

### 2. Production Testing (After Deploy)
- [ ] Open `https://your-site.netlify.app/verify-proxy-setup.html`
- [ ] Run all tests and verify they pass
- [ ] Test login functionality
- [ ] Test dashboard data loading
- [ ] Check browser console for CORS errors (should be none)

### 3. Manual Testing
- [ ] Login with test credentials works
- [ ] Dashboard loads without errors
- [ ] All API calls complete successfully
- [ ] No CORS errors in browser console
- [ ] Network tab shows requests to `/.netlify/functions/proxy`

## 🔍 Troubleshooting Guide

### Common Issues and Solutions

#### 1. Function Not Found (404)
**Problem:** `/.netlify/functions/proxy` returns 404
**Solutions:**
- Check `netlify.toml` has correct functions directory
- Verify `netlify/functions/proxy.js` exists
- Ensure build deployed successfully
- Check Netlify Functions tab in dashboard

#### 2. CORS Errors Still Occurring
**Problem:** Browser shows CORS errors
**Solutions:**
- Verify proxy function sets CORS headers correctly
- Check preflight OPTIONS requests are handled
- Ensure frontend uses correct API base URL
- Test with `verify-proxy-setup.html`

#### 3. Google Apps Script Connection Fails
**Problem:** Proxy can't reach Google Apps Script
**Solutions:**
- Verify `GOOGLE_APPS_SCRIPT_URL` environment variable
- Check Google Apps Script is deployed and accessible
- Test direct connection to Google Apps Script
- Check Google Apps Script logs for errors

#### 4. Environment Variables Not Working
**Problem:** Environment variables not available in functions
**Solutions:**
- Set variables in Netlify Dashboard, not just `.env` files
- Redeploy after setting environment variables
- Check variable names match exactly
- Use `process.env.VARIABLE_NAME` in functions

## 📊 Success Indicators

### ✅ Everything Working Correctly
You should see:

1. **Netlify Functions Tab:** Shows proxy function deployed
2. **Function Logs:** Show successful requests and responses
3. **Browser Console:** No CORS errors
4. **Network Tab:** Requests go to `/.netlify/functions/proxy`
5. **Application:** Login and dashboard work normally

### 🎯 Expected Request Flow
```
Frontend → /.netlify/functions/proxy → Google Apps Script → Response → Frontend
```

### 📝 Log Examples
**Successful Proxy Function Log:**
```
🔄 Netlify Function - Proxy Request
📝 Method: POST
🎯 Action: login
📦 Request Body: {"action":"login","email":"admin@eeu.gov.et","password":"admin123"}
🌐 Final URL: https://script.google.com/macros/s/.../exec
📥 Google Apps Script Response Status: 200
✅ Google Apps Script Response: {"success":true,"data":{"user":{...}}}
```

**Successful Frontend Console:**
```
🚀 API Service initialized
📡 Backend URL: /.netlify/functions/proxy
Making POST request to Netlify Functions: /.netlify/functions/proxy?action=login
Request body: {"action":"login","email":"admin@eeu.gov.et","password":"admin123"}
Response received: {"success":true,"data":{"user":{...}}}
```

## 🚀 Final Deployment Steps

### 1. Pre-Deploy
```bash
# Ensure all changes are committed
git add .
git commit -m "Configure Netlify proxy for CORS fix"
git push origin main
```

### 2. Deploy
- Push to main branch (auto-deploy) OR
- Manual deploy via Netlify Dashboard

### 3. Post-Deploy Verification
1. Visit: `https://your-site.netlify.app/verify-proxy-setup.html`
2. Run all tests
3. Verify login functionality
4. Check application works end-to-end

### 4. Monitor
- Check Netlify Functions logs for any errors
- Monitor application performance
- Watch for any CORS-related issues

## 🎉 Success!

When everything is working correctly:
- ✅ No CORS errors in browser
- ✅ All API calls go through Netlify Functions
- ✅ Google Apps Script receives requests properly
- ✅ Users can login and use the application
- ✅ Dashboard loads data successfully

The Netlify proxy setup is complete and your application is ready for production use!