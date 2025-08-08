import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Eye, EyeOff, Loader2, Info } from 'lucide-react';
import { apiService } from '@/lib/api';
import { environment } from '@/config/environment';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the Google Apps Script backend for authentication
      const response = await apiService.login({ email, password });
      
      console.log('🔍 Login component received response:', response);
      console.log('🔍 Response analysis:', {
        success: response.success,
        hasData: !!response.data,
        hasDataUser: !!(response.data && response.data.user),
        hasUser: !!response.user,
        dataKeys: response.data ? Object.keys(response.data) : [],
        responseKeys: Object.keys(response)
      });

      if (response.success) {
        // Get user data from the response - API service should have transformed it
        let user = null;
        
        if (response.data?.user) {
          user = response.data.user;
          console.log('✅ Using response.data.user');
        } else if (response.user) {
          user = response.user;
          console.log('✅ Using response.user');
        } else {
          console.error('❌ No user data found in successful response');
          throw new Error('No user data in login response');
        }
        
        console.log('👤 User data received:', user);
        
        // The API service should have already transformed the data, so use it directly
        // But add fallback for compatibility
        const userData = {
          id: user.id || user.ID || '',
          name: user.name || user.Name || '',
          email: user.email || user.Email || '',
          role: user.role || user.Role || 'technician',
          region: user.region || user.Region || '',
          department: user.department || user.Department || '',
          phone: user.phone || user.Phone || '',
          isActive: user.isActive !== undefined ? user.isActive : (user['Is Active'] !== undefined ? user['Is Active'] : true),
          createdAt: user.createdAt || user['Created At'] || new Date().toISOString(),
        };

        console.log('✅ Final user data for login:', userData);
        
        login(userData);
        toast({
          title: t("login.success"),
          description: t("login.success_desc"),
        });
        navigate('/');
      } else {
        console.error('❌ Login failed - response.success is false');
        throw new Error(response.error || response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t("login.error"),
        description: error instanceof Error ? error.message : t("login.error_desc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserFromEmail = (email: string) => {
    if (email.includes('admin')) return {
      id: '1', name: 'Abebe Kebede', email: 'admin@eeu.gov.et', role: 'admin' as const,
      region: 'Addis Ababa', department: 'System Administration', phone: '+251-11-123-4567',
      isActive: true, createdAt: '2024-01-01'
    };
    if (email.includes('manager')) return {
      id: '2', name: 'Tigist Haile', email: 'manager@eeu.gov.et', role: 'manager' as const,
      region: 'Oromia', department: 'Regional Management', phone: '+251-11-234-5678',
      isActive: true, createdAt: '2024-01-02'
    };
    if (email.includes('foreman')) return {
      id: '3', name: 'Getachew Tadesse', email: 'foreman@eeu.gov.et', role: 'foreman' as const,
      region: 'Amhara', department: 'Field Operations', phone: '+251-11-345-6789',
      isActive: true, createdAt: '2024-01-03'
    };
    if (email.includes('attendant')) return {
      id: '4', name: 'Meron Tesfaye', email: 'callattendant@eeu.gov.et', role: 'call-attendant' as const,
      region: 'Addis Ababa', department: 'Customer Service', phone: '+251-11-456-7890',
      isActive: true, createdAt: '2024-01-04'
    };
    return {
      id: '5', name: 'Dawit Solomon', email: 'technician@eeu.gov.et', role: 'technician' as const,
      region: 'Addis Ababa', department: 'Field Service', phone: '+251-11-567-8901',
      isActive: true, createdAt: '2024-01-05'
    };
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@eeu.gov.et', password: 'admin123' },
    { role: 'Manager', email: 'manager@eeu.gov.et', password: 'manager123' },
    { role: 'Foreman', email: 'foreman@eeu.gov.et', password: 'foreman123' },
    { role: 'Call Attendant', email: 'attendant@eeu.gov.et', password: 'attendant123' },
    { role: 'Technician', email: 'tech@eeu.gov.et', password: 'tech123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <Card className="shadow-elevated border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/619b3b1f-23f4-4f15-af59-c1363245ea9b.png" 
                alt="Ethiopian Electric Utility Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("login.title")}</h1>
            <p className="text-muted-foreground">{t("login.subtitle")}</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t("login.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("login.signing_in")}
                  </>
                ) : (
                  t("login.signin")
                )}
              </Button>
            </form>

            {/* Backend Status Notice */}
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Backend Status:</strong> 
                {environment.isDevelopment && !environment.forceRealBackend ? (
                  <span> Running in demo mode with mock data to avoid CORS issues during development. Any email/password combination will work.</span>
                ) : (
                  <span> Connected to Google Apps Script backend. If the backend is unavailable, the app will automatically fall back to demo mode.</span>
                )}
              </AlertDescription>
            </Alert>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{t("login.demo_credentials")}</h3>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <div 
                    key={cred.role}
                    className="flex items-center justify-between p-2 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                  >
                    <div>
                      <div className="text-sm font-medium">{cred.role}</div>
                      <div className="text-xs text-muted-foreground">{cred.email}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{cred.password}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {t("login.click_to_fill")}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-white/80">
          <p>© 2024 Ethiopian Electric Utility. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}