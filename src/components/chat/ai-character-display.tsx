
'use client';

import type { AiStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

const statusConfig: Record<AiStatus | 'user_typing', { characterAnimationClass: string }> = {
  idle: { characterAnimationClass: 'character-idle' },
  user_typing: { characterAnimationClass: 'character-typing' }, // Listening
  thinking_text: { characterAnimationClass: 'character-thinking-text' }, // Scheming/Pondering
  thinking_image: { characterAnimationClass: 'character-thinking-image' },
  presenting_text: { characterAnimationClass: 'character-presenting-text' },
  presenting_image: { characterAnimationClass: 'character-presenting-image' }, // Excitedly presenting
  error: { characterAnimationClass: 'character-error' },
};

// Expanded Idle Animations
const idleAnimationTypes = [
  'float_bob', 'jump_playful', 'dance_energetic', 'wink_cheeky', 'tongue_out_playful', 'dramatic_pose',
  'disappear_reappear_sparkles', 'look_around_dynamic', 'quick_spin_showoff', 'happy_bounce_big', 'slight_lean_cool',
  // 'kick_ball' // This would require a separate ball element and more complex animation logic
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
      let nextDelay = 3000 + Math.random() * 3000; 

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

      switch(randType) {
        case 'jump_playful':
          setRandomAnimationStyle({ transform: 'translateY(-35px) scale(1.15) rotate(5deg)', transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' });
          duration = 250;
          break;
        case 'dance_energetic': // Example: a little shimmy
          setRandomAnimationStyle({ transform: 'translateX(10px) rotate(8deg)', transition: 'transform 0.2s ease-in-out' });
          if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = setTimeout(() => {
            setRandomAnimationStyle({ transform: 'translateX(-10px) rotate(-8deg)', transition: 'transform 0.2s ease-in-out' });
            setTimeout(() => {
                setRandomAnimationStyle({ transform: 'translateX(0px) rotate(0deg)', transition: 'transform 0.2s ease-in-out' });
            }, 200);
          }, 200);
          duration = 600;
          break;
        case 'disappear_reappear_sparkles':
          setRandomAnimationStyle({ opacity: 0, transform: 'scale(0.1) rotate(720deg)', transition: 'opacity 0.5s ease-in, transform 0.7s ease-in-out' });
          duration = 700; 
          if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = setTimeout(() => { 
            setRandomAnimationStyle({ opacity: 1, transform: 'scale(1) rotate(0deg)', transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
          }, 800); 
          nextDelay = 4000; 
          break;
        case 'look_around_dynamic':
           setRandomAnimationStyle({ transform: 'translateX(15px) rotateY(25deg) rotateX(5deg)', transition: 'transform 0.4s ease-in-out'});
           if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
           resetTimeoutRef.current = setTimeout(() => {
             setRandomAnimationStyle({ transform: 'translateX(-15px) rotateY(-25deg) rotateX(-5deg)', transition: 'transform 0.4s ease-in-out'});
           }, 500);
           duration = 1000;
          break;
        case 'wink_cheeky': // Uses CSS animation defined in globals.css
            // This could trigger a class that changes one eye path
            // For simplicity, let's do a quick scale on one eye via a more complex selector if we had one
            // Or, a slight head tilt + eye squint could imply it
            setRandomAnimationStyle({ transform: 'rotate(-5deg) scaleX(0.95)', transition: 'transform 0.2s ease-in-out'});
            duration = 200;
            break;
        case 'tongue_out_playful': // Needs specific mouth path change
            setRandomAnimationStyle({ transform: 'scale(1.05)', transition: 'transform 0.15s ease-in-out'});
            // Actual tongue out would be changing the 'character-mouth' d attribute in CSS.
            duration = 150;
            break;
        case 'dramatic_pose':
            setRandomAnimationStyle({ transform: 'scale(1.1) rotate(10deg) translateY(-10px)', transition: 'transform 0.3s ease-out' });
            duration = 300;
            break;
        default: // float_bob or similar
          setRandomAnimationStyle({ transform: `translateY(${Math.random() * -15}px) rotate(${Math.random() * 6 - 3}deg)`, transition: 'transform 0.9s ease-in-out' });
          duration = 900;
          break;
      }
      
      if (randType !== 'disappear_reappear_sparkles' && randType !== 'dance_energetic' && randType !== 'look_around_dynamic') {
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
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
      // Reset to a base pose quickly when not idle
      setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1) rotateX(0deg) rotateY(0deg) scaleX(1)', opacity: 1, transition: 'transform 0.2s ease-out, opacity 0.2s ease-out' });
    }

    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [animationClass]);

  // Increased size. Original: w-40 h-52 to w-56 h-72. New: approx 50% larger
  // E.g. w-60 h-78 sm:w-72 sm:h-90 md:w-84 md:h-105
  return (
     <div className={cn("w-52 h-70 sm:w-60 sm:h-80 md:w-72 md:h-96 character-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 70 100" className="w-full h-full ai-character-svg">
        {/* Shadow a bit larger */}
        <ellipse cx="35" cy="97" rx="22" ry="4" fill="hsla(var(--background), 0.3)" />

        {/* Body parts - more humanoid */}
        {/* Feet - precisely positioned */}
        <ellipse cx="25" cy="92" rx="7" ry="3.5" className="character-hands-feet-fill character-foot-left" />
        <ellipse cx="45" cy="92" rx="7" ry="3.5" className="character-hands-feet-fill character-foot-right" />
        
        {/* Legs */}
        <rect x="20" y="65" width="10" height="28" rx="5" className="character-limbs-fill character-leg-left" />
        <rect x="40" y="65" width="10" height="28" rx="5" className="character-limbs-fill character-leg-right" />

        {/* Torso - larger */}
        <ellipse cx="35" cy="50" rx="18" ry="22" className="character-body-fill" />
        
        {/* Head - larger */}
        <circle cx="35" cy="22" r="15" className="character-head-fill" />

        {/* Ears (for sprouting) - initially small/hidden */}
        <g className="character-ears-group">
            <path d="M18 18 Q15 10, 20 2 Q22 10, 18 18Z" className="character-ear character-ear-left" transform="translate(-3 -2) rotate(-25 19 10)" />
            <path d="M52 18 Q55 10, 50 2 Q48 10, 52 18Z" className="character-ear character-ear-right" transform="translate(3 -2) rotate(25 51 10)" />
        </g>

        {/* Eyes - expressive, larger */}
        <g className="character-eyes-group">
          <ellipse cx="28" cy="22" rx="4.5" ry="5.5" className="character-eye character-eye-left" />
          <ellipse cx="42" cy="22" rx="4.5" ry="5.5" className="character-eye character-eye-right" />
          <circle cx="28" cy="23" r="2" className="character-pupil character-pupil-left" />
          <circle cx="42" cy="23" r="2" className="character-pupil character-pupil-right" />
        </g>

        {/* Eyebrows - expressive paths */}
        <path d="M22 15 Q28 13 32 15" className="character-eyebrow character-eyebrow-left" />
        <path d="M38 15 Q42 13 48 15" className="character-eyebrow character-eyebrow-right" />

        {/* Mouth - expressive path */}
        <path d="M30 30 Q35 33 40 30" className="character-mouth" />

        {/* Arms and Hands (simple representation) */}
        {/* Arms */}
        <path d="M17 40 C 10 42, 8 55, 18 60" className="character-limbs-fill character-arm-left" strokeWidth="8" strokeLinecap="round" fill="none" /> 
        <path d="M53 40 C 60 42, 62 55, 52 60" className="character-limbs-fill character-arm-right" strokeWidth="8" strokeLinecap="round" fill="none" />
        
        {/* Hands (for presenting, thinking) */}
        {/* Hand for 'thinking' - initially hidden, positioned near chin */}
        <g className="character-hand-chin">
            <ellipse cx="43" cy="33" rx="5" ry="4" className="character-hands-feet-fill character-hand-right"/> 
        </g>
        {/* Hands for 'presenting' - initially hidden */}
        <g className="character-hands-presenting">
            <ellipse cx="10" cy="55" rx="6" ry="5" className="character-hands-feet-fill character-hand-left" />
            <ellipse cx="60" cy="55" rx="6" ry="5" className="character-hands-feet-fill character-hand-right" />
        </g>

        {/* Sparkles for effects */}
        <g className="character-sparkles">
            <circle cx="35" cy="5" r="2.5" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="10" r="2" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="12" r="2.2" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>
      </svg>
    </div>
  );
};

export function AiCharacterDisplay({ status, isUserTyping }: AiCharacterDisplayProps) {
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image' || status === 'error') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;
  const [isMounted, setIsMounted] = useState(false);
  // Initial position can be more central or varied now
  const [position, setPosition] = useState({ top: '50%', left: '50%' }); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const moveCharacter = () => {
      // Allow movement across a wider range of the screen
      // Ensure it doesn't overlap too much with critical UI elements like chat input when active
      let newTopPercent, newLeftPercent;

      // More dynamic positioning
      newTopPercent = 10 + Math.random() * 80; // 10% to 90% from top
      newLeftPercent = 10 + Math.random() * 80; // 10% to 90% from left

      // Avoid bottom center where chat input is typically focused
      if (newTopPercent > 70 && newLeftPercent > 30 && newLeftPercent < 70) {
        newTopPercent = 50 + Math.random() * 20; // Keep it higher if it's in the bottom-center horizontal zone
      }
      
      setPosition({
        top: `${newTopPercent}%`,
        left: `${newLeftPercent}%`,
      });
    };

    let intervalId: NodeJS.Timeout | null = null;
    if (status === 'idle' || status === 'presenting_text' || status === 'presenting_image') {
      intervalId = setInterval(moveCharacter, 5000 + Math.random() * 5000); // Move every 5-10 seconds
      moveCharacter(); // Initial random move when becoming idle
    } else if (status === 'thinking_text' || status === 'thinking_image' || status === 'user_typing') {
      // During active states, might move to a slightly less obstructive, but still visible "focus" area
      const thinkingLeft = Math.random() < 0.5 ? (20 + Math.random() * 15) : (65 + Math.random() * 15); // 20-35% or 65-80%
      const thinkingTop = 15 + Math.random() * 20; // 15-35% from top
      setPosition({ top: `${thinkingTop}%`, left: `${thinkingLeft}%` });
    }


    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, isMounted]);


  if (!isMounted) {
    return null;
  }

  return (
    <div 
      className="fixed z-10 transition-all duration-[2000ms] sm:duration-[2500ms] ease-out pointer-events-none"
      style={{ 
        top: position.top, 
        left: position.left, 
        transform: 'translate(-50%, -50%)',
      }}
    >
      <AiCharacterSVG animationClass={currentVisuals.characterAnimationClass} />
    </div>
  );
}
