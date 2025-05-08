'use client';

import type { AiStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
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

const idleAnimationTypes = ['float_bob', 'jump', 'mini_dance', 'disappear_reappear', 'look_around'];

const MagicLampSVG = ({ animationClass }: { animationClass: string }) => {
  const [randomAnimationStyle, setRandomAnimationStyle] = useState<React.CSSProperties>({});
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const playRandomIdleAnimation = () => {
      const randType = idleAnimationTypes[Math.floor(Math.random() * idleAnimationTypes.length)];
      let duration = 500; // Default duration for the move itself
      let nextDelay = 3000 + Math.random() * 2000; // Time until next random animation

      if (randType === 'jump') {
        setRandomAnimationStyle({ transform: 'translateY(-25px) rotate(8deg) scale(1.1)', transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' });
        duration = 250;
      } else if (randType === 'mini_dance') {
        setRandomAnimationStyle({ transform: 'translateX(10px) rotate(-10deg) scale(1.05)', transition: 'transform 0.2s ease-in-out' });
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = setTimeout(() => {
          setRandomAnimationStyle({ transform: 'translateX(-10px) rotate(10deg) scale(1.05)', transition: 'transform 0.2s ease-in-out' });
        }, 200);
        duration = 400; // total for sequence before reset
      } else if (randType === 'disappear_reappear') {
        setRandomAnimationStyle({ opacity: 0, transform: 'scale(0.3) rotate(720deg)', transition: 'opacity 0.4s ease-in, transform 0.6s ease-in-out' });
        duration = 600; // Time for disappear
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = setTimeout(() => { // Reappear
          setRandomAnimationStyle({ opacity: 1, transform: 'scale(1) rotate(0deg)', transition: 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
        }, 700); // Reappear after being gone
        nextDelay = 5000; // Longer delay after a big move
      } else if (randType === 'look_around') {
         setRandomAnimationStyle({ transform: 'rotateY(20deg) translateX(5px)', transition: 'transform 0.3s ease-in-out'});
         if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
         resetTimeoutRef.current = setTimeout(() => {
           setRandomAnimationStyle({ transform: 'rotateY(-20deg) translateX(-5px)', transition: 'transform 0.3s ease-in-out'});
         }, 400);
         duration = 800;
      } else { // float_bob (default intermittent subtle move)
        setRandomAnimationStyle({ transform: `translateY(${Math.random() * -10}px) rotate(${Math.random() * 4 - 2}deg)`, transition: 'transform 0.7s ease-in-out' });
        duration = 700;
      }

      // Clear previous reset timeout
      if (resetTimeoutRef.current && randType !== 'mini_dance' && randType !== 'disappear_reappear' && randType !== 'look_around') { // these handle their own multi-stage reset
         clearTimeout(resetTimeoutRef.current);
      }
      // Reset to base idle bobbing style after the specific animation, unless it's a multi-stage one
      if (randType !== 'mini_dance' && randType !== 'disappear_reappear' && randType !== 'look_around') {
        resetTimeoutRef.current = setTimeout(() => {
          setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1, transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'});
        }, duration);
      }
      
      // Schedule next random animation
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = setTimeout(playRandomIdleAnimation, nextDelay);
    };

    if (animationClass.includes('lamp-idle')) {
      playRandomIdleAnimation(); // Start the cycle
    } else {
      // Clear timeouts if not idle to prevent animations carrying over
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      // Reset to a neutral style if not idle, to ensure CSS class animations take full effect
      setRandomAnimationStyle({ transform: 'none', opacity: 1, transition: 'none' });
    }

    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [animationClass]);


  return (
    <div className={cn("relative w-32 h-36 sm:w-40 sm:h-44 lamp-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 120 140" className="w-full h-full magic-lamp-svg">
        {/* Shadows */}
        <ellipse cx="60" cy="125" rx="45" ry="10" className="lamp-shadow-base-lid" />
        <ellipse cx="100" cy="77" rx="10" ry="5" transform="rotate(20 100 77)" className="lamp-shadow-spout" />

        {/* Lamp Body Structure */}
        <path d="M20 120 Q15 90, 30 70 C40 55, 80 55, 90 70 Q105 90, 100 120 L20 120 Z" className="lamp-body-fill" />
        <path d="M35 70 Q 60 45, 85 70 A 25 25 0 0 1 35 70 Z" className="lamp-lid-fill" />
        <path d="M85 75 C100 70, 120 70, 115 60 C110 50, 90 60, 88 65" className="lamp-spout-fill" />
        <circle cx="60" cy="50" r="7" className="lamp-knob-fill" />

        {/* Ears (animated for 'typing' state) */}
        <g className="lamp-ears-group">
            {/* Left Ear - stylized */}
            <path d="M28 80 Q10 70 20 50 Q25 40 35 55 Q40 70 28 80Z" className="lamp-ear" transform="translate(-5, -5) rotate(-10 28 65)" />
            {/* Right Ear - stylized and mirrored */}
            <path d="M92 80 Q110 70 100 50 Q95 40 85 55 Q80 70 92 80Z" className="lamp-ear" transform="translate(5, -5) rotate(10 92 65)" />
        </g>

        {/* Eyes group */}
        <g className="lamp-eyes-group">
          <ellipse cx="48" cy="80" rx="7" ry="9" className="lamp-eye" />
          <ellipse cx="72" cy="80" rx="7" ry="9" className="lamp-eye" />
          <circle cx="49" cy="81" r="2.5" className="lamp-pupil" /> {/* Left pupil */}
          <circle cx="71" cy="81" r="2.5" className="lamp-pupil" /> {/* Right pupil */}
        </g>
        
        {/* Eyebrows */}
        <path d="M40 70 Q48 66 56 70" className="lamp-eyebrow" />
        <path d="M64 70 Q72 66 80 70" className="lamp-eyebrow" />

        {/* Mouth */}
        <path d="M50 95 Q60 100 70 95" className="lamp-mouth" />
        
        {/* Hands */}
        <path d="M60 118 C 50 125, 40 115, 45 105" className="lamp-hand lamp-hand-chin" />
        <g className="lamp-hands-presenting">
          <path d="M30 100 C15 95, 5 105, 15 115" className="lamp-hand" /> {/* Left hand presenting */}
          <path d="M90 100 C105 95, 115 105, 105 115" className="lamp-hand" /> {/* Right hand presenting */}
        </g>

        {/* Magic Sparkles */}
        <g className="lamp-sparkles">
            <circle cx="60" cy="30" r="3" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="20" cy="40" r="2" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="100" cy="45" r="2.5" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>
      </svg>
    </div>
  );
};


export function MagicLampDisplay({ status, isUserTyping }: MagicLampDisplayProps) {
  // Determine effective status: if user is typing and AI is idle, show 'user_typing' visuals.
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;

  return (
    <Card className="mb-4 shadow-xl bg-card/50 border-primary/30 overflow-hidden">
      <CardContent className="pt-4 pb-2 flex flex-col items-center text-center">
        <MagicLampSVG animationClass={currentVisuals.lampAnimationClass} />
        <p className={`font-semibold font-heading text-base sm:text-lg mt-2 text-card-foreground min-h-[2.5em]`}>{currentVisuals.text}</p>
      </CardContent>
    </Card>
  );
}
