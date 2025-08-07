# Netlify Deployment Guide

This guide will help you deploy the EEU Complaint Management System to Netlify with live Google Apps Script integration.

## Prerequisites

1. **Google Apps Script Setup**: Ensure your Google Apps Script is deployed and accessible
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **GitHub Repository**: Your code should be pushed to GitHub

## Deployment Steps

### Step 1: Configure Google Apps Script

1. Open your Google Apps Script project
2. Click **Deploy** → **New Deployment**
3. Choose **Web app** as the type
4. Set **Execute as**: Me (your email)
5. Set **Who has access**: Anyone
6. Click **Deploy**
7. Copy the **Web app URL** (it should look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

### Step 2: Update Configuration

Update the Google Apps Script URL in your code:

1. Open `src/config/environment.ts`
2. Replace the `GOOGLE_APPS_SCRIPT_URL` with your actual deployment URL:

```typescript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec';
```

### Step 3: Deploy to Netlify

#### Option A: Automatic Deployment (Recommended)

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click **New site from Git**
   - Choose **GitHub** and authorize Netlify
   - Select your repository: `workubest/EEU-complait-management`

2. **Configure Build Settings**:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Deploy**:
   - Click **Deploy site**
   - Netlify will automatically build and deploy your site
   - You'll get a random URL like `https://amazing-name-123456.netlify.app`

#### Option B: Manual Deployment

1. **Build Locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Drag and drop the `dist` folder to the deploy area

### Step 4: Configure Custom Domain (Optional)

1. In Netlify Dashboard, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow the DNS configuration instructions

### Step 5: Environment Variables (If Needed)

If you want to use environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add variables:
   - `VITE_GOOGLE_APPS_SCRIPT_URL`: Your Google Apps Script URL
   - `VITE_ENVIRONMENT`: `production`

## Verification

After deployment:

1. **Visit your site** at the provided Netlify URL
2. **Test the login** functionality
3. **Check browser console** for any errors
4. **Verify API calls** are going to your Google Apps Script

## Troubleshooting

### Common Issues

1. **404 API Errors**:
   - Ensure Google Apps Script URL is correct in `src/config/environment.ts`
   - Verify Google Apps Script is deployed with public access

2. **CORS Errors**:
   - Google Apps Script should handle CORS automatically
   - Ensure your script includes proper CORS headers

3. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility (use Node 18+)

4. **Routing Issues**:
   - The `_redirects` file should handle SPA routing
   - Verify it contains: `/* /index.html 200`

### Debug Steps

1. **Check Build Logs**:
   - Go to **Site overview** → **Production deploys**
   - Click on the latest deploy to see build logs

2. **Check Function Logs** (if using Netlify Functions):
   - Go to **Functions** tab in Netlify Dashboard

3. **Test API Directly**:
   - Open browser console on your deployed site
   - Check network tab for API requests
   - Verify requests are going to Google Apps Script

## Performance Optimization

1. **Enable Asset Optimization**:
   - Go to **Site settings** → **Build & deploy** → **Post processing**
   - Enable **Bundle optimization** and **Image optimization**

2. **Configure Caching**:
   - Add custom headers in `netlify.toml` for better caching

## Security

1. **HTTPS**: Netlify provides HTTPS by default
2. **Environment Variables**: Use Netlify's environment variables for sensitive data
3. **Access Control**: Configure Google Apps Script permissions appropriately

## Monitoring

1. **Analytics**: Enable Netlify Analytics for traffic insights
2. **Error Tracking**: Monitor browser console for JavaScript errors
3. **Performance**: Use Lighthouse to check performance scores

## Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Google Apps Script Docs**: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Project Issues**: Create issues in the GitHub repository