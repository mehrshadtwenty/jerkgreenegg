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
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}

    