---
description: Repository Information Overview
alwaysApply: true
---

# EEU Complaint Management System Information

## Summary
A comprehensive complaint management system built for Ethiopian Electric Utility (EEU) to handle customer complaints efficiently. The system provides features including user authentication, complaint submission and tracking, dashboard analytics, multi-language support, real-time notifications, and advanced search functionality.

## Structure
- **src/**: Main application source code (React components, contexts, hooks, utilities)
- **public/**: Static assets and public files
- **netlify/**: Netlify serverless functions for backend proxy
- **script/**: Google Apps Script backend code
- **documentation/**: Comprehensive project documentation
- **migration-data/**: Data migration scripts and CSV files

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.9.2, Node.js 18+
**Build System**: Vite 5.4.1
**Package Manager**: npm/bun

## Dependencies
**Main Dependencies**:
- React 18.3.1 with React Router 6.26.2
- Tailwind CSS with shadcn-ui components
- Radix UI component primitives
- React Hook Form 7.53.0 with Zod validation
- Recharts for analytics dashboards
- Express 5.1.0 for backend proxy
- jspdf 3.0.1 for PDF generation

**Development Dependencies**:
- TypeScript 5.9.2
- Vite 5.4.1 with SWC plugin
- ESLint 9.9.0
- Tailwind CSS 3.4.11
- PostCSS 8.4.47

## Build & Installation
```bash
# Install dependencies
npm install

# Start backend proxy server
node server.js

# Start development server
npm run dev

# Build for production
npm run build
```

## Backend Integration
**Backend Type**: Google Apps Script
**Data Storage**: Google Sheets
**API Proxy**: Express server (development) and Netlify Functions (production)
**Authentication**: Custom JWT-based authentication

## Deployment
**Platform**: Netlify
**Build Command**: `npm run build`
**Publish Directory**: `dist`
**Functions Directory**: `netlify/functions`
**Node Version**: 18

## Testing
**Test Commands**:
```bash
# Test proxy connection
npm run test:proxy

# Test live data connection
npm run test:live-data
```

## Key Features
- Multi-language support (English/Amharic)
- Role-based access control (Customer, Staff, Manager, Admin)
- Complaint submission with file attachments
- Real-time status tracking
- Analytics dashboard with charts
- PDF export functionality
- User management system