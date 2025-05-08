
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react'; 

export function AppHeader() {
  return (
    <header className="bg-card/50 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 h-16 flex items-center"> {/* Fixed height, flex align */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Using a generic cool icon for the site logo, could be a custom SVG later */}
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-accent transition-colors duration-300">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
            <path d="M12 12a5 5 0 1 1-5-5"/>
            <path d="M12 12a5 5 0 0 0 5 5"/>
          </svg>
          <h1 className="text-2xl font-heading font-bold text-primary group-hover:text-accent transition-colors duration-300">
            TellMeIf AI
          </h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="font-heading hover:text-accent transition-colors">
            <Link href="/about">About</Link>
          </Button>
          {/* Gallery link removed as per new requirement */}
        </nav>
      </div>
    </header>
  );
}
