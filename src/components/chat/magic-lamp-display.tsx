'use client';

import type { AiStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Brain, Wand2, Gift, AlertTriangle, Loader2, MessageSquareText } from 'lucide-react';
import Image from 'next/image';

interface MagicLampDisplayProps {
  status: AiStatus;
}

const statusConfig = {
  idle: { icon: Mic, text: "I'm listening... Ask me anything!", color: 'text-sky-blue-hsl' },
  listening: { icon: Mic, text: "Listening intently...", color: 'text-sky-blue-hsl' },
  thinking_text: { icon: Loader2, text: "Brewing a textual potion...", color: 'text-mystic-gold-hsl', animate: true },
  thinking_image: { icon: Loader2, text: "Conjuring a vision for you...", color: 'text-emerald-green-hsl', animate: true },
  presenting_text: { icon: MessageSquareText, text: "Voilà! Here's your answer.", color: 'text-rose-pink-hsl' },
  presenting_image: { icon: Gift, text: "Behold! Your image is ready.", color: 'text-accent' },
  error: { icon: AlertTriangle, text: "Oops! A gnome tinkered with my magic.", color: 'text-destructive' },
};

export function MagicLampDisplay({ status }: MagicLampDisplayProps) {
  const currentStatus = statusConfig[status] || statusConfig.idle;
  const IconComponent = currentStatus.icon;

  return (
    <Card className="mb-6 shadow-xl bg-card/70 border-primary/50 sparkle-effect overflow-hidden">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-3">
           <Image 
            src="https://picsum.photos/200/200?random=1" 
            alt="Magic Lamp" 
            width={160} 
            height={160} 
            className="rounded-full object-cover border-4 border-primary shadow-lg animate-pulse"
            data-ai-hint="magic lamp whimsical"
          />
        </div>
        <div className="flex items-center gap-2">
          <IconComponent className={`h-6 w-6 ${currentStatus.color} ${currentStatus.animate ? 'animate-spin' : ''}`} />
          <p className={`font-semibold text-lg ${currentStatus.color}`}>{currentStatus.text}</p>
        </div>
      </CardContent>
    </Card>
  );
}

    