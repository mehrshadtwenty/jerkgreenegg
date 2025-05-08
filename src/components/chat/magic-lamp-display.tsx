'use client';

import type { AiStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

// Renamed lampAnimationClass to characterAnimationClass
const statusConfig: Record<AiStatus | 'user_typing', { text: string; characterAnimationClass: string }> = {
  idle: { text: "I'm listening... Ask me anything!", characterAnimationClass: 'character-idle' },
  user_typing: { text: "Intriguing... what will you ask?", characterAnimationClass: 'character-typing' },
  thinking_text: { text: "Hmm, let me think...", characterAnimationClass: 'character-thinking-text' },
  thinking_image: { text: "Conjuring a vision for you...", characterAnimationClass: 'character-thinking-image' },
  presenting_text: { text: "Voilà! Here's what I think.", characterAnimationClass: 'character-presenting-text' },
  presenting_image: { text: "Behold! Your image is ready.", characterAnimationClass: 'character-presenting-image' },
  error: { text: "Oops! My circuits are a bit tangled.", characterAnimationClass: 'character-error' },
};

// Humanoid appropriate idle animations
const idleAnimationTypes = ['float_bob', 'jump', 'mini_wave', 'disappear_reappear', 'look_around', 'subtle_tilt'];

const AiCharacterSVG = ({ animationClass }: { animationClass: string }) => {
  const [randomAnimationStyle, setRandomAnimationStyle] = useState<React.CSSProperties>({});
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const playRandomIdleAnimation = () => {
      if (!animationClass.includes('character-idle')) return;

      const randType = idleAnimationTypes[Math.floor(Math.random() * idleAnimationTypes.length)];
      let duration = 500; 
      let nextDelay = 3000 + Math.random() * 2000;

      // Clear previous multi-stage animation timeouts
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

      switch(randType) {
        case 'jump':
          setRandomAnimationStyle({ transform: 'translateY(-15px) scale(1.05)', transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' });
          duration = 250;
          break;
        case 'mini_wave':
          // This will be a simple arm wave, assuming arm element ID 'right-arm'
          // More complex animation would require more intricate SVG and CSS
          setRandomAnimationStyle({ transform: 'rotate(5deg)', transition: 'transform 0.2s ease-in-out' });
           if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
           resetTimeoutRef.current = setTimeout(() => {
            // Find arm and animate it, this is a simplified version
            // For a real wave, you'd target an arm element and rotate it
            setRandomAnimationStyle({ transform: 'rotate(-5deg)', transition: 'transform 0.2s ease-in-out' });
          }, 200);
          duration = 400;
          break;
        case 'disappear_reappear':
          setRandomAnimationStyle({ opacity: 0, transform: 'scale(0.3) rotate(360deg)', transition: 'opacity 0.4s ease-in, transform 0.6s ease-in-out' });
          duration = 600; 
          if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = setTimeout(() => { 
            setRandomAnimationStyle({ opacity: 1, transform: 'scale(1) rotate(0deg)', transition: 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
          }, 700); 
          nextDelay = 5000; 
          break;
        case 'look_around':
           setRandomAnimationStyle({ transform: 'translateX(5px) rotateY(10deg)', transition: 'transform 0.3s ease-in-out'});
           if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
           resetTimeoutRef.current = setTimeout(() => {
             setRandomAnimationStyle({ transform: 'translateX(-5px) rotateY(-10deg)', transition: 'transform 0.3s ease-in-out'});
           }, 400);
           duration = 800;
          break;
        case 'subtle_tilt':
            setRandomAnimationStyle({ transform: `rotate(${Math.random() * 6 - 3}deg)`, transition: 'transform 0.7s ease-in-out' });
            duration = 700;
            break;
        default: // float_bob
          setRandomAnimationStyle({ transform: `translateY(${Math.random() * -5}px)`, transition: 'transform 0.7s ease-in-out' });
          duration = 700;
          break;
      }
      
      // Reset to base idle bobbing style after the specific animation
      // if it's not a multi-stage one that handles its own reset (like disappear_reappear)
      if (randType !== 'disappear_reappear' && randType !== 'mini_wave' && randType !== 'look_around') {
        resetTimeoutRef.current = setTimeout(() => {
          setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1, transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'});
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

  // Simple Humanoid SVG - viewBox adjusted for a smaller character
  // ViewBox: min-x, min-y, width, height. Adjusted to center a 60x80 character.
  return (
    <div className={cn("relative w-28 h-36 sm:w-32 sm:h-40 character-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 60 80" className="w-full h-full ai-character-svg">
        {/* Shadow (optional, simple ellipse) */}
        <ellipse cx="30" cy="78" rx="20" ry="3" fill="rgba(0,0,0,0.2)" />

        {/* Legs */}
        <rect x="22" y="60" width="6" height="15" rx="3" className="character-limbs-fill" />
        <rect x="32" y="60" width="6" height="15" rx="3" className="character-limbs-fill" />
        <ellipse cx="25" cy="75" rx="4" ry="2.5" className="character-hands-feet-fill" />
        <ellipse cx="35" cy="75" rx="4" ry="2.5" className="character-hands-feet-fill" />
        
        {/* Body */}
        <ellipse cx="30" cy="45" rx="12" ry="18" className="character-body-fill" />
        
        {/* Head */}
        <circle cx="30" cy="23" r="10" className="character-head-fill" />

        {/* Ears (animated for 'typing' state) - simple triangles */}
        <g className="character-ears-group">
            <path d="M18 18 L15 23 L21 23 Z" className="character-ear" transform="rotate(-15 18 20.5)" /> {/* Left Ear */}
            <path d="M42 18 L45 23 L39 23 Z" className="character-ear" transform="rotate(15 42 20.5)" /> {/* Right Ear */}
        </g>

        {/* Eyes group */}
        <g className="character-eyes-group">
          <ellipse cx="26" cy="23" rx="3" ry="4" className="character-eye" /> {/* Left Eye */}
          <ellipse cx="34" cy="23" rx="3" ry="4" className="character-eye" /> {/* Right Eye */}
          <circle cx="26" cy="24" r="1.2" className="character-pupil" /> {/* Left pupil */}
          <circle cx="34" cy="24" r="1.2" className="character-pupil" /> {/* Right pupil */}
        </g>
        
        {/* Eyebrows */}
        <path d="M23 18 Q26 17 29 18" className="character-eyebrow" /> {/* Left Eyebrow */}
        <path d="M31 18 Q34 17 37 18" className="character-eyebrow" /> {/* Right Eyebrow */}

        {/* Mouth */}
        <path d="M27 29 Q30 31 33 29" className="character-mouth" />
        
        {/* Hands & Arms (simplified) */}
        {/* Hand for "thinking" - placed near chin area */}
        <g className="character-hand-chin">
            <path d="M38 35 Q42 38 40 42 Q36 40 38 35Z" className="character-hands-feet-fill" /> 
        </g>
        {/* Hands for "presenting" - positioned to look like extending forward */}
        <g className="character-hands-presenting">
            <path d="M10 45 Q5 42 10 38 L15 40 Z" className="character-hands-feet-fill" /> {/* Left hand */}
            <path d="M50 45 Q55 42 50 38 L45 40 Z" className="character-hands-feet-fill" /> {/* Right hand */}
        </g>
        {/* Basic arms - these will be static unless more complex animation is added */}
        <line x1="20" y1="38" x2="15" y2="48" className="character-limbs-fill" strokeWidth="4" strokeLinecap='round' /> 
        <line x1="40" y1="38" x2="45" y2="48" className="character-limbs-fill" strokeWidth="4" strokeLinecap='round' />

        {/* Magic Sparkles */}
        <g className="character-sparkles">
            <circle cx="30" cy="8" r="1.5" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="12" r="1" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="45" cy="15" r="1.2" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
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
        {/* Changed MagicLampSVG to AiCharacterSVG and animationClass prop */}
        <AiCharacterSVG animationClass={currentVisuals.characterAnimationClass} />
        <p className={`font-semibold font-heading text-base sm:text-lg mt-2 text-card-foreground min-h-[2.5em]`}>{currentVisuals.text}</p>
      </CardContent>
    </Card>
  );
}
