import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { language } = useLanguage();

  const footerText = {
    en: {
      designedBy: "System Designed by:",
      designer: "WORKU MESAFINT ADDIS [504530]",
      copyright: "© 2024 Ethiopian Electric Utility (EEU). All rights reserved."
    },
    am: {
      designedBy: "ሲስተሙ የተዘጋጀው በ:",
      designer: "ወርቁ መሳፍንት አዲስ [504530]",
      copyright: "© 2024 የኢትዮጵያ ኤሌክትሪክ ኮርፖሬሽን (ኢኤዩ). ሁሉም መብቶች የተጠበቁ ናቸው።"
    }
  };

  const text = footerText[language];

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-2 mb-2 md:mb-0">
            <span>{text.designedBy}</span>
            <span className="font-semibold text-primary">{text.designer}</span>
          </div>
          <div>
            <span>{text.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}