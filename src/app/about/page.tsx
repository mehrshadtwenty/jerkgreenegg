
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, HelpCircle, Bot, Wand2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8"> {/* Added py-8 for spacing from header */}
      <header className="text-center space-y-2">
        <Bot className="h-16 w-16 mx-auto text-primary animate-bounce" style={{ animationDuration: '1.5s' }} />
        <h1 className="text-5xl font-bold font-heading text-primary drop-shadow-lg">
          About Tell Me If AI
        </h1>
        <p className="text-xl text-muted-foreground font-heading">
          Your Sassy, Multilingual AI Companion!
        </p>
      </header>

      <Card className="shadow-xl bg-card/70 sparkle-effect border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-golden-yellow-hsl" />
            Welcome, Brave Questioner!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-card-foreground leading-relaxed">
          <p>
            Welcome to <strong>Tell Me If</strong>, where a sassy AI, embodied by a cool humanoid trickster, 
            waits to tackle any question you throw its way! From unraveling the logic of the cosmos 
            (with a sarcastic smirk, of course) to spinning wild tales of upside-down worlds, 
            this AI delivers cheeky, bold, and laugh-out-loud answers in <strong>any language you choose</strong>.
          </p>
          <p>
            Ask “What if?” and click “Generate Image” to see your wild ideas come to life in vivid visuals, 
            all while our character strikes a pose or two. Our mission? To keep you entertained, 
            spark your curiosity, and maybe even make you snort with laughter. 
            So, dive into the chat, ask anything, and brace for some epic sass!
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-card/70 sparkle-effect border-secondary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-emerald-green-hsl" />
            How to Summon the Sass
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-lg text-card-foreground">
           <ul className="list-disc list-inside space-y-3 pl-4">
            <li>
              <strong>Spill the Beans:</strong> Type your question in the “Tell me if…” chat box. Our humanoid is all ears (when it decides to sprout them).
            </li>
            <li>
              <strong>Expect the Unexpected (and a side of attitude):</strong> Get witty, logical-ish answers for serious queries, or hilariously bold takes on hypotheticals.
            </li>
            <li>
              <strong>Picture This:</strong> Click “Generate Image” for visuals that (mostly) match your chat. If the AI is taking too long (or you get bored), hit “Stop”.
            </li>
            <li>
              <strong>Speak Your Language:</strong> Ask in any language; our AI is a polyglot with a universal dialect of cheekiness. It matches your vibe, so go wild!
            </li>
            <li>
              <strong>Gallery of "Art":</strong> Check out the "Visions of the AI" gallery for a collection of previously conjured images. Marvel at the digital da Vinci at work.
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl bg-card/70 sparkle-effect border-accent/30">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
             <Wand2 className="h-8 w-8 text-neon-pink-hsl" />
            Our Grand, Comical Purpose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-card-foreground leading-relaxed">
          <p>
            At <strong>Tell Me If</strong>, we believe that questions are funnier with a dash of irreverence. 
            This is a playground for ideas, a cosmic stage for "what ifs," and a chance to banter 
            with an AI that’s more like a mischievous sidekick than a boring bot.
          </p>
          <p>
            So go on, challenge our character, delight in its (often questionable) wisdom, and share the digital chaos!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
