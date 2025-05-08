
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
      {/* Children will now typically be the HomePage which handles its own internal scrolling and layout */}
      <main className="flex-grow flex flex-col"> {/* Ensure main takes up space */}
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
