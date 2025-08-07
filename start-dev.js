#!/usr/bin/env node

/**
 * Development server starter script
 * Starts both the backend proxy server and frontend development server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting EEU Complaint Management System...\n');

// Start backend server
console.log('📡 Starting backend proxy server...');
const backendServer = spawn('node', ['server.js'], {
  stdio: 'pipe',
  cwd: process.cwd()
});

backendServer.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backendServer.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Wait a moment for backend to start, then start frontend
setTimeout(() => {
  console.log('🎨 Starting frontend development server...');
  const frontendServer = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    cwd: process.cwd(),
    shell: true
  });

  frontendServer.stdout.on('data', (data) => {
    console.log(`[Frontend] ${data.toString().trim()}`);
  });

  frontendServer.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data.toString().trim()}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backendServer.kill();
    frontendServer.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    backendServer.kill();
    frontendServer.kill();
    process.exit(0);
  });

}, 2000);

console.log('\n✅ Both servers starting...');
console.log('📱 Frontend will be available at: http://localhost:8080');
console.log('🔧 Backend proxy running on: http://localhost:3001');
console.log('\n💡 Press Ctrl+C to stop both servers\n');