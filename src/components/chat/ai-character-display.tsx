'use client';

import type { AiStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

const statusConfig: Record<AiStatus | 'user_typing', { text: string; characterAnimationClass: string }> = {
  idle: { text: "I'm listening... Ask me anything!", characterAnimationClass: 'character-idle' },
  user_typing: { text: "Intriguing... what will you ask?", characterAnimationClass: 'character-typing' },
  thinking_text: { text: "Hmm, let me ponder that...", characterAnimationClass: 'character-thinking-text' },
  thinking_image: { text: "Conjuring a vision for you...", characterAnimationClass: 'character-thinking-image' },
  presenting_text: { text: "Voilà! Here's what I came up with.", characterAnimationClass: 'character-presenting-text' },
  presenting_image: { text: "Behold! Your image is ready.", characterAnimationClass: 'character-presenting-image' },
  error: { text: "Oops! My circuits are a bit frazzled.", characterAnimationClass: 'character-error' },
};

const idleAnimationTypes = ['float_bob', 'jump', 'mini_wave', 'disappear_reappear', 'look_around', 'subtle_nod'];

const AiCharacterSVG = ({ animationClass }: { animationClass: string }) => {
  const [randomAnimationStyle, setRandomAnimationStyle] = useState<React.CSSProperties>({});
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const playRandomIdleAnimation = () => {
      if (!animationClass.includes('character-idle')) return;

      const randType = idleAnimationTypes[Math.floor(Math.random() * idleAnimationTypes.length)];
      let duration = 500; 
      let nextDelay = 2500 + Math.random() * 2500; // Slightly faster idle changes

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

      switch(randType) {
        case 'jump':
          setRandomAnimationStyle({ transform: 'translateY(-20px) scale(1.05)', transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' });
          duration = 200;
          break;
        case 'mini_wave':
          setRandomAnimationStyle({ transform: 'rotate(8deg) translateX(5px)', transition: 'transform 0.25s ease-in-out' });
           if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
           resetTimeoutRef.current = setTimeout(() => {
            setRandomAnimationStyle({ transform: 'rotate(-8deg) translateX(-5px)', transition: 'transform 0.25s ease-in-out' });
          }, 250);
          duration = 500;
          break;
        case 'disappear_reappear':
          setRandomAnimationStyle({ opacity: 0, transform: 'scale(0.2) rotate(720deg)', transition: 'opacity 0.5s ease-in, transform 0.7s ease-in-out' });
          duration = 700; 
          if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = setTimeout(() => { 
            setRandomAnimationStyle({ opacity: 1, transform: 'scale(1) rotate(0deg)', transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
          }, 800); 
          nextDelay = 4500; 
          break;
        case 'look_around':
           setRandomAnimationStyle({ transform: 'translateX(8px) rotateY(15deg)', transition: 'transform 0.35s ease-in-out'});
           if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
           resetTimeoutRef.current = setTimeout(() => {
             setRandomAnimationStyle({ transform: 'translateX(-8px) rotateY(-15deg)', transition: 'transform 0.35s ease-in-out'});
           }, 450);
           duration = 900;
          break;
        case 'subtle_nod':
            setRandomAnimationStyle({ transform: `rotateX(${Math.random() * 10 - 5}deg) translateY(-2px)`, transition: 'transform 0.6s ease-in-out' });
            duration = 600;
            break;
        default: // float_bob
          setRandomAnimationStyle({ transform: `translateY(${Math.random() * -8}px)`, transition: 'transform 0.8s ease-in-out' });
          duration = 800;
          break;
      }
      
      if (randType !== 'disappear_reappear' && randType !== 'mini_wave' && randType !== 'look_around') {
        resetTimeoutRef.current = setTimeout(() => {
          setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1) rotateX(0deg) rotateY(0deg)', opacity: 1, transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'});
        }, duration);
      }
      
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = setTimeout(playRandomIdleAnimation, nextDelay);
    };

    if (animationClass.includes('character-idle')) {
      playRandomIdleAnimation();
    } else {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      setRandomAnimationStyle({ transform: 'none', opacity: 1, transition: 'none' });
    }

    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [animationClass]);

  // SVG ViewBox: min-x, min-y, width, height. Centered 60x80 character.
  return (
    <div className={cn("relative w-32 h-40 sm:w-36 sm:h-44 character-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 60 85" className="w-full h-full ai-character-svg"> {/* Increased height slightly for feet */}
        {/* Shadow */}
        <ellipse cx="30" cy="82" rx="18" ry="3" fill="hsla(var(--background), 0.3)" />

        {/* Feet */}
        <ellipse cx="23" cy="79" rx="5" ry="2.5" className="character-hands-feet-fill" />
        <ellipse cx="37" cy="79" rx="5" ry="2.5" className="character-hands-feet-fill" />
        
        {/* Legs */}
        <rect x="20" y="60" width="7" height="20" rx="3.5" className="character-limbs-fill" />
        <rect x="33" y="60" width="7" height="20" rx="3.5" className="character-limbs-fill" />
        
        {/* Body */}
        <ellipse cx="30" cy="48" rx="14" ry="18" className="character-body-fill" />
        
        {/* Head */}
        <circle cx="30" cy="25" r="12" className="character-head-fill" />

        {/* Ears (for 'typing' state) - slightly pointed */}
        <g className="character-ears-group">
            <path d="M16 20 Q13 15, 18 10 Q20 15, 16 20Z" className="character-ear" transform="translate(-2,0) rotate(-20 17 15)" />
            <path d="M44 20 Q47 15, 42 10 Q40 15, 44 20Z" className="character-ear" transform="translate(2,0) rotate(20 43 15)" />
        </g>

        {/* Eyes */}
        <g className="character-eyes-group">
          <ellipse cx="25" cy="25" rx="3.5" ry="4.5" className="character-eye" />
          <ellipse cx="35" cy="25" rx="3.5" ry="4.5" className="character-eye" />
          <circle cx="25" cy="26" r="1.5" className="character-pupil" />
          <circle cx="35" cy="26" r="1.5" className="character-pupil" />
        </g>
        
        {/* Eyebrows */}
        <path d="M22 20 Q25 18.5 28 20" className="character-eyebrow" />
        <path d="M32 20 Q35 18.5 38 20" className="character-eyebrow" />

        {/* Mouth */}
        <path d="M26 31 Q30 33 34 31" className="character-mouth" />
        
        {/* Arms & Hands */}
        {/* Static Arms (can be animated with more complexity) */}
        <path d="M16 40 C 10 45, 10 55, 18 58" className="character-limbs-fill" strokeWidth="5" strokeLinecap="round" fill="none" /> 
        <path d="M44 40 C 50 45, 50 55, 42 58" className="character-limbs-fill" strokeWidth="5" strokeLinecap="round" fill="none" />
        
        {/* Hand for "thinking" (hand under chin) */}
        <g className="character-hand-chin">
            <circle cx="38" cy="36" r="4" className="character-hands-feet-fill"/> 
        </g>
        {/* Hands for "presenting" */}
        <g className="character-hands-presenting">
            <circle cx="12" cy="50" r="4.5" className="character-hands-feet-fill" /> {/* Left hand */}
            <circle cx="48" cy="50" r="4.5" className="character-hands-feet-fill" /> {/* Right hand */}
        </g>

        {/* Magic Sparkles */}
        <g className="character-sparkles">
            <circle cx="30" cy="5" r="2" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="12" cy="10" r="1.5" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="48" cy="12" r="1.8" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>
      </svg>
    </div>
  );
};

export function AiCharacterDisplay({ status, isUserTyping }: AiCharacterDisplayProps) {
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;

  return (
    <Card className="mb-4 shadow-xl bg-card/50 border-primary/30 overflow-hidden">
      <CardContent className="pt-4 pb-2 flex flex-col items-center text-center">
        <AiCharacterSVG animationClass={currentVisuals.characterAnimationClass} />
        <p className={`font-semibold font-heading text-base sm:text-lg mt-2 text-card-foreground min-h-[2.5em]`}>{currentVisuals.text}</p>
      </CardContent>
    </Card>
  );
}
