import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lightbulb, Wand2, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center space-y-2">
        <Sparkles className="h-16 w-16 mx-auto text-primary animate-ping once" style={{ animationDuration: '1.5s' }} />
        <h1 className="text-5xl font-bold font-heading text-primary drop-shadow-lg">
          About Tell Me If
        </h1>
        <p className="text-xl text-muted-foreground font-heading">
          Where Curiosity Meets Magic!
        </p>
      </header>

      <Card className="shadow-xl bg-card/70 sparkle-effect border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <Wand2 className="h-8 w-8 text-golden-yellow-hsl" />
            Welcome, Curious Soul!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-card-foreground leading-relaxed">
          <p>
            Welcome to <strong>Tell Me If</strong>, where a mischievous AI resides in a magical lamp, 
            ready to answer any question you dare to ask! Whether you’re probing the logic of 
            the universe, imagining a topsy-turvy world, or tossing in a cheeky quip, 
            the lamp adapts to your tone and spins answers that inform, entertain, and 
            ignite your imagination.
          </p>
          <p>
            Ask “What if?” and watch the lamp conjure vivid visions of alternate realities, 
            complete with stunning images crafted on the spot. Our goal is to spark your 
            curiosity and infuse every question with a touch of magic. So, rub the lamp 
            (well, type in the box!), ask away, and let the surprises unfold!
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-card/70 sparkle-effect border-secondary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-emerald-green-hsl" />
            How to Wield the Magic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-lg text-card-foreground">
           <ul className="list-disc list-inside space-y-3 pl-4">
            <li>
              <strong>Ask Away:</strong> Type your question in the “Tell me if…” box. The lamp is all ears (sometimes literally!).
            </li>
            <li>
              <strong>Expect the Unexpected:</strong> For logical queries, the lamp offers reasoned insights. For wild hypotheticals or creative ponderings, prepare for imaginative tales!
            </li>
            <li>
              <strong>Visualize Your Whims:</strong> Want to see your "what if" scenario? Hit the “Imagine It” button, and the lamp will craft an image to accompany its story.
            </li>
            <li>
              <strong>Tone-Matching Genie:</strong> The lamp mirrors your vibe. Be serious, silly, or sassy—it’s ready to match your energy with an appropriate (and often amusing) response.
            </li>
            <li>
              <strong>Gallery of Wonders:</strong> Don't forget to visit the "Visions of the Lamp" gallery to revisit all the fantastic images conjured from your questions.
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl bg-card/70 sparkle-effect border-accent/30">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
             <Lightbulb className="h-8 w-8 text-neon-pink-hsl" />
            Our Enchanted Purpose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-card-foreground leading-relaxed">
          <p>
            At <strong>Tell Me If</strong>, we believe in the power of questions to unlock creativity, 
            foster fun, and maybe even make you chuckle. This is a place to play with ideas, 
            explore the boundless realms of "what if," and interact with an AI that feels 
            more like a quirky, magical friend than just lines of code.
          </p>
          <p>
            So go on, challenge the lamp, delight in its responses, and share the magic!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
