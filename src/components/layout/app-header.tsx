
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Sparkles icon removed as it's not used in the new pickle icon.

export function AppHeader() {
  return (
    <header className="bg-card/50 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 h-16 flex items-center"> {/* Fixed height, flex align */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          {/* New Pickle/Cucumber Icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="hsl(var(--character-pickle-body-main-hsl))" 
            stroke="hsl(var(--character-pickle-dark-green-hsl))" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:fill-hsl(var(--accent)/0.8) group-hover:stroke-hsl(var(--accent)) transition-colors duration-300 transform group-hover:rotate-[-15deg] group-hover:scale-110"
          >
            <path d="M16.46 3.55C14.94 2.41 12.58 2 12 2c-2.49 0-5.49.93-6.46 3.55C4.29 9.07 4.09 16.06 12 22c7.91-5.94 7.71-12.93 6.46-18.45Z"/>
            {/* Optional: add some pickle-like details if desired, e.g., small dots */}
            <circle cx="10" cy="10" r="0.5" fill="hsl(var(--character-pickle-dark-green-hsl))" className="group-hover:fill-hsl(var(--accent))"/>
            <circle cx="14" cy="13" r="0.5" fill="hsl(var(--character-pickle-dark-green-hsl))" className="group-hover:fill-hsl(var(--accent))"/>
          </svg>
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

