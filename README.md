# EEU Complaint Management System

A comprehensive complaint management system built for Ethiopian Electric Utility (EEU) to handle customer complaints efficiently.

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

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

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
