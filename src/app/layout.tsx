
import type { Metadata } from 'next';
import { Inter, Roboto_Mono, Merienda } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from '@/components/layout/main-layout';

const fontSans = Inter({ 
  variable: '--font-geist-sans', 
  subsets: ['latin'],
});

const fontMono = Roboto_Mono({ 
  variable: '--font-geist-mono', 
  subsets: ['latin'],
});

const fontHeading = Merienda({
  subsets: ['latin'],
  variable: '--font-heading-family', // Changed variable name to match CSS
  weight: ['300', '400', '700', '900'], // Merienda offers these weights
});

export const metadata: Metadata = {
  title: 'Lashi Green Egg - Your Favorite Degenerate AI',
  description: 'Ask questions, get creative answers, and generate images with Lashi Green Egg!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          The `style` block is no longer needed here if the variable name 
          in `globals.css` (`--font-heading-family`) matches the variable name 
          provided by `Merienda` (`--font-heading-family`).
          The font variable is automatically applied by Next.js.
        */}
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
