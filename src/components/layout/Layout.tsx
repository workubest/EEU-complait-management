import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border">
              <Sidebar onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-auto flex flex-col">
          <div className="p-3 sm:p-4 md:p-6 flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}