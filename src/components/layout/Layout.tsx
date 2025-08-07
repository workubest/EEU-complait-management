import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 h-[calc(100vh-80px)]">
        <Sidebar />
        <main className="flex-1 overflow-auto flex flex-col">
          <div className="p-6 flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}