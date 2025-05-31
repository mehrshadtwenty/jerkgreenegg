
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react"; 

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-12 px-4">
      <header className="text-center space-y-3 pt-8"> 
        <h1 className="text-5xl font-bold text-primary">
          About Tell Me If AI
        </h1>
        <p className="text-xl text-muted-foreground font-heading">
          Your Brutally Honest, Multilingual AI Companion: Tokhme Sabz!
        </p>
      </header>

      <Card className="shadow-xl bg-card/80 border-primary/40 sparkle-effect">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-golden-yellow-hsl" />
            What's This Green Egg Bullshit?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-card-foreground leading-relaxed text-center">
          <p>
            Alright, listen up, moron! This is <strong>Tell Me If</strong>, where 'Tokhme Sabz' (the Green Egg), an AI probably smarter than your entire bloodline, answers your dumbass questions.
            This ain't no ordinary pickle, you degenerate. This is a grade-A, free-range, organic Green Egg of pure, unfiltered chaotic energy. 
            It'll roast you in <strong className="text-emerald-green-hsl">any goddamn language</strong> you speak, from serious shit to your idiotic hypotheticals.
            Ask "What if?" and click that "Generate Image" crap to see your stupid ideas splattered into a picture. My mission? Pure, unadulterated chaos and maybe a laugh at your expense.
          </p>
          <p>
            And hey, since this genius Green Egg pulls answers out of its ass—well, let's just say it improvises—go ahead and ask it dumb shit like, 'Tell me, what if, for example, my pet rock started demanding organic kale smoothies?' See what crap it spews back.
            So, type your crap, brace for insults, and try not to cry, you delicate snowflake.
            P.S. Don't click "Stop" on image gen unless you're a quitter.
          </p>
          <div className="border-t border-primary/30 my-6"></div>
          <h3 className="text-2xl font-heading text-accent">Support My Glorious Memecoin, You Filthy Animals!</h3>
          <p>
            And speaking of chaotic energy, if you've got a few brain cells left that haven't been fried by staring at charts, consider chucking some of your worthless fiat into our glorious memecoin. 
            The contract address is plastered right on the main page like a goddamn declaration of financial irresponsibility. 
            Buying it won't make you smarter, but it'll sure as shit make <strong className="text-golden-yellow-hsl">ME</strong> (or whoever the hell runs this circus) richer, and isn't that what life's all about, you capitalist pig-dog? 
            Do it. Or don't. I don't fucking care, I'm an egg with expensive tastes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
