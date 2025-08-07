// Environment configuration for different deployment scenarios

export interface EnvironmentConfig {
  apiBaseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  googleAppsScriptUrl: string;
}

// Google Apps Script URL - update this with your own deployment URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6Do0ky06Pm6OtY62iTOuSWABmZsQAVdqtaXN27SQb8Hgtv_JqVuMPNdXKh-fW5bU/exec';

// Detect environment
const isProduction = import.meta.env.PROD || !window.location.hostname.includes('localhost');
const isDevelopment = !isProduction;

// Environment-specific configuration
export const environment: EnvironmentConfig = {
  isProduction,
  isDevelopment,
  googleAppsScriptUrl: GOOGLE_APPS_SCRIPT_URL,
  apiBaseUrl: isProduction ? GOOGLE_APPS_SCRIPT_URL : '/api'
};

// Debug logging in development
if (isDevelopment) {
  console.log('🔧 Development Environment Detected');
  console.log('📡 API Base URL:', environment.apiBaseUrl);
} else {
  console.log('🚀 Production Environment Detected');
  console.log('📡 API Base URL:', environment.apiBaseUrl);
}

export default environment;