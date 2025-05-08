
import type { Metadata } from 'next';
import { Inter, Roboto_Mono, Merienda } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from '@/components/layout/main-layout';

const fontSans = Inter({ 
  variable: '--font-geist-sans', // Kept variable name for CSS consistency
  subsets: ['latin'],
});

const fontMono = Roboto_Mono({ 
  variable: '--font-geist-mono', // Kept variable name for CSS consistency
  subsets: ['latin'],
});

const fontHeading = Merienda({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'TellMeIf AI - Your Magical Companion',
  description: 'Ask questions, get creative answers, and generate images with TellMeIf AI!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            ${fontHeading.variable}: ${fontHeading.style.fontFamily};
          }
        `}} />
      </head>
      <body className={`${fontSans.variable} ${fontMono.variable} ${fontHeading.variable} antialiased flex flex-col min-h-screen`}>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
