import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react'; // Using Sparkles as a generic magic icon

export function AppHeader() {
  return (
    <header className="bg-card/50 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
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

    
