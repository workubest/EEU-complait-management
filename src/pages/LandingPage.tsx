import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { 
  Users, 
  FileText, 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-eeu-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-eeu-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-8">
              <div className="w-64 h-64 flex items-center justify-center group cursor-pointer relative">
                {/* Glow Effects */}
                <div className="absolute inset-0 bg-gradient-eeu rounded-full blur-2xl opacity-25 group-hover:opacity-50 transition-all duration-700 animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-eeu-reverse rounded-full blur-lg opacity-15 group-hover:opacity-30 transition-all duration-500"></div>
                
                <img 
                  src="/eeu-logo-new.png" 
                  alt="Ethiopian Electric Utility Logo" 
                  className="w-full h-full object-contain transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 drop-shadow-xl relative z-10"
                />
                
                {/* Rotating Rings */}
                <div className="absolute inset-0 border-3 border-transparent border-t-eeu-orange border-r-eeu-green rounded-full animate-spin opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="absolute inset-3 border-2 border-transparent border-b-eeu-green border-l-eeu-orange rounded-full animate-spin opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ animationDirection: 'reverse', animationDuration: '3.5s' }}></div>
                
                {/* Sparkle Effects */}
                <div className="absolute top-8 right-8 w-3 h-3 bg-eeu-orange rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                <div className="absolute bottom-10 left-10 w-2 h-2 bg-eeu-green rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute top-16 left-16 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.8s' }}></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-eeu bg-clip-text text-transparent">{t('login.title')}</h1>
                <p className="text-sm text-eeu-orange">{t('login.subtitle')}</p>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-eeu rounded-lg blur-sm opacity-50"></div>
                  <p className="relative text-xs text-white font-semibold px-2 py-1 bg-gradient-eeu rounded-lg shadow-md">
                    የኢትዮጵያ ኤሌክትሪክ አገልግሎት
                  </p>
                </div>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-eeu bg-clip-text text-transparent mb-4">
            {t('landing.welcome_title')}
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            {t('landing.welcome_description')}
          </p>
        </div>
      </section>

      {/* Service Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Customer Portal */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-eeu-orange" onClick={() => navigate('/customer-portal')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-eeu-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-eeu-orange" />
                </div>
                <CardTitle className="text-2xl bg-gradient-eeu bg-clip-text text-transparent">
                  {t('landing.customer_portal')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  {t('landing.customer_portal_description')}
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.file_complaints')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.track_status')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.account_lookup')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.multilingual')}
                  </li>
                </ul>
                <Button className="w-full bg-gradient-eeu hover:opacity-90 transition-opacity" size="lg">
                  {t('landing.access_customer_portal')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Staff Login */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-eeu-green" onClick={() => navigate('/login')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-eeu-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-eeu-green" />
                </div>
                <CardTitle className="text-2xl bg-gradient-eeu-reverse bg-clip-text text-transparent">
                  {t('landing.staff_portal')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  {t('landing.staff_portal_description')}
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.manage_complaints')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.analytics_reports')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.user_management')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-eeu-green mr-2" />
                    {t('landing.feature.role_permissions')}
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-eeu-green text-eeu-green hover:bg-eeu-green hover:text-white transition-colors" size="lg">
                  {t('landing.staff_login')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold bg-gradient-eeu bg-clip-text text-transparent mb-4">
              {t('landing.contact_title')}
            </h3>
            <p className="text-lg text-gray-700">
              {t('landing.contact_description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-eeu-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-eeu-orange" />
              </div>
              <h4 className="text-lg font-semibold text-eeu-green mb-2">
                {t('landing.contact.phone')}
              </h4>
              <p className="text-gray-600">+251-11-123-4567</p>
              <p className="text-gray-600">+251-11-123-4568</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-eeu-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-eeu-green" />
              </div>
              <h4 className="text-lg font-semibold text-eeu-orange mb-2">
                {t('landing.contact.email')}
              </h4>
              <p className="text-gray-600">complaints@eeu.gov.et</p>
              <p className="text-gray-600">support@eeu.gov.et</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-eeu-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-eeu-orange" />
              </div>
              <h4 className="text-lg font-semibold text-eeu-green mb-2">
                {t('landing.contact.hours')}
              </h4>
              <p className="text-gray-600">{t('landing.contact.weekdays')}</p>
              <p className="text-gray-600">{t('landing.contact.weekend')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 {t('login.title')}. {t('landing.footer.rights')}
            </p>
            <p className="text-gray-400 mt-2">
              {t('landing.footer.version')} 1.0.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;