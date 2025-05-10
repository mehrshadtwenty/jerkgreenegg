
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Sparkles icon removed as it's not used in the new pickle icon.

export function AppHeader() {
  return (
    <header className="bg-card/50 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 h-16 flex items-center"> {/* Fixed height, flex align */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Cucumber icon removed */}
          <h1 className="text-2xl font-heading font-bold text-primary group-hover:text-accent transition-colors duration-300">
            TellMeIf AI
          </h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="font-heading hover:text-accent transition-colors">
            <Link href="/about">About</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

