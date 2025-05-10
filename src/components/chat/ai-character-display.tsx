
'use client';

import type { AiStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

// Status mapping for Pickle Rick
const statusConfig: Record<AiStatus | 'user_typing', { characterAnimationClass: string }> = {
  idle: { characterAnimationClass: 'character-idle pickle-float-bob' }, // Pickle Rick floats/bobs
  user_typing: { characterAnimationClass: 'character-user_typing' }, // Attentive Pickle Rick, antenna animation
  thinking_text: { characterAnimationClass: 'character-thinking_text' }, // Pickle Rick pondering
  thinking_image: { characterAnimationClass: 'character-thinking_image' }, // Pickle Rick concentrating for image
  presenting_text: { characterAnimationClass: 'character-presenting_text' }, // Smug Pickle Rick
  presenting_image: { characterAnimationClass: 'character-presenting_image' }, // Excited Pickle Rick with image
  error: { characterAnimationClass: 'character-error' }, // Glitching Pickle Rick
};

// Expanded Idle Animations for Pickle Rick
const idleAnimationTypes = [
  'float_bob', 'jump_playful', 'quick_spin_showoff', 'wink_cheeky', 'tongue_out_playful',
  'disappear_reappear_sparkles', 'look_around_dynamic', 'shrug_confused', 
  'pretend_sleep', // Zzz
  'laser_eyes_briefly', // A quick flash from eyes
  'maniacal_laugh_pose' // A specific pose suggesting laughter
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
      let nextDelay = 4000 + Math.random() * 5000; 

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      
      const resetStyle = { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1, transition: 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out'};

      switch(randType) {
        case 'jump_playful':
          setRandomAnimationStyle({ transform: 'translateY(-20px) scale(1.05) rotate(2deg)', transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' });
          duration = 150;
          break;
        case 'quick_spin_showoff':
          setRandomAnimationStyle({ transform: 'rotate(360deg) scale(1.1)', transition: 'transform 0.4s ease-out' });
          duration = 400;
          break;
        case 'disappear_reappear_sparkles':
          setRandomAnimationStyle({ opacity: 0, transform: 'scale(0.1) rotate(180deg)', transition: 'opacity 0.3s ease-in, transform 0.4s ease-in-out' });
          duration = 400; 
          resetTimeoutRef.current = setTimeout(() => { 
            setRandomAnimationStyle({ opacity: 1, transform: 'scale(1) rotate(0deg)', transition: 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
          }, 500); 
          nextDelay = 4000; 
          break;
        case 'look_around_dynamic': // Achieved by pupil and unibrow animation primarily
           setRandomAnimationStyle({ transform: 'rotateY(15deg)', transition: 'transform 0.2s ease-in-out'});
           resetTimeoutRef.current = setTimeout(() => {
             setRandomAnimationStyle({ transform: 'rotateY(-15deg)', transition: 'transform 0.2s ease-in-out'});
             setTimeout(() => { setRandomAnimationStyle(resetStyle); }, 200);
           }, 300);
           duration = 700;
          break;
        case 'shrug_confused': // Body tilt and unibrow animation
          setRandomAnimationStyle({ transform: 'translateY(-3px) rotate(4deg)', transition: 'transform 0.15s ease-out' });
          duration = 150;
          break;
        case 'laser_eyes_briefly': // Placeholder: could be a sparkle effect on eyes or a class change
          setRandomAnimationStyle({ filter: 'brightness(1.5) drop-shadow(0 0 3px hsl(var(--ruby-red-hsl)))' , transition: 'filter 0.1s ease-in-out'});
          duration = 100;
          break;
        case 'maniacal_laugh_pose':
          setRandomAnimationStyle({ transform: 'rotate(-5deg) scale(1.02) translateY(-3px)', transition: 'transform 0.2s ease-out' });
          // This would pair with mouth and unibrow changes in CSS
          duration = 200;
          break;
        default: // Default float_bob handled by class, this adds subtle random tweaks
          setRandomAnimationStyle({ transform: `translateY(${Math.random() * -5}px) rotate(${Math.random() * 3 - 1.5}deg)`, transition: 'transform 0.8s ease-in-out' });
          duration = 800;
          break;
      }
      
      if (randType !== 'disappear_reappear_sparkles' && randType !== 'look_around_dynamic') {
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = setTimeout(() => {
          setRandomAnimationStyle(resetStyle);
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
      setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1, transition: 'transform 0.2s ease-out, opacity 0.2s ease-out' });
    }

    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [animationClass]);

  // Slightly smaller Pickle Rick: w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48
  // ViewBox adjusted for a typical pickle shape. Approx 50 wide, 80 tall.
  return (
     <div className={cn("w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48 character-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 50 80" className="w-full h-full ai-character-svg">
        <defs>
          {/* Potential gradients for pickle body if desired */}
        </defs>
        
        {/* Shadow Ellipse */}
        <ellipse cx="25" cy="78" rx="15" ry="2.5" fill="hsla(var(--background), 0.2)" />

        {/* Main Pickle Body */}
        <ellipse cx="25" cy="40" rx="18" ry="35" className="character-body-pickle" />
        {/* Some pickle bumps/texture (optional) */}
        <circle cx="15" cy="30" r="3" fill="hsl(var(--character-pickle-light-green-hsl))" opacity="0.5"/>
        <circle cx="33" cy="50" r="2.5" fill="hsl(var(--character-pickle-light-green-hsl))" opacity="0.5"/>
        <circle cx="20" cy="60" r="2" fill="hsl(var(--character-pickle-light-green-hsl))" opacity="0.5"/>

        {/* Rick's Face */}
        {/* Antenna for user_typing state */}
        <path d="M25 5 Q23 2 25 0 Q27 2 25 5" className="character-antenna" />

        {/* Eyes */}
        <g className="character-eyes-group" transform="translate(0, -5)">
          <circle cx="18" cy="25" r="6" className="character-eye-white character-eye-left" />
          <circle cx="32" cy="25" r="6" className="character-eye-white character-eye-right" />
          <circle cx="18" cy="25" r="2.5" className="character-pupil character-pupil-left" />
          <circle cx="32" cy="25" r="2.5" className="character-pupil character-pupil-right" />
        </g>

        {/* Unibrow - default path, controlled by CSS classes */}
        <path d="M 15 15 Q 25 12 35 15" className="character-unibrow" />

        {/* Mouth - default path, controlled by CSS classes */}
        {/* Example: path("M 18 35 Q 25 38 32 35") */}
        <path d="M 18 35 Q 25 38 32 35" className="character-mouth" />
        {/* Tongue (optional, can be shown with certain mouth shapes) */}
        {/* <path d="M 22 36 Q 25 37 28 36" className="character-tongue" opacity="0" /> */}


        {/* Simplified Limbs (Arms) - for hand-on-chin and presenting */}
        {/* These groups are toggled by opacity/transform in CSS */}
        <g className="character-limbs-group">
            {/* Left Arm (for chin) - part of character-hand-chin-group */}
            <g className="character-hand-chin-group">
                 <path d="M10 45 Q 5 50 12 55" className="pickle-arm" transform="rotate(-10 10 45)" />
                 <circle cx="12" cy="56" r="3" className="pickle-hand" />
            </g>
            {/* Both Arms (for presenting) - part of character-hands-presenting-group */}
            <g className="character-hands-presenting-group">
                <path d="M10 45 Q0 55 10 65" className="pickle-arm" transform="rotate(-30 10 45)" />
                <circle cx="9" cy="66" r="4" className="pickle-hand" />
                <path d="M40 45 Q50 55 40 65" className="pickle-arm" transform="rotate(30 40 45)" />
                <circle cx="41" cy="66" r="4" className="pickle-hand" />
            </g>
        </g>
        
        {/* Sparkles for effects - remains similar */}
        <g className="character-sparkles">
            <circle cx="25" cy="10" r="1.5" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="10" cy="15" r="1" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="40" cy="12" r="1.2" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        {/* Props for idle animations - simplified */}
        <g className="character-prop-group">
            <circle cx="35" cy="65" r="3" fill="hsl(var(--turquoise-hsl))" className="character-prop-ball" style={{opacity:0}}/>
            <text x="25" y="15" className="character-prop-zzz" fill="hsl(var(--muted-foreground))" fontSize="6" textAnchor="middle" style={{opacity: 0}}>Zzz</text>
        </g>
      </svg>
    </div>
  );
};

export function AiCharacterDisplay({ status, isUserTyping }: AiCharacterDisplayProps) {
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image' || status === 'error') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: '10%', left: '10%', currentAnimationClass: currentVisuals.characterAnimationClass });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let newTopPercentStr = '10%'; // Default to top-leftish area
    let newLeftPercentStr = '10%';

    if (effectiveStatus === 'user_typing') {
      // Pickle Rick near chat input area but not overlapping - e.g., bottom-left of viewport, or side of chat
      newTopPercentStr = '75%'; 
      newLeftPercentStr = '10%'; // Keep to the left side, lower down
    } else if (effectiveStatus === 'thinking_text' || effectiveStatus === 'thinking_image') {
      // Pickle Rick can move to a "focus" area, still avoiding center
      const thinkingLeft = Math.random() < 0.5 ? (10 + Math.random() * 15) : (75 + Math.random() * 15); // Far left or far right
      const thinkingTop = 15 + Math.random() * 20; // Upper part of screen
      newTopPercentStr = `${thinkingTop}%`;
      newLeftPercentStr = `${thinkingLeft}%`;
    } else if (effectiveStatus === 'idle' || effectiveStatus === 'presenting_text' || effectiveStatus === 'presenting_image' || effectiveStatus === 'error') {
      // Free-roaming Pickle Rick, avoiding chat (center) and gallery (bottom center/full width)
      let randomTop, randomLeft;
      const sideOrTopRoll = Math.random();

      if (sideOrTopRoll < 0.4) { // Top strip (wider to allow more movement here)
        randomTop = 5 + Math.random() * 10;  // 5% to 15% from top (above chat)
        randomLeft = 5 + Math.random() * 90; // Can roam almost full width here
      } else if (sideOrTopRoll < 0.7) { // Left gutter
        randomTop = 15 + Math.random() * 45; // 15% to 60% from top (main area, left of chat)
        randomLeft = 5 + Math.random() * 15;  // 5% to 20% from left
      } else { // Right gutter
        randomTop = 15 + Math.random() * 45; // 15% to 60% from top (main area, right of chat)
        randomLeft = 80 + Math.random() * 15; // 80% to 95% from left
      }
      newTopPercentStr = `${Math.max(5, Math.min(85, randomTop))}%`; // Clamp values
      newLeftPercentStr = `${Math.max(5, Math.min(95, randomLeft))}%`;
    }
    
    const moveCharacter = () => {
      setPosition(prev => ({
        ...prev,
        top: newTopPercentStr,
        left: newLeftPercentStr,
      }));
    };
    
    // Pickle Rick moves a bit more erratically/frequently
    const movementDelay = (effectiveStatus === 'idle' || effectiveStatus === 'presenting_text' || effectiveStatus === 'presenting_image') ? (3500 + Math.random() * 3000) : 400;
    const timeoutId = setTimeout(moveCharacter, movementDelay); // Changed from interval to timeout for single move then re-eval
    
    setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));

    return () => {
      clearTimeout(timeoutId);
    };
  }, [effectiveStatus, isMounted, currentVisuals.characterAnimationClass]);


  if (!isMounted) {
    return null;
  }

  return (
    <div 
      className="fixed z-0 pointer-events-none" 
      style={{ 
        top: position.top, 
        left: position.left, 
        transform: 'translate(-50%, -50%)',
        // transition properties are now on .character-container in CSS for smoother application
      }}
    >
      <AiCharacterSVG animationClass={cn(position.currentAnimationClass, effectiveStatus === 'idle' ? 'pickle-float-bob' : '')} />
    </div>
  );
}
