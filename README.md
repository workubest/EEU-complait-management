# EEU Complaint Management System

A comprehensive complaint management system built for Ethiopian Electric Utility (EEU) to handle customer complaints efficiently.

**System Designed by:** WORKU MESAFINT ADDIS [504530]

## 📚 Complete Documentation

**All documentation has been organized in the [`documentation/`](documentation/) folder:**

- **📄 PDF Export**: [`documentation/pdf-export/`](documentation/pdf-export/) - Complete PDF export functionality with 4 complaints per page
- **🔧 Components**: [`documentation/components/`](documentation/components/) - Component API documentation  
- **📄 Pages**: [`documentation/pages/`](documentation/pages/) - Dashboard and page-specific documentation
- **🔧 Backend**: [`documentation/backend/`](documentation/backend/) - API integration and backend setup
- **🚀 Deployment**: [`documentation/deployment/`](documentation/deployment/) - Deployment guides and configurations
- **⭐ Features**: [`documentation/features/`](documentation/features/) - Authentication, user management, and feature fixes
- **🛠️ Troubleshooting**: [`documentation/troubleshooting/`](documentation/troubleshooting/) - Issue resolution guides
- **📋 Complete Index**: [`documentation/INDEX.md`](documentation/INDEX.md) - Full documentation index

### 🚀 Quick Access Links
- **Test PDF Export**: http://localhost:8081/pdf-test (8 complaints → 2 pages)
- **Diagnostic Tools**: http://localhost:8081/pdf-diagnostic (troubleshooting)
- **PDF Issues Help**: [`documentation/troubleshooting/pdf-issues.md`](documentation/troubleshooting/pdf-issues.md)
- **Browser Compatibility**: [`documentation/troubleshooting/browser-compatibility.md`](documentation/troubleshooting/browser-compatibility.md)

## Project Overview

This application provides a complete solution for managing customer complaints with features including:
- User authentication and role-based access control
- Complaint submission and tracking
- Dashboard analytics and reporting
- Multi-language support (English/Amharic)
- Real-time notifications
- Advanced search and filtering

## Technologies Used

This project is built with:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn-ui components
- **State Management**: React Context API
- **Authentication**: JWT-based authentication
- **Charts**: Recharts for analytics
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone https://github.com/workubest/EEU-complait-management.git
cd EEU-complait-management
```

2. Install dependencies:
```sh
npm install
```

3. Start the backend proxy server (in one terminal):
```sh
node server.js
```

4. Start the frontend development server (in another terminal):
```sh
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

### Development Setup

The application uses a two-server architecture:

- **Frontend Server**: Vite development server running on port 8080
- **Backend Proxy**: Express server running on port 3001 that forwards API requests to Google Apps Script

Make sure both servers are running for full functionality.

### Default Login Credentials

For testing purposes, you can use these credentials:
- **Admin**: `admin@eeu.gov.et` / `admin123`
- **Manager**: `manager@eeu.gov.et` / `manager123`
- **Staff**: `staff@eeu.gov.et` / `staff123`
- **Customer**: `customer@eeu.gov.et` / `customer123`

## Features

### User Roles
- **Customer**: Submit and track complaints
- **Staff**: Process and manage complaints
- **Manager**: Oversee operations and view analytics
- **Admin**: Full system administration

### Key Functionality
- Complaint submission with file attachments
- Real-time status tracking
- Advanced search and filtering
- Analytics dashboard with charts
- User management system
- Notification system
- Multi-language support

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── data/               # Mock data and constants
```

## Deployment

The application can be deployed to various platforms:

1. **Netlify**: Automatic deployment from GitHub
2. **Vercel**: Connect your GitHub repository
3. **Traditional hosting**: Build with `npm run build` and serve the `dist` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
