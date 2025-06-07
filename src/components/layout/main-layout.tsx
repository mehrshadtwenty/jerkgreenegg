
import type { ReactNode } from 'react';
import { AppHeader } from './app-header';
import { AppFooter } from './app-footer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      {/* main element now handles overflow and padding for the fixed header */}
      <main className="flex-grow flex flex-col overflow-hidden pt-16"> 
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
