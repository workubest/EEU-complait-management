# Deployment Guide

This document provides instructions for deploying the EEU Complaint Management System to various platforms.

## Development Environment

### Local Development Setup

1. **Start Backend Server**:
   ```bash
   node server.js
   ```
   This starts the Express proxy server on port 3001.

2. **Start Frontend Server**:
   ```bash
   npm run dev
   ```
   This starts the Vite development server on port 8080.

3. **Access Application**:
   Open `http://localhost:8080` in your browser.

## Production Deployment

### Option 1: Netlify Deployment

The project includes a `netlify.toml` configuration file for easy deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy automatically on push to main branch

### Option 2: Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 3: Traditional Web Hosting

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your web server.

3. **Configure server** to serve `index.html` for all routes (SPA routing).

## Backend Configuration

### Google Apps Script Setup

The application uses Google Apps Script as the backend. The script URL is configured in:
- `server.js` (line 19)
- `vite.config.ts` (line 30)

To use your own Google Apps Script:

1. Create a new Google Apps Script project
2. Deploy it as a web app with public access
3. Update the URL in both configuration files
4. Redeploy the application

### Environment Variables

For production deployment, you may want to use environment variables:

```bash
# .env
VITE_BACKEND_API_URL=your_google_apps_script_url
PORT=3001
```

## Server Requirements

### Minimum Requirements
- Node.js 16+
- 512MB RAM
- 1GB storage

### Recommended Requirements
- Node.js 18+
- 1GB RAM
- 2GB storage
- SSL certificate for HTTPS

## Monitoring and Maintenance

### Health Checks
The application includes a health check endpoint:
```
GET /api?action=healthCheck
```

### Logs
Monitor server logs for:
- API request errors
- Authentication failures
- Performance issues

### Updates
To update the application:
1. Pull latest changes from GitHub
2. Run `npm install` for new dependencies
3. Restart both servers
4. Clear browser cache if needed

## Troubleshooting

### Common Issues

1. **API 500 Errors**:
   - Ensure backend server is running on port 3001
   - Check Google Apps Script URL is accessible
   - Verify CORS settings

2. **Build Failures**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Routing Issues**:
   - Ensure server is configured for SPA routing
   - Check `_redirects` file for Netlify deployment

### Support
For technical support, please create an issue in the GitHub repository.