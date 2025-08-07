import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.reset': 'Reset',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    
    // Login
    'login.title': 'Ethiopian Electric Utility',
    'login.subtitle': 'Complaint Management System',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.signin': 'Sign In',
    'login.signing_in': 'Signing In...',
    'login.demo_credentials': 'Demo Credentials:',
    'login.click_to_fill': 'Click on any credential to auto-fill the form',
    'login.success': 'Login Successful',
    'login.success_desc': 'Welcome to Ethiopian Electric Utility Complaint Management System',
    'login.error': 'Login Failed',
    'login.error_desc': 'Please check your email and password',
    
    // Complaint Form
    'complaint.new_complaint': 'New Complaint',
    'complaint.customer_name': 'Customer Name',
    'complaint.customer_phone': 'Customer Phone',
    'complaint.customer_email': 'Customer Email',
    'complaint.complaint_type': 'Complaint Type',
    'complaint.priority': 'Priority',
    'complaint.region': 'Region',
    'complaint.description': 'Description',
    'complaint.submit_complaint': 'Submit Complaint',
    'complaint.submitting': 'Submitting...',
    
    // User Management
    'users.title': 'User Management',
    'users.add_user': 'Add New User',
    'users.full_name': 'Full Name',
    'users.email_address': 'Email Address',
    'users.phone_number': 'Phone Number',
    'users.role': 'Role',
    'users.department': 'Department',
    'users.active': 'Active',
    'users.inactive': 'Inactive',
    'users.created': 'Created',
    
    // Settings
    'settings.title': 'System Settings',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security & Access',
    'settings.system': 'System Configuration',
    'settings.language': 'Language',
    'settings.save_changes': 'Save Changes',
  },
  am: {
    // Common
    'common.save': 'አስቀምጥ',
    'common.cancel': 'ተወው',
    'common.submit': 'አስገባ',
    'common.edit': 'አርም',
    'common.delete': 'አጥፋ',
    'common.view': 'ተመልከት',
    'common.add': 'አክል',
    'common.search': 'ፈልግ',
    'common.filter': 'ማጣሪያ',
    'common.reset': 'እንደ ነበር መልስ',
    'common.loading': 'በመጫን ላይ...',
    'common.error': 'ስህተት',
    'common.success': 'ተሳክቷል',
    'common.warning': 'ማስጠንቀቂያ',
    'common.info': 'መረጃ',
    
    // Login
    'login.title': 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት',
    'login.subtitle': 'የቅሬታ ማስተዳደሪያ ስርዓት',
    'login.email': 'የኢሜይል አድራሻ',
    'login.password': 'የይለፍ ቃል',
    'login.signin': 'ግባ',
    'login.signing_in': 'በመግባት ላይ...',
    'login.demo_credentials': 'የምሳሌ መለያዎች:',
    'login.click_to_fill': 'ቅጹን በራስ-ሰር ለመሙላት ማንኛውንም መለያ ጠቅ ያድርጉ',
    'login.success': 'መግባት ተሳክቷል',
    'login.success_desc': 'ወደ የኢትዮጵያ ኤሌክትሪክ አገልግሎት የቅሬታ ማስተዳደሪያ ስርዓት እንኳን በደህና መጡ',
    'login.error': 'መግባት አልተሳካም',
    'login.error_desc': 'እባክዎ የኢሜይል አድራሻዎን እና የይለፍ ቃልዎን ያረጋግጡ',
    
    // Complaint Form
    'complaint.new_complaint': 'አዲስ ቅሬታ',
    'complaint.customer_name': 'የደንበኛ ስም',
    'complaint.customer_phone': 'የደንበኛ ስልክ',
    'complaint.customer_email': 'የደንበኛ ኢሜይል',
    'complaint.complaint_type': 'የቅሬታ ዓይነት',
    'complaint.priority': 'ቅድሚያ',
    'complaint.region': 'ክልል',
    'complaint.description': 'መግለጫ',
    'complaint.submit_complaint': 'ቅሬታ አስገባ',
    'complaint.submitting': 'በማስገባት ላይ...',
    
    // User Management
    'users.title': 'የተጠቃሚ አስተዳደር',
    'users.add_user': 'አዲስ ተጠቃሚ አክል',
    'users.full_name': 'ሙሉ ስም',
    'users.email_address': 'የኢሜይል አድራሻ',
    'users.phone_number': 'የስልክ ቁጥር',
    'users.role': 'ሚና',
    'users.department': 'መምሪያ',
    'users.active': 'ንቁ',
    'users.inactive': 'ንቁ ያልሆነ',
    'users.created': 'የተፈጠረ',
    
    // Settings
    'settings.title': 'የሲስተም ቅንብሮች',
    'settings.notifications': 'ማሳወቂያዎች',
    'settings.security': 'ደህንነት እና መዳረሻ',
    'settings.system': 'የሲስተም ውቅረት',
    'settings.language': 'ቋንቋ',
    'settings.save_changes': 'ለውጦችን አስቀምጥ',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}