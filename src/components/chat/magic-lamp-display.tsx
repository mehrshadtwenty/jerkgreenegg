'use client';

import type { AiStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MagicLampDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

const statusConfig: Record<AiStatus | 'user_typing', { text: string; lampAnimationClass: string }> = {
  idle: { text: "I'm listening... Ask me anything!", lampAnimationClass: 'lamp-idle' },
  user_typing: { text: "Intriguing... what will you ask?", lampAnimationClass: 'lamp-typing' },
  thinking_text: { text: "Brewing a textual potion...", lampAnimationClass: 'lamp-thinking-text' },
  thinking_image: { text: "Conjuring a vision for you...", lampAnimationClass: 'lamp-thinking-image' },
  presenting_text: { text: "Voilà! Here's your answer.", lampAnimationClass: 'lamp-presenting-text' },
  presenting_image: { text: "Behold! Your image is ready.", lampAnimationClass: 'lamp-presenting-image' },
  error: { text: "Oops! A gnome tinkered with my magic.", lampAnimationClass: 'lamp-error' },
};

const MagicLampSVG = ({ animationClass }: { animationClass: string }) => {
  const [randomAnimationStyle, setRandomAnimationStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (animationClass.includes('idle') || animationClass.includes('typing')) {
      intervalId = setInterval(() => {
        const rand = Math.random();
        if (rand < 0.15) { // Jump
          setRandomAnimationStyle({ transform: 'translateY(-15px) rotate(3deg)', transition: 'transform 0.2s ease-out' });
        } else if (rand < 0.3) { // Dance
          setRandomAnimationStyle({ transform: 'rotate(-10deg) translateX(5px) scale(1.02)', transition: 'transform 0.3s ease-in-out' });
        } else if (rand < 0.45) { // Quick disappear/reappear (subtle)
          setRandomAnimationStyle({ opacity: 0.7, transform: 'scale(0.95)', transition: 'opacity 0.2s, transform 0.2s' });
        } else {
           setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1, transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'});
        }
        
        // Reset after a short duration
        setTimeout(() => setRandomAnimationStyle({ transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out' }), 600);

      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [animationClass]);


  return (
    <div className={cn("relative w-32 h-36 sm:w-40 sm:h-44 lamp-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 120 140" className="w-full h-full magic-lamp-svg">
        {/* Base and Lid Shadow */}
        <ellipse cx="60" cy="125" rx="45" ry="10" className="lamp-shadow-base-lid" />
        {/* Spout Shadow */}
        <ellipse cx="100" cy="77" rx="10" ry="5" transform="rotate(20 100 77)" className="lamp-shadow-spout" />


        {/* Lamp Body */}
        <path d="M20 120 Q15 90, 30 70 C40 55, 80 55, 90 70 Q105 90, 100 120 L20 120 Z" className="lamp-body-fill" />
        {/* Lamp Lid */}
        <path d="M35 70 Q 60 45, 85 70 A 25 25 0 0 1 35 70 Z" className="lamp-lid-fill" />
        {/* Lamp Spout */}
        <path d="M85 75 C100 70, 120 70, 115 60 C110 50, 90 60, 88 65" className="lamp-spout-fill" />
        {/* Knob on Lid */}
        <circle cx="60" cy="50" r="7" className="lamp-knob-fill" />

        {/* Eyes - group for easier animation */}
        <g className="lamp-eyes-group">
          <ellipse cx="48" cy="80" rx="7" ry="9" className="lamp-eye" />
          <ellipse cx="72" cy="80" rx="7" ry="9" className="lamp-eye" />
          <circle cx="49" cy="81" r="2.5" className="lamp-pupil" />
          <circle cx="71" cy="81" r="2.5" className="lamp-pupil" />
        </g>
        
        {/* Eyebrows */}
        <path d="M40 70 Q48 66 56 70" className="lamp-eyebrow" />
        <path d="M64 70 Q72 66 80 70" className="lamp-eyebrow" />

        {/* Mouth */}
        <path d="M50 95 Q60 100 70 95" className="lamp-mouth" />

        {/* Ears (visible during typing) */}
        <g className="lamp-ears-group">
          <path d="M15 80 Q5 60 25 60 C30 60 30 75 22 80" className="lamp-ear" />
          <path d="M105 80 Q115 60 95 60 C90 60 90 75 98 80" className="lamp-ear" />
        </g>
        
        {/* Hands (visible during thinking/presenting) */}
        {/* Hand for thinking_text (under chin) */}
        <path d="M60 118 C 50 125, 40 115, 45 105" className="lamp-hand lamp-hand-chin" />
        
        {/* Hands for presenting_image */}
        <g className="lamp-hands-presenting">
          <path d="M30 100 C15 95, 5 105, 15 115" className="lamp-hand" />
          <path d="M90 100 C105 95, 115 105, 105 115" className="lamp-hand" />
        </g>

        {/* Magic Sparkle Effect for presenting */}
        <g className="lamp-sparkles">
            <circle cx="60" cy="30" r="3" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="20" cy="40" r="2" fill="hsl(var(--mystic-gold-hsl))" className="sparkle-2"/>
            <circle cx="100" cy="45" r="2.5" fill="hsl(var(--rose-pink-hsl))" className="sparkle-3"/>
        </g>
      </svg>
    </div>
  );
};


export function MagicLampDisplay({ status, isUserTyping }: MagicLampDisplayProps) {
  const effectiveStatus = isUserTyping && status === 'idle' ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;

  return (
    <Card className="mb-6 shadow-xl bg-card/70 border-primary/50 overflow-hidden">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <MagicLampSVG animationClass={currentVisuals.lampAnimationClass} />
        <p className={`font-semibold font-heading text-lg mt-3 text-card-foreground`}>{currentVisuals.text}</p>
      </CardContent>
    </Card>
  );
}
