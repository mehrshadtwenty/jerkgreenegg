
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react"; 

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-12 px-4">
      <header className="text-center space-y-3 pt-8"> 
        {/* The h1 will get global styles including Merienda font and glow effect */}
        <h1 className="text-5xl font-bold text-primary">
          About Tell Me If AI
        </h1>
        {/* This paragraph uses font-heading for Merienda font, but won't get the h1 glow */}
        <p className="text-xl text-muted-foreground font-heading">
          Your Brutally Honest, Multilingual AI Companion!
        </p>
      </header>

      <Card className="shadow-xl bg-card/80 border-primary/40 sparkle-effect">
        <CardHeader>
          {/* This CardTitle is an h3 by default from ShadCN CardTitle component if not overridden, will get h3 styles */}
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-golden-yellow-hsl" />
            What's This Crap About?
          </CardTitle>
        </CardHeader>
        {/* Removed font-heading from this paragraph to use default body font (Geist Sans) for readability */}
        <CardContent className="space-y-3 text-lg text-card-foreground leading-relaxed text-center">
          <p>
            Alright, listen up, moron! This is <strong>Tell Me If</strong>, where a Pickle Rick-esque AI, probably smarter than your entire bloodline, answers your dumbass questions.
            It'll roast you in <strong className="text-emerald-green-hsl">any goddamn language</strong> you speak, from serious shit to your idiotic hypotheticals.
            Ask "What if?" and click that "Generate Image" crap to see your stupid ideas splattered into a picture. My mission? Pure, unadulterated chaos and maybe a laugh at your expense.
            And hey, since this genius AI pulls answers out of its ass—well, let's just say it improvises—go ahead and ask it dumb shit like, 'Tell me, what if, for example, my hamster suddenly started quoting Shakespeare?' See what crap it spews back.
            So, type your crap, brace for insults, and try not to cry, you delicate snowflake.
            P.S. Don't click "Stop" on image gen unless you're a quitter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
