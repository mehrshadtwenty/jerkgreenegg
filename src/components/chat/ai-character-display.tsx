'use client';

import type { AiStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

// Status config now only drives animation class, text is removed
const statusConfig: Record<AiStatus | 'user_typing', { characterAnimationClass: string }> = {
  idle: { characterAnimationClass: 'character-idle' },
  user_typing: { characterAnimationClass: 'character-typing' },
  thinking_text: { characterAnimationClass: 'character-thinking-text' },
  thinking_image: { characterAnimationClass: 'character-thinking-image' },
  presenting_text: { characterAnimationClass: 'character-presenting-text' },
  presenting_image: { characterAnimationClass: 'character-presenting-image' },
  error: { characterAnimationClass: 'character-error' },
};

// More varied idle animations
const idleAnimationTypes = [
  'float_bob', 'jump', 'mini_wave', 'disappear_reappear', 'look_around', 'subtle_nod',
  'quick_spin', 'peek_a_boo', 'happy_bounce', 'slight_lean'
];

const AiCharacterSVG = ({ animationClass }: { animationClass: string }) => {
  const [randomAnimationStyle, setRandomAnimationStyle] = useState<React.CSSProperties>({});
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const playRandomIdleAnimation = () => {
      if (!animationClass.includes('character-idle')) return;

      const randType = idleAnimationTypes[Math.floor(Math.random() * idleAnimationTypes.length)];
      let duration = 500; 
      let nextDelay = 2000 + Math.random() * 2000; 

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

      switch(randType) {
        case 'jump':
          setRandomAnimationStyle({ transform: 'translateY(-25px) scale(1.1)', transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' });
          duration = 200;
          break;
        case 'mini_wave':
          setRandomAnimationStyle({ transform: 'rotate(10deg) translateX(8px)', transition: 'transform 0.25s ease-in-out' });
           if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
           resetTimeoutRef.current = setTimeout(() => {
            setRandomAnimationStyle({ transform: 'rotate(-10deg) translateX(-8px)', transition: 'transform 0.25s ease-in-out' });
          }, 250);
          duration = 500;
          break;
        case 'disappear_reappear':
          setRandomAnimationStyle({ opacity: 0, transform: 'scale(0.1) rotate(1080deg)', transition: 'opacity 0.6s ease-in, transform 0.8s ease-in-out' });
          duration = 800; 
          if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = setTimeout(() => { 
            setRandomAnimationStyle({ opacity: 1, transform: 'scale(1) rotate(0deg)', transition: 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
          }, 900); 
          nextDelay = 5000; 
          break;
        case 'look_around':
           setRandomAnimationStyle({ transform: 'translateX(12px) rotateY(20deg)', transition: 'transform 0.4s ease-in-out'});
           if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
           resetTimeoutRef.current = setTimeout(() => {
             setRandomAnimationStyle({ transform: 'translateX(-12px) rotateY(-20deg)', transition: 'transform 0.4s ease-in-out'});
           }, 500);
           duration = 1000;
          break;
        case 'subtle_nod':
            setRandomAnimationStyle({ transform: `rotateX(${Math.random() * 15 - 7.5}deg) translateY(-3px)`, transition: 'transform 0.7s ease-in-out' });
            duration = 700;
            break;
        case 'quick_spin':
            setRandomAnimationStyle({ transform: 'rotateY(360deg)', transition: 'transform 0.5s ease-in-out' });
            duration = 500;
            break;
        case 'peek_a_boo': // Character quickly hides and reappears slightly
            setRandomAnimationStyle({ transform: 'translateY(10px) scaleY(0.8)', opacity: 0.7, transition: 'transform 0.2s ease-out, opacity 0.2s ease-out' });
            duration = 200;
            nextDelay = 1500;
            break;
        case 'happy_bounce':
            setRandomAnimationStyle({ transform: 'translateY(-10px)', transition: 'transform 0.15s ease-out alternate 3' }); // Bounces 3 times
            duration = 450; // 0.15s * 3
            break;
        case 'slight_lean':
            setRandomAnimationStyle({ transform: `translateX(${Math.random() > 0.5 ? '5px' : '-5px'}) rotate(${Math.random() * 4 - 2}deg)`, transition: 'transform 0.6s ease-in-out'});
            duration = 600;
            break;
        default: // float_bob
          setRandomAnimationStyle({ transform: `translateY(${Math.random() * -10}px)`, transition: 'transform 0.9s ease-in-out' });
          duration = 900;
          break;
      }
      
      if (randType !== 'disappear_reappear' && randType !== 'mini_wave' && randType !== 'look_around' && randType !== 'happy_bounce') {
        resetTimeoutRef.current = setTimeout(() => {
          setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1) rotateX(0deg) rotateY(0deg) scaleX(1)', opacity: 1, transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'});
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
      // Reset any lingering transforms when not idle
      setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1) rotateX(0deg) rotateY(0deg) scaleX(1)', opacity: 1, transition: 'transform 0.3s ease-out, opacity 0.3s ease-out' });
    }

    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [animationClass]);

  return (
     // Increased size for the character's container
    <div className={cn("relative w-40 h-52 sm:w-48 sm:h-60 md:w-56 md:h-72 character-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 60 85" className="w-full h-full ai-character-svg">
        <ellipse cx="30" cy="82" rx="18" ry="3" fill="hsla(var(--background), 0.3)" />
        <ellipse cx="23" cy="79" rx="5" ry="2.5" className="character-hands-feet-fill" />
        <ellipse cx="37" cy="79" rx="5" ry="2.5" className="character-hands-feet-fill" />
        <rect x="20" y="60" width="7" height="20" rx="3.5" className="character-limbs-fill" />
        <rect x="33" y="60" width="7" height="20" rx="3.5" className="character-limbs-fill" />
        <ellipse cx="30" cy="48" rx="14" ry="18" className="character-body-fill" />
        <circle cx="30" cy="25" r="12" className="character-head-fill" />
        <g className="character-ears-group">
            <path d="M16 20 Q13 15, 18 10 Q20 15, 16 20Z" className="character-ear" transform="translate(-2,0) rotate(-20 17 15)" />
            <path d="M44 20 Q47 15, 42 10 Q40 15, 44 20Z" className="character-ear" transform="translate(2,0) rotate(20 43 15)" />
        </g>
        <g className="character-eyes-group">
          <ellipse cx="25" cy="25" rx="3.5" ry="4.5" className="character-eye" />
          <ellipse cx="35" cy="25" rx="3.5" ry="4.5" className="character-eye" />
          <circle cx="25" cy="26" r="1.5" className="character-pupil" />
          <circle cx="35" cy="26" r="1.5" className="character-pupil" />
        </g>
        <path d="M22 20 Q25 18.5 28 20" className="character-eyebrow" />
        <path d="M32 20 Q35 18.5 38 20" className="character-eyebrow" />
        <path d="M26 31 Q30 33 34 31" className="character-mouth" />
        <path d="M16 40 C 10 45, 10 55, 18 58" className="character-limbs-fill" strokeWidth="5" strokeLinecap="round" fill="none" /> 
        <path d="M44 40 C 50 45, 50 55, 42 58" className="character-limbs-fill" strokeWidth="5" strokeLinecap="round" fill="none" />
        <g className="character-hand-chin">
            <circle cx="38" cy="36" r="4" className="character-hands-feet-fill"/> 
        </g>
        <g className="character-hands-presenting">
            <circle cx="12" cy="50" r="4.5" className="character-hands-feet-fill" />
            <circle cx="48" cy="50" r="4.5" className="character-hands-feet-fill" />
        </g>
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
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image' || status === 'error') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;

  return (
    <Card className="mb-4 shadow-xl bg-transparent border-none overflow-visible">
      <CardContent className="pt-2 pb-0 flex flex-col items-center text-center">
        <AiCharacterSVG animationClass={currentVisuals.characterAnimationClass} />
        {/* Removed the status text paragraph */}
      </CardContent>
    </Card>
  );
}
