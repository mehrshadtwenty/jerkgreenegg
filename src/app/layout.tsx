import type { Metadata } from 'next';
import { Geist_Sans as GeistSans, Geist_Mono as GeistMono } from 'next/font/google'; // Corrected import names to match usage
import { Merienda } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from '@/components/layout/main-layout';

const fontSans = GeistSans({ // Changed from Geist to GeistSans
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const fontMono = GeistMono({ // Changed from Geist_Mono to GeistMono
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fontHeading = Merienda({
  subsets: ['latin'],
  variable: '--font-heading', // This will be used by font-heading utility class or direct CSS
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

    