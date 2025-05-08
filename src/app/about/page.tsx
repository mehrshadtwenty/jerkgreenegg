import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lightbulb, ImageIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center space-y-2">
        <Sparkles className="h-16 w-16 mx-auto text-primary animate-ping once" />
        <h1 className="text-5xl font-bold font-heading text-primary drop-shadow-lg">
          About TellMeIf AI
        </h1>
        <p className="text-xl text-muted-foreground font-heading">
          Your Portal to Imagination and Discovery
        </p>
      </header>

      <Card className="shadow-xl bg-card/70 sparkle-effect">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <Lightbulb className="h-8 w-8 text-mystic-gold-hsl" />
            What is TellMeIf AI?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-card-foreground leading-relaxed">
          <p>
            TellMeIf AI is a magical, whimsical application designed to spark your curiosity and creativity. 
            Ever wondered "what if?" or pondered a hypothetical scenario? Our AI-powered genie is here to 
            provide contextually relevant, creative, and sometimes surprising answers to your questions.
          </p>
          <p>
            Whether your query is logical, imaginative, or just plain fun, TellMeIf AI adapts its tone 
            and style to match. We believe in the power of questions to unlock new perspectives and ideas.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-card/70 sparkle-effect">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
            <ImageIcon className="h-8 w-8 text-emerald-green-hsl" />
            Features That Dazzle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-lg text-card-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>AI Question Answering:</strong> Get unique answers tailored to the nature of your question, from the practical to the fantastical.
            </li>
            <li>
              <strong>AI Image Generation:</strong> For those truly imaginative "what if" moments, our AI can generate a unique image to bring your scenario to life! Just check the "Imagine It?" box.
            </li>
            <li>
              <strong>Interactive Chat:</strong> Engage with our AI genie through a fun, chat-bubble interface.
            </li>
            <li>
              <strong>Image Gallery:</strong> Revisit the stunning visuals conjured by your questions in our dedicated gallery.
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl bg-card/70 sparkle-effect">
        <CardHeader>
          <CardTitle className="text-3xl font-heading text-center text-secondary-foreground flex items-center justify-center gap-2">
             <Sparkles className="h-8 w-8 text-rose-pink-hsl" />
            Our Philosophy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-card-foreground leading-relaxed">
          <p>
            At TellMeIf AI, we aim to blend technology with imagination. We want to provide a space where you can explore ideas freely, 
            get inspired, and maybe even see the world a little differently. So go ahead, ask away, and let the magic unfold!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    