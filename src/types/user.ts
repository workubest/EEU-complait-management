export type UserRole = 'admin' | 'manager' | 'foreman' | 'call-attendant' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region: string;
  serviceCenter?: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface RolePermissions {
  complaints: Permission;
  users: Permission;
  reports: Permission;
  settings: Permission;
  canAssignComplaint: boolean;
  canSetHighPriority: boolean;
  accessibleRegions: string[] | 'all';
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    complaints: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true },
    settings: { create: true, read: true, update: true, delete: true },
    canAssignComplaint: true,
    canSetHighPriority: true,
    accessibleRegions: 'all'
  },
  manager: {
    complaints: { create: true, read: true, update: true, delete: false },
    users: { create: false, read: true, update: true, delete: false },
    reports: { create: true, read: true, update: true, delete: false },
    settings: { create: false, read: true, update: false, delete: false },
    canAssignComplaint: true,
    canSetHighPriority: true,
    accessibleRegions: 'all'
  },
  foreman: {
    complaints: { create: true, read: true, update: true, delete: false },
    users: { create: false, read: true, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
    canAssignComplaint: true,
    canSetHighPriority: true,
    accessibleRegions: 'all' // Foreman can access all regions in their area
  },
  'call-attendant': {
    complaints: { create: true, read: true, update: true, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
    canAssignComplaint: false,
    canSetHighPriority: false,
    accessibleRegions: 'all'
  },
  technician: {
    complaints: { create: false, read: true, update: true, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
    canAssignComplaint: false,
    canSetHighPriority: false,
    accessibleRegions: 'all' // Technician can access all regions for field work
  }
};

export const ETHIOPIAN_REGIONS = [
  'North Addis Ababa Region',
  'South Addis Ababa Region',
  'East Addis Ababa Region',
  'West Addis Ababa Region'
];

export const SERVICE_CENTERS = {
  'North Addis Ababa Region': [
    'NAAR No.1',
    'NAAR No.2',
    'NAAR No.3',
    'NAAR No.4',
    'NAAR No.5',
    'NAAR No.6',
    'NAAR No.7'
  ],
  'South Addis Ababa Region': [
    'SAAR No.1',
    'SAAR No.2',
    'SAAR No.3',
    'SAAR No.4',
    'SAAR No.5',
    'SAAR No.6',
    'SAAR No.7',
    'SAAR No.8'
  ],
  'East Addis Ababa Region': [
    'EAAR No.1',
    'EAAR No.2',
    'EAAR No.3',
    'EAAR No.4',
    'EAAR No.5',
    'EAAR No.6',
    'EAAR No.7',
    'EAAR No.8'
  ],
  'West Addis Ababa Region': [
    'WAAR No.1',
    'WAAR No.2',
    'WAAR No.3',
    'WAAR No.4',
    'WAAR No.5',
    'WAAR No.6',
    'WAAR No.7'
  ]
};