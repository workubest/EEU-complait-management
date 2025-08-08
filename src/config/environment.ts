// Environment configuration for different deployment scenarios

export interface EnvironmentConfig {
  apiBaseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  googleAppsScriptUrl: string;
  forceRealBackend: boolean;
}

// Google Apps Script URL - update this with your own deployment URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec';

// Detect environment
const isProduction = import.meta.env.PROD || !window.location.hostname.includes('localhost');
const isDevelopment = !isProduction;

// Check if we should force real backend in development (set VITE_FORCE_REAL_BACKEND=true)
const forceRealBackend = import.meta.env.VITE_FORCE_REAL_BACKEND === 'true';

// Environment-specific configuration
export const environment: EnvironmentConfig = {
  isProduction,
  isDevelopment,
  googleAppsScriptUrl: GOOGLE_APPS_SCRIPT_URL,
  // Use Netlify Functions proxy in production, local proxy in development
  apiBaseUrl: isProduction ? '/.netlify/functions/proxy' : (forceRealBackend ? GOOGLE_APPS_SCRIPT_URL : '/api'),
  forceRealBackend
};

// Debug logging in development
if (isDevelopment) {
  console.log('🔧 Development Environment Detected');
  console.log('📡 API Base URL:', environment.apiBaseUrl);
  console.log('🔗 Force Real Backend:', forceRealBackend);
  if (!forceRealBackend) {
    console.log('ℹ️  To use real backend in development, set VITE_FORCE_REAL_BACKEND=true');
  }
} else {
  console.log('🚀 Production Environment Detected');
  console.log('📡 API Base URL:', environment.apiBaseUrl);
}

export default environment;