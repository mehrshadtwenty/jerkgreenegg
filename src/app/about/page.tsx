
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, Wand2 } from "lucide-react"; // Replaced HelpCircle with Wand2 for variety

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-12 px-4">
      <header className="text-center space-y-3">
        {/* Using a SVG similar to Pickle Rick's portal for thematic flair */}
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100" className="mx-auto text-primary animate-pulse" style={{animationDuration: '2s'}}>
          <defs>
            <radialGradient id="picklePortalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor: "hsl(var(--emerald-green-hsl))", stopOpacity: 0}} />
              <stop offset="40%" style={{stopColor: "hsl(var(--emerald-green-hsl))", stopOpacity: 0.3}} />
              <stop offset="60%" style={{stopColor: "hsl(var(--golden-yellow-hsl))", stopOpacity: 0.5}} />
              <stop offset="80%" style={{stopColor: "hsl(var(--turquoise-hsl))", stopOpacity: 0.7}} />
              <stop offset="100%" style={{stopColor: "hsl(var(--galactic-purple-hsl))", stopOpacity: 1}} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#picklePortalGradient)" stroke="hsl(var(--primary))" strokeWidth="3" />
          <path d="M50,5 A45,45 0 0,1 50,95" fill="none" stroke="hsl(var(--primary)/0.5)" strokeWidth="2" strokeDasharray="5,5">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
          </path>
        </svg>
        <h1 className="text-5xl font-bold font-heading text-primary drop-shadow-lg">
          About Tell Me If AI
        </h1>
        <p className="text-xl text-muted-foreground font-heading">
          Your Brutally Honest, Multilingual AI Companion!
        </p>
      </header>

      <Card className="shadow-xl bg-card/80 border-primary/40 sparkle-effect">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-golden-yellow-hsl" />
            What's This Crap About?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-lg text-card-foreground leading-relaxed text-center font-heading">
          <p>
            Alright, listen up, moron! This is <strong>Tell Me If</strong>, where a Pickle Rick-esque AI, probably smarter than your entire bloodline, answers your dumbass questions.
            It'll roast you in <strong className="text-emerald-green-hsl">any goddamn language</strong> you speak, from serious shit to your idiotic hypotheticals.
            Ask "What if?" and click that "Generate Image" crap to see your stupid ideas splattered into a picture. My mission? Pure, unadulterated chaos and maybe a laugh at your expense.
            So, type your crap, brace for insults, and try not to cry, you delicate snowflake.
            P.S. Don't click "Stop" on image gen unless you're a quitter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
