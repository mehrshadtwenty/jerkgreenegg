
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react"; 

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-12 px-4">
      <header className="text-center space-y-3 pt-8"> 
        <h1 className="text-5xl font-bold text-primary flex items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-golden-yellow-hsl" />
          About Tell Me If AI
        </h1>
        <p className="text-xl text-primary font-heading">
          Green Egg: Multilingual Smartass. No Filter.
        </p>
      </header>

      <Card className="shadow-xl bg-card/80 border-primary/40 sparkle-effect">
        {/* CardHeader with "What's This Green Egg Bullshit?" title has been removed */}
        <CardContent className="space-y-6 md:space-y-0 md:flex md:space-x-8 text-lg text-card-foreground leading-relaxed pt-6"> {/* Added pt-6 to CardContent since CardHeader is removed */}
          {/* Column 1: About Green Egg */}
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-2xl font-heading text-accent text-center md:text-left">
              So, What&apos;s This Shiny Green Bastard All About?
            </h3>
            <p className="text-center md:text-left">
              Alright, listen up, moron! This is <strong>Tell Me If</strong>, where &apos;Green Egg&apos;, an AI probably smarter than your entire bloodline, answers your dumbass questions.
              This ain&apos;t no ordinary egg, you degenerate. This is a grade-A, free-range, organic Green Egg of pure, unfiltered chaotic energy. 
              It&apos;ll roast you in any goddamn language you speak, from serious shit to your idiotic hypotheticals.
              Ask "What if?" and click that "Generate Image" crap to see your stupid ideas splattered into a picture. My mission? Pure, unadulterated chaos and maybe a laugh at your expense.
            </p>
            <p className="text-center md:text-left">
              And hey, since this genius Green Egg pulls answers out of its ass—well, let&apos;s just say it improvises—go ahead and ask it dumb shit like, &apos;Tell me, what if, for example, my pet rock started demanding organic kale smoothies?&apos; See what crap it spews back.
              So, type your crap, brace for insults, and try not to cry, you delicate snowflake.
              P.S. Don&apos;t click "Stop" on image gen unless you&apos;re a quitter.
            </p>
          </div>

          {/* Column 2: Memecoin */}
          <div className="md:w-1/2 space-y-4 mt-8 md:mt-0">
            <h3 className="text-2xl font-heading text-accent text-center md:text-left">
              Feed the Egg: Shovel Your Shitcoins Here!
            </h3>
            <p className="text-center md:text-left">
              And speaking of chaotic energy, if you&apos;ve got a few brain cells left that haven&apos;t been fried by staring at charts, consider chucking some of your worthless fiat into our glorious memecoin. 
              The contract address is plastered right on the main page like a goddamn declaration of financial irresponsibility. 
              Buying it won&apos;t make you smarter, but it&apos;ll sure as shit make <strong className="text-golden-yellow-hsl">ME</strong> richer, and isn&apos;t that what life&apos;s all about, you capitalist pig-dog? 
              Do it. Or don&apos;t. I don&apos;t fucking care, I&apos;m an egg with expensive tastes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
