
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react"; 

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-12 px-4">
      <header className="text-center space-y-3 pt-8"> 
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
            And hey, since this genius AI pulls answers out of its ass—well, let's just say it improvises—go ahead and ask it dumb shit like, 'Tell me, what if, for example, my hamster suddenly started quoting Shakespeare?' See what crap it spews back.
            So, type your crap, brace for insults, and try not to cry, you delicate snowflake.
            P.S. Don't click "Stop" on image gen unless you're a quitter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
