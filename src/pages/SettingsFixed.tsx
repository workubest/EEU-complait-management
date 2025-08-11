import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Clock,
  Database,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Zap,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Plus,
  X,
  Server,
  Monitor,
  Smartphone,
  Wifi,
  HardDrive,
  Activity,
  BarChart3
} from 'lucide-react';

interface SystemSettings {
  // Company Information
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  website: string;
  logo: string;
  timezone: string;
  language: string;
  currency: string;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notificationSound: boolean;
  emailTemplates: {
    welcome: string;
    passwordReset: string;
    complaintUpdate: string;
    complaintResolved: string;
  };
  
  // Security
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactorAuth: boolean;
  loginAttempts: number;
  lockoutDuration: number;
  
  // Workflow
  autoAssignment: boolean;
  escalationRules: {
    enabled: boolean;
    highPriorityHours: number;
    criticalPriorityHours: number;
  };
  approvalWorkflow: boolean;
  complaintCategories: string[];
  priorities: string[];
  statuses: string[];
  
  // System
  maintenanceMode: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  backupFrequency: string;
  logLevel: string;
  refreshInterval: number;
  dataRetentionDays: number;
  
  // Working Hours & Holidays
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  holidays: Array<{
    date: string;
    name: string;
    recurring: boolean;
  }>;
  
  // Regional Settings
  regions: string[];
  serviceAreas: Array<{
    name: string;
    code: string;
    manager: string;
  }>;
  
  // Integration Settings
  apiSettings: {
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
  };
  
  // Performance & Monitoring
  performanceMetrics: boolean;
  errorReporting: boolean;
  analyticsEnabled: boolean;
}

interface PermissionMatrix {
  [role: string]: {
    [resource: string]: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
}

export function Settings() {
  const { permissions, role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const [settings, setSettings] = useState<SystemSettings>({
    // Company Information
    companyName: 'Ethiopian Electric Utility',
    supportEmail: 'support@eeu.gov.et',
    supportPhone: '+251-11-123-4567',
    address: 'Addis Ababa, Ethiopia',
    website: 'https://www.eeu.gov.et',
    logo: '',
    timezone: 'Africa/Addis_Ababa',
    language: language,
    currency: 'ETB',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationSound: true,
    emailTemplates: {
      welcome: 'Welcome to EEU Complaint Management System',
      passwordReset: 'Your password has been reset successfully',
      complaintUpdate: 'Your complaint has been updated',
      complaintResolved: 'Your complaint has been resolved'
    },
    
    // Security
    sessionTimeout: 60,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      expiryDays: 90
    },
    twoFactorAuth: false,
    loginAttempts: 5,
    lockoutDuration: 30,
    
    // Workflow
    autoAssignment: true,
    escalationRules: {
      enabled: true,
      highPriorityHours: 24,
      criticalPriorityHours: 4
    },
    approvalWorkflow: false,
    complaintCategories: ['Power Outage', 'Billing Issue', 'Technical Problem', 'Service Request', 'Complaint', 'Other'],
    priorities: ['Low', 'Medium', 'High', 'Critical'],
    statuses: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
    
    // System
    maintenanceMode: false,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    backupFrequency: 'daily',
    logLevel: 'info',
    refreshInterval: 30,
    dataRetentionDays: 365,
    
    // Working Hours & Holidays
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    holidays: [],
    
    // Regional Settings
    regions: ['Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'SNNP', 'Somali', 'Afar', 'Benishangul-Gumuz', 'Gambela', 'Harari', 'Dire Dawa'],
    serviceAreas: [
      { name: 'Central Addis', code: 'CA', manager: 'John Doe' },
      { name: 'East Addis', code: 'EA', manager: 'Jane Smith' },
      { name: 'West Addis', code: 'WA', manager: 'Bob Johnson' }
    ],
    
    // Integration Settings
    apiSettings: {
      rateLimit: 1000,
      timeout: 30,
      retryAttempts: 3
    },
    
    // Performance & Monitoring
    performanceMetrics: true,
    errorReporting: true,
    analyticsEnabled: true
  });

  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix>({});
  const [permissionsDirty, setPermissionsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '', recurring: false });
  const [newServiceArea, setNewServiceArea] = useState({ name: '', code: '', manager: '' });
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false);

  // Load settings and permissions on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch settings
        const settingsResult = await apiService.getSettings();
        if (settingsResult.success && settingsResult.data) {
          // Merge with default settings to ensure all properties exist
          setSettings(prev => ({ ...prev, ...settingsResult.data }));
        }

        // Fetch permission matrix
        const permissionsResult = await apiService.getPermissionMatrix();
        if (permissionsResult.success && permissionsResult.data) {
          setPermissionMatrix(permissionsResult.data);
        } else {
          // Initialize with default permissions if none exist
          initializeDefaultPermissions();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load settings and permissions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initializeDefaultPermissions = () => {
    const defaultMatrix: PermissionMatrix = {
      admin: {
        complaints: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
        reports: { create: true, read: true, update: true, delete: true },
        analytics: { create: true, read: true, update: true, delete: true },
        settings: { create: true, read: true, update: true, delete: true }
      },
      manager: {
        complaints: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: true, update: true, delete: false },
        reports: { create: true, read: true, update: true, delete: false },
        analytics: { create: false, read: true, update: false, delete: false },
        settings: { create: false, read: true, update: false, delete: false }
      },
      foreman: {
        complaints: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: true, update: false, delete: false },
        reports: { create: false, read: true, update: false, delete: false },
        analytics: { create: false, read: true, update: false, delete: false },
        settings: { create: false, read: true, update: false, delete: false }
      },
      'call-attendant': {
        complaints: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        reports: { create: false, read: false, update: false, delete: false },
        analytics: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false }
      },
      technician: {
        complaints: { create: false, read: true, update: true, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        reports: { create: false, read: false, update: false, delete: false },
        analytics: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false }
      }
    };
    setPermissionMatrix(defaultMatrix);
  };

  const validateSettings = (): boolean => {
    if (!settings.companyName?.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required.",
        variant: "destructive"
      });
      return false;
    }

    if (!settings.supportEmail?.trim() || !settings.supportEmail.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Valid support email is required.",
        variant: "destructive"
      });
      return false;
    }

    if (!settings.supportPhone?.trim()) {
      toast({
        title: "Validation Error",
        description: "Support phone is required.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleWorkingHoursChange = (field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [field]: value }
    }));
    setIsDirty(true);
  };

  const handlePasswordPolicyChange = (field: keyof SystemSettings['passwordPolicy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      passwordPolicy: { ...prev.passwordPolicy, [field]: value }
    }));
    setIsDirty(true);
  };

  const handleEscalationRulesChange = (field: keyof SystemSettings['escalationRules'], value: any) => {
    setSettings(prev => ({
      ...prev,
      escalationRules: { ...prev.escalationRules, [field]: value }
    }));
    setIsDirty(true);
  };

  const handleApiSettingsChange = (field: keyof SystemSettings['apiSettings'], value: any) => {
    setSettings(prev => ({
      ...prev,
      apiSettings: { ...prev.apiSettings, [field]: value }
    }));
    setIsDirty(true);
  };

  const handleEmailTemplateChange = (field: keyof SystemSettings['emailTemplates'], value: string) => {
    setSettings(prev => ({
      ...prev,
      emailTemplates: { ...prev.emailTemplates, [field]: value }
    }));
    setIsDirty(true);
  };

  const handleLanguageChange = (value: string) => {
    // Update both the settings state and the language context
    handleSettingChange('language', value);
    setLanguage(value as 'en' | 'am');
    
    toast({
      title: value === 'am' ? 'ቋንቋ ተቀይሯል' : 'Language Changed',
      description: value === 'am' 
        ? 'የሲስተም ቋንቋ ወደ አማርኛ ተቀይሯል' 
        : 'System language changed to English',
    });
  };

  const addHoliday = () => {
    if (newHoliday.date && newHoliday.name) {
      setSettings(prev => ({
        ...prev,
        holidays: [...prev.holidays, newHoliday]
      }));
      setNewHoliday({ date: '', name: '', recurring: false });
      setIsDirty(true);
    }
  };

  const removeHoliday = (index: number) => {
    setSettings(prev => ({
      ...prev,
      holidays: prev.holidays.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const addServiceArea = () => {
    if (newServiceArea.name && newServiceArea.code && newServiceArea.manager) {
      setSettings(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newServiceArea]
      }));
      setNewServiceArea({ name: '', code: '', manager: '' });
      setIsDirty(true);
    }
  };

  const removeServiceArea = (index: number) => {
    setSettings(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const addArrayItem = (field: keyof SystemSettings, value: string) => {
    if (value.trim()) {
      setSettings(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setIsDirty(true);
    }
  };

  const removeArrayItem = (field: keyof SystemSettings, index: number) => {
    setSettings(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSaveSettings = async () => {
    if (!validateSettings()) return;

    try {
      setLoading(true);
      const result = await apiService.updateSettings(settings);
      
      if (result.success) {
        setIsDirty(false);
        toast({
          title: "Settings Saved",
          description: "System settings have been updated successfully.",
        });
      } else {
        throw new Error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = async () => {
    try {
      setLoading(true);
      // Fetch fresh settings from server
      const result = await apiService.getSettings();
      if (result.success && result.data) {
        setSettings(prev => ({ ...prev, ...result.data }));
        setIsDirty(false);
        toast({
          title: "Settings Reset",
          description: "Settings have been reset to server values.",
        });
      }
    } catch (error) {
      // Reset to default values if server fetch fails
      setSettings({
        // Company Information
        companyName: 'Ethiopian Electric Utility',
        supportEmail: 'support@eeu.gov.et',
        supportPhone: '+251-11-123-4567',
        address: 'Addis Ababa, Ethiopia',
        website: 'https://www.eeu.gov.et',
        logo: '',
        timezone: 'Africa/Addis_Ababa',
        language: 'en',
        currency: 'ETB',
        
        // Notifications
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notificationSound: true,
        emailTemplates: {
          welcome: 'Welcome to EEU Complaint Management System',
          passwordReset: 'Your password has been reset successfully',
          complaintUpdate: 'Your complaint has been updated',
          complaintResolved: 'Your complaint has been resolved'
        },
        
        // Security
        sessionTimeout: 60,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
          expiryDays: 90
        },
        twoFactorAuth: false,
        loginAttempts: 5,
        lockoutDuration: 30,
        
        // Workflow
        autoAssignment: true,
        escalationRules: {
          enabled: true,
          highPriorityHours: 24,
          criticalPriorityHours: 4
        },
        approvalWorkflow: false,
        complaintCategories: ['Power Outage', 'Billing Issue', 'Technical Problem', 'Service Request', 'Complaint', 'Other'],
        priorities: ['Low', 'Medium', 'High', 'Critical'],
        statuses: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
        
        // System
        maintenanceMode: false,
        maxFileSize: 10,
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
        backupFrequency: 'daily',
        logLevel: 'info',
        refreshInterval: 30,
        dataRetentionDays: 365,
        
        // Working Hours & Holidays
        workingHours: {
          start: '08:00',
          end: '17:00'
        },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        holidays: [],
        
        // Regional Settings
        regions: ['Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'SNNP', 'Somali', 'Afar', 'Benishangul-Gumuz', 'Gambela', 'Harari', 'Dire Dawa'],
        serviceAreas: [
          { name: 'Central Addis', code: 'CA', manager: 'John Doe' },
          { name: 'East Addis', code: 'EA', manager: 'Jane Smith' },
          { name: 'West Addis', code: 'WA', manager: 'Bob Johnson' }
        ],
        
        // Integration Settings
        apiSettings: {
          rateLimit: 1000,
          timeout: 30,
          retryAttempts: 3
        },
        
        // Performance & Monitoring
        performanceMetrics: true,
        errorReporting: true,
        analyticsEnabled: true
      });
      setIsDirty(false);
      toast({
        title: "Settings Reset",
        description: "Settings have been reset to default values.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading settings...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure system preferences and company information
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isDirty && (
            <Badge variant="outline" className="bg-warning/10 text-warning">
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleResetSettings}
            disabled={loading || !permissions.settings?.update}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Settings
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={loading || !isDirty || !permissions.settings?.update}
            className="bg-gradient-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Workflow</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Company Information */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>{t('settings.company_info')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    {t('settings.company_name')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={settings.companyName || ''}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                    disabled={!permissions.settings?.update}
                    className={!settings.companyName?.trim() ? 'border-destructive' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">{t('settings.website')}</Label>
                  <Input
                    id="website"
                    type="url"
                    value={settings.website || ''}
                    onChange={(e) => handleSettingChange('website', e.target.value)}
                    disabled={!permissions.settings?.update}
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">
                    {t('settings.support_email')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail || ''}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                    disabled={!permissions.settings?.update}
                    className={!settings.supportEmail?.trim() || !settings.supportEmail.includes('@') ? 'border-destructive' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">
                    {t('settings.support_phone')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone || ''}
                    onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                    disabled={!permissions.settings?.update}
                    className={!settings.supportPhone?.trim() ? 'border-destructive' : ''}
                    placeholder="+251-XX-XXX-XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('settings.timezone')}</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleSettingChange('timezone', value)}
                    disabled={!permissions.settings?.update}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Addis_Ababa">Africa/Addis_Ababa</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('settings.currency')}</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleSettingChange('currency', value)}
                    disabled={!permissions.settings?.update}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">Ethiopian Birr (ETB)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Language & Localization Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings.system_language')}</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleLanguageChange(value)}
                    disabled={!permissions.settings?.update}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="am">🇪🇹 አማርኛ (Amharic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.language_preview')}</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="text-sm font-medium">
                      {settings.language === 'am' ? 'የኢትዮጵያ ኤሌክትሪክ ኃይል ኮርፖሬሽን' : 'Ethiopian Electric Utility Corporation'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {settings.language === 'am' ? 'የቅሬታ ማስተዳደሪያ ስርዓት' : 'Complaint Management System'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t('settings.address')}</Label>
                <Textarea
                  id="address"
                  value={settings.address || ''}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                  disabled={!permissions.settings?.update}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{t('settings.working_hours')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingHoursStart">{t('settings.start_time')}</Label>
                  <Input
                    id="workingHoursStart"
                    type="time"
                    value={settings.workingHours?.start || '08:00'}
                    onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                    disabled={!permissions.settings?.update}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHoursEnd">{t('settings.end_time')}</Label>
                  <Input
                    id="workingHoursEnd"
                    type="time"
                    value={settings.workingHours?.end || '17:00'}
                    onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                    disabled={!permissions.settings?.update}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t('settings.working_days')}</Label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <Badge
                      key={day}
                      variant={settings.workingDays.includes(day) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (!permissions.settings?.update) return;
                        const newWorkingDays = settings.workingDays.includes(day)
                          ? settings.workingDays.filter(d => d !== day)
                          : [...settings.workingDays, day];
                        handleSettingChange('workingDays', newWorkingDays);
                      }}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Holidays</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                    disabled={!permissions.settings?.update}
                  />
                  <Input
                    placeholder="Holiday name"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!permissions.settings?.update}
                  />
                  <Button
                    onClick={addHoliday}
                    disabled={!permissions.settings?.update || !newHoliday.date || !newHoliday.name}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Button>
                </div>
                <div className="space-y-2">
                  {settings.holidays.map((holiday, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{holiday.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">{holiday.date}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHoliday(index)}
                        disabled={!permissions.settings?.update}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send SMS notifications for critical alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send push notifications to mobile devices
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notification Sound</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound for new notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationSound}
                      onCheckedChange={(checked) => handleSettingChange('notificationSound', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeTemplate">Welcome Email</Label>
                    <Textarea
                      id="welcomeTemplate"
                      value={settings.emailTemplates.welcome}
                      onChange={(e) => handleEmailTemplateChange('welcome', e.target.value)}
                      disabled={!permissions.settings?.update}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordResetTemplate">Password Reset Email</Label>
                    <Textarea
                      id="passwordResetTemplate"
                      value={settings.emailTemplates.passwordReset}
                      onChange={(e) => handleEmailTemplateChange('passwordReset', e.target.value)}
                      disabled={!permissions.settings?.update}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complaintUpdateTemplate">Complaint Update Email</Label>
                    <Textarea
                      id="complaintUpdateTemplate"
                      value={settings.emailTemplates.complaintUpdate}
                      onChange={(e) => handleEmailTemplateChange('complaintUpdate', e.target.value)}
                      disabled={!permissions.settings?.update}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complaintResolvedTemplate">Complaint Resolved Email</Label>
                    <Textarea
                      id="complaintResolvedTemplate"
                      value={settings.emailTemplates.complaintResolved}
                      onChange={(e) => handleEmailTemplateChange('complaintResolved', e.target.value)}
                      disabled={!permissions.settings?.update}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value) || 60)}
                      disabled={!permissions.settings?.update}
                      min="5"
                      max="480"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={settings.loginAttempts}
                      onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value) || 5)}
                      disabled={!permissions.settings?.update}
                      min="3"
                      max="10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={settings.lockoutDuration}
                      onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value) || 30)}
                      disabled={!permissions.settings?.update}
                      min="5"
                      max="1440"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all users
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Password Policy</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordPolicy(!showPasswordPolicy)}
                    >
                      {showPasswordPolicy ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {showPasswordPolicy && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="minLength">Minimum Length</Label>
                        <Input
                          id="minLength"
                          type="number"
                          value={settings.passwordPolicy.minLength}
                          onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value) || 8)}
                          disabled={!permissions.settings?.update}
                          min="6"
                          max="32"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiryDays">Password Expiry (days)</Label>
                        <Input
                          id="expiryDays"
                          type="number"
                          value={settings.passwordPolicy.expiryDays}
                          onChange={(e) => handlePasswordPolicyChange('expiryDays', parseInt(e.target.value) || 90)}
                          disabled={!permissions.settings?.update}
                          min="30"
                          max="365"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Require Uppercase</Label>
                          <Switch
                            checked={settings.passwordPolicy.requireUppercase}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requireUppercase', checked)}
                            disabled={!permissions.settings?.update}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Require Lowercase</Label>
                          <Switch
                            checked={settings.passwordPolicy.requireLowercase}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requireLowercase', checked)}
                            disabled={!permissions.settings?.update}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Require Numbers</Label>
                          <Switch
                            checked={settings.passwordPolicy.requireNumbers}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requireNumbers', checked)}
                            disabled={!permissions.settings?.update}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Require Special Characters</Label>
                          <Switch
                            checked={settings.passwordPolicy.requireSpecialChars}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requireSpecialChars', checked)}
                            disabled={!permissions.settings?.update}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Workflow Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Assignment</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically assign complaints to available technicians
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoAssignment}
                      onCheckedChange={(checked) => handleSettingChange('autoAssignment', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Approval Workflow</Label>
                      <p className="text-sm text-muted-foreground">
                        Require approval for certain actions
                      </p>
                    </div>
                    <Switch
                      checked={settings.approvalWorkflow}
                      onCheckedChange={(checked) => handleSettingChange('approvalWorkflow', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Escalation Rules</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable automatic escalation based on priority
                      </p>
                    </div>
                    <Switch
                      checked={settings.escalationRules.enabled}
                      onCheckedChange={(checked) => handleEscalationRulesChange('enabled', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="highPriorityHours">High Priority Escalation (hours)</Label>
                    <Input
                      id="highPriorityHours"
                      type="number"
                      value={settings.escalationRules.highPriorityHours}
                      onChange={(e) => handleEscalationRulesChange('highPriorityHours', parseInt(e.target.value) || 24)}
                      disabled={!permissions.settings?.update || !settings.escalationRules.enabled}
                      min="1"
                      max="168"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="criticalPriorityHours">Critical Priority Escalation (hours)</Label>
                    <Input
                      id="criticalPriorityHours"
                      type="number"
                      value={settings.escalationRules.criticalPriorityHours}
                      onChange={(e) => handleEscalationRulesChange('criticalPriorityHours', parseInt(e.target.value) || 4)}
                      disabled={!permissions.settings?.update || !settings.escalationRules.enabled}
                      min="1"
                      max="24"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Categories & Priorities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Complaint Categories</Label>
                    <div className="space-y-2">
                      {settings.complaintCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{category}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('complaintCategories', index)}
                            disabled={!permissions.settings?.update}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="New category"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('complaintCategories', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          disabled={!permissions.settings?.update}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority Levels</Label>
                    <div className="space-y-2">
                      {settings.priorities.map((priority, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{priority}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('priorities', index)}
                            disabled={!permissions.settings?.update}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="New priority"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('priorities', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          disabled={!permissions.settings?.update}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Role Permissions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="space-y-1">
                    <h3 className="font-semibold">Advanced Permission Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure detailed CRUD permissions for each role and resource with our comprehensive permission matrix.
                    </p>
                  </div>
                  <Button
                    onClick={() => window.location.href = '/permissions'}
                    className="bg-gradient-primary"
                    disabled={!permissions.settings?.update}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Current Features</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>Role-based access control</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>Resource-level permissions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>CRUD operation controls</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>Permission inheritance</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span>Available Resources</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>User Management</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FileText className="h-3 w-3" />
                        <span>Complaints & Tickets</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <BarChart3 className="h-3 w-3" />
                        <span>Reports & Analytics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Settings className="h-3 w-3" />
                        <span>System Settings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Bell className="h-3 w-3" />
                        <span>Notifications</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Permission Management Tips</p>
                      <p className="text-xs text-muted-foreground">
                        Use the dedicated Permission Management page to configure granular access controls. 
                        You can set Create, Read, Update, and Delete permissions for each role across all system resources.
                        Changes take effect immediately and are applied to all users with the respective roles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>System Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable maintenance mode to restrict access
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value) || 10)}
                      disabled={!permissions.settings?.update}
                      min="1"
                      max="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                    <Input
                      id="refreshInterval"
                      type="number"
                      value={settings.refreshInterval}
                      onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value) || 30)}
                      disabled={!permissions.settings?.update}
                      min="10"
                      max="300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
                    <Input
                      id="dataRetentionDays"
                      type="number"
                      value={settings.dataRetentionDays}
                      onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value) || 365)}
                      disabled={!permissions.settings?.update}
                      min="30"
                      max="3650"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleSettingChange('backupFrequency', value)}
                      disabled={!permissions.settings?.update}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select
                      value={settings.logLevel}
                      onValueChange={(value) => handleSettingChange('logLevel', value)}
                      disabled={!permissions.settings?.update}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Performance Metrics</Label>
                      <p className="text-sm text-muted-foreground">
                        Collect system performance data
                      </p>
                    </div>
                    <Switch
                      checked={settings.performanceMetrics}
                      onCheckedChange={(checked) => handleSettingChange('performanceMetrics', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Error Reporting</Label>
                      <p className="text-sm text-muted-foreground">
                        Send error reports for debugging
                      </p>
                    </div>
                    <Switch
                      checked={settings.errorReporting}
                      onCheckedChange={(checked) => handleSettingChange('errorReporting', checked)}
                      disabled={!permissions.settings?.update}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                    <Input
                      id="rateLimit"
                      type="number"
                      value={settings.apiSettings.rateLimit}
                      onChange={(e) => handleApiSettingsChange('rateLimit', parseInt(e.target.value) || 1000)}
                      disabled={!permissions.settings?.update}
                      min="100"
                      max="10000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={settings.apiSettings.timeout}
                      onChange={(e) => handleApiSettingsChange('timeout', parseInt(e.target.value) || 30)}
                      disabled={!permissions.settings?.update}
                      min="5"
                      max="300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retryAttempts">Retry Attempts</Label>
                    <Input
                      id="retryAttempts"
                      type="number"
                      value={settings.apiSettings.retryAttempts}
                      onChange={(e) => handleApiSettingsChange('retryAttempts', parseInt(e.target.value) || 3)}
                      disabled={!permissions.settings?.update}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>System Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Application Name</Label>
                    <p className="text-lg font-semibold">EEU Complaint Management System</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Version</Label>
                    <p className="text-lg">v1.0.0</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Build Date</Label>
                    <p className="text-lg">{new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Environment</Label>
                    <Badge variant="outline">Production</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Database Status</Label>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Connected</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">API Status</Label>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Operational</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Backup</Label>
                    <p className="text-lg">{new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Uptime</Label>
                    <p className="text-lg">99.9%</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Support Information</Label>
                <div className="space-y-1">
                  <p className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{settings.supportEmail}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{settings.supportPhone}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{settings.website}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}