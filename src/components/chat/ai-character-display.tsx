
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
  user_typing: { characterAnimationClass: 'character-typing' }, // Listening, will include sitting/attentive pose
  thinking_text: { characterAnimationClass: 'character-thinking-text' }, // Scheming/Pondering with hand on chin
  thinking_image: { characterAnimationClass: 'character-thinking-image' },
  presenting_text: { characterAnimationClass: 'character-presenting-text' },
  presenting_image: { characterAnimationClass: 'character-presenting-image' }, // Excitedly presenting
  error: { characterAnimationClass: 'character-error' },
};

// Expanded Idle Animations
const idleAnimationTypes = [
  'float_bob', 'jump_playful', 'dance_energetic', 'wink_cheeky', 'tongue_out_playful', 'dramatic_pose',
  'disappear_reappear_sparkles', 'look_around_dynamic', 'quick_spin_showoff', 'happy_bounce_big', 
  'scratch_head', 'shrug_confused', 'juggle_sparkles', 'play_cards_simple', 'draw_air', 'pretend_sleep', 'pretend_eat',
  'wave_hello'
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
      let nextDelay = 3000 + Math.random() * 4000; 

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      
      // Default reset to base pose
      const resetStyle = { transform: 'translateY(0) rotate(0deg) scale(1) rotateX(0deg) rotateY(0deg) scaleX(1) translateX(0)', opacity: 1, transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'};


      switch(randType) {
        case 'jump_playful':
          setRandomAnimationStyle({ transform: 'translateY(-30px) scale(1.1) rotate(3deg)', transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' });
          duration = 200;
          break;
        case 'dance_energetic':
          setRandomAnimationStyle({ transform: 'translateX(8px) rotate(6deg)', transition: 'transform 0.15s ease-in-out' });
          resetTimeoutRef.current = setTimeout(() => {
            setRandomAnimationStyle({ transform: 'translateX(-8px) rotate(-6deg)', transition: 'transform 0.15s ease-in-out' });
            setTimeout(() => { setRandomAnimationStyle(resetStyle); }, 150);
          }, 150);
          duration = 450;
          break;
        case 'disappear_reappear_sparkles':
          setRandomAnimationStyle({ opacity: 0, transform: 'scale(0.05) rotate(360deg)', transition: 'opacity 0.4s ease-in, transform 0.5s ease-in-out' });
          duration = 500; 
          resetTimeoutRef.current = setTimeout(() => { 
            setRandomAnimationStyle({ opacity: 1, transform: 'scale(1) rotate(0deg)', transition: 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
          }, 600); 
          nextDelay = 3500; 
          break;
        case 'look_around_dynamic':
           setRandomAnimationStyle({ transform: 'translateX(10px) rotateY(20deg) rotateX(3deg)', transition: 'transform 0.3s ease-in-out'});
           resetTimeoutRef.current = setTimeout(() => {
             setRandomAnimationStyle({ transform: 'translateX(-10px) rotateY(-20deg) rotateX(-3deg)', transition: 'transform 0.3s ease-in-out'});
             setTimeout(() => { setRandomAnimationStyle(resetStyle); }, 300);
           }, 400);
           duration = 1000;
          break;
        case 'scratch_head':
          // This will be handled by adding/removing a class or direct CSS manipulation for hand movement
          // For now, a simple head tilt implies it.
          setRandomAnimationStyle({ transform: 'rotate(5deg) translateY(-5px)', transition: 'transform 0.2s ease-in-out' });
          duration = 200;
          // Later, add a class like `.character-is-scratching-head` which animates a hand to the head
          break;
        case 'shrug_confused':
          setRandomAnimationStyle({ transform: 'translateY(-5px) scale(1.02)', transition: 'transform 0.2s ease-out' });
          // This would also involve eyebrow and mouth changes via CSS classes if more detailed
          duration = 200;
          break;
         // Other new animations like juggle, play_cards, draw_air, pretend_sleep, pretend_eat, wave_hello
         // would follow similar patterns, potentially adding temporary classes for complex SVG part movements
        case 'wave_hello':
          // Placeholder for a wave animation, e.g., slight tilt and a class to animate one hand
          setRandomAnimationStyle({ transform: 'rotate(-5deg) scaleX(0.98)', transition: 'transform 0.2s ease-in-out' });
          duration = 200;
          break;
        default: 
          setRandomAnimationStyle({ transform: `translateY(${Math.random() * -10}px) rotate(${Math.random() * 4 - 2}deg)`, transition: 'transform 0.7s ease-in-out' });
          duration = 700;
          break;
      }
      
      if (randType !== 'disappear_reappear_sparkles' && randType !== 'dance_energetic' && randType !== 'look_around_dynamic') {
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
      setRandomAnimationStyle({ transform: 'translateY(0) rotate(0deg) scale(1) rotateX(0deg) rotateY(0deg) scaleX(1) translateX(0)', opacity: 1, transition: 'transform 0.2s ease-out, opacity 0.2s ease-out' });
    }

    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [animationClass]);

  // Slightly reduced size: e.g. w-44 h-60 sm:w-48 sm:h-68 md:w-56 md:h-78
  return (
     <div className={cn("w-44 h-60 sm:w-48 sm:h-68 md:w-56 md:h-78 character-container", animationClass)} style={randomAnimationStyle}>
      <svg viewBox="0 0 70 90" className="w-full h-full ai-character-svg"> {/* Adjusted viewBox for feet */}
        <ellipse cx="35" cy="87" rx="20" ry="3.5" fill="hsla(var(--background), 0.25)" />

        {/* Head */}
        <circle cx="35" cy="22" r="14" className="character-head-fill" />

        {/* Torso */}
        <ellipse cx="35" cy="50" rx="16" ry="20" className="character-body-fill" />
        
        {/* Ears (for sprouting) */}
        <g className="character-ears-group">
            <path d="M19 18 Q16 10, 21 2 Q23 10, 19 18Z" className="character-ear character-ear-left" transform="translate(-3 -2) rotate(-25 20 10)" />
            <path d="M51 18 Q54 10, 49 2 Q47 10, 51 18Z" className="character-ear character-ear-right" transform="translate(3 -2) rotate(25 50 10)" />
        </g>

        {/* Eyes */}
        <g className="character-eyes-group">
          <ellipse cx="29" cy="22" rx="4" ry="5" className="character-eye character-eye-left" />
          <ellipse cx="41" cy="22" rx="4" ry="5" className="character-eye character-eye-right" />
          <circle cx="29" cy="23" r="1.8" className="character-pupil character-pupil-left" />
          <circle cx="41" cy="23" r="1.8" className="character-pupil character-pupil-right" />
        </g>

        {/* Eyebrows */}
        <path d="M24 15 Q29 13 33 15" className="character-eyebrow character-eyebrow-left" />
        <path d="M37 15 Q41 13 46 15" className="character-eyebrow character-eyebrow-right" />

        {/* Mouth */}
        <path d="M30 30 Q35 33 40 30" className="character-mouth" />

        {/* Arms - simplified path for now, can be more complex */}
        <path d="M19 42 Q15 50 20 65" className="character-limbs-fill character-arm-left" strokeWidth="7" strokeLinecap="round" fill="none" /> 
        <path d="M51 42 Q55 50 50 65" className="character-limbs-fill character-arm-right" strokeWidth="7" strokeLinecap="round" fill="none" />

        {/* Hands - simple circles for now, can be detailed */}
        <circle cx="18" cy="68" r="5" className="character-hands-fill character-hand-left-main" />
        <circle cx="52" cy="68" r="5" className="character-hands-fill character-hand-right-main" />
        
        {/* Legs */}
        <rect x="22" y="65" width="8" height="18" rx="4" className="character-limbs-fill character-leg-left" />
        <rect x="40" y="65" width="8" height="18" rx="4" className="character-limbs-fill character-leg-right" />

        {/* Feet in Shoes */}
        <g className="character-foot" transform="translate(22, 80)"> {/* Left Foot */}
          <ellipse cx="4" cy="3" rx="6" ry="3.5" className="character-shoe-main-fill" /> {/* Red part */}
          <path d="M0 3 Q4 -1 8 3" className="character-shoe-accent-fill" strokeWidth="1.5" fill="none" /> {/* White lace/top */}
        </g>
        <g className="character-foot" transform="translate(40, 80)"> {/* Right Foot */}
           <ellipse cx="4" cy="3" rx="6" ry="3.5" className="character-shoe-main-fill" /> {/* Red part */}
           <path d="M0 3 Q4 -1 8 3" className="character-shoe-accent-fill" strokeWidth="1.5" fill="none" /> {/* White lace/top */}
        </g>

        {/* Hand for 'thinking' - initially hidden */}
        <g className="character-hand-chin">
             <circle cx="45" cy="35" r="5" className="character-hands-fill"/>
        </g>
        {/* Hands for 'presenting' - initially hidden */}
        <g className="character-hands-presenting">
            <circle cx="12" cy="60" r="6" className="character-hands-fill" />
            <circle cx="58" cy="60" r="6" className="character-hands-fill" />
        </g>
        
        {/* Sparkles for effects */}
        <g className="character-sparkles">
            <circle cx="35" cy="5" r="2" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="10" r="1.5" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="12" r="1.8" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        {/* Elements for new animations - initially hidden or styled */}
        <g className="character-prop character-prop-ball" style={{opacity: 0}}>
            <circle cx="50" cy="60" r="4" fill="hsl(var(--turquoise-hsl))"/>
        </g>
        <g className="character-prop character-prop-cards" style={{opacity: 0}}>
            <rect x="10" y="55" width="5" height="8" fill="hsl(var(--pearl-white-hsl))" stroke="hsl(var(--foreground))" strokeWidth="0.5" transform="rotate(-15 12.5 59)"/>
            <rect x="15" y="56" width="5" height="8" fill="hsl(var(--pearl-white-hsl))" stroke="hsl(var(--foreground))" strokeWidth="0.5" transform="rotate(5 17.5 60)"/>
        </g>
         <text x="35" y="15" className="character-prop character-prop-zzz" fill="hsl(var(--muted-foreground))" fontSize="8" textAnchor="middle" style={{opacity: 0}}>Zzz</text>
      </svg>
    </div>
  );
};

export function AiCharacterDisplay({ status, isUserTyping }: AiCharacterDisplayProps) {
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image' || status === 'error') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: '50%', left: '50%', currentAnimationClass: currentVisuals.characterAnimationClass });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let newTopPercentStr = '50%';
    let newLeftPercentStr = '50%';

    if (effectiveStatus === 'user_typing') {
      // When user is typing, move character to a "listening post" e.g. bottom-left, slightly off screen edge
      newTopPercentStr = '75%'; 
      newLeftPercentStr = '15%';
    } else if (effectiveStatus === 'thinking_text' || effectiveStatus === 'thinking_image') {
      // During active AI thinking, might move to a slightly less obstructive, "focus" area
      const thinkingLeft = Math.random() < 0.5 ? (20 + Math.random() * 10) : (70 + Math.random() * 10);
      const thinkingTop = 20 + Math.random() * 15;
      newTopPercentStr = `${thinkingTop}%`;
      newLeftPercentStr = `${thinkingLeft}%`;
    } else if (effectiveStatus === 'idle' || effectiveStatus === 'presenting_text' || effectiveStatus === 'presenting_image') {
      // Free-roaming for idle and presenting states
      // Ensure it doesn't overlap critical UI elements.
      // This needs a more robust check (e.g., against chat area bounding box if possible)
      // For now, a simple boundary check:
      let randomTop = 10 + Math.random() * 80; // 10% to 90% from top
      let randomLeft = 10 + Math.random() * 80; // 10% to 90% from left

      // Try to avoid bottom center (approx where chat input might be)
      if (randomTop > 65 && randomLeft > 30 && randomLeft < 70) {
        randomTop = 30 + Math.random() * 20; // Keep it higher
      }
      // Try to avoid far right lower quadrant (approx where gallery might be)
      if (randomTop > 50 && randomLeft > 60) {
          randomLeft = 20 + Math.random() * 30; // Move it more to the left or center
      }

      newTopPercentStr = `${randomTop}%`;
      newLeftPercentStr = `${randomLeft}%`;
    }
    
    const moveCharacter = () => {
      setPosition(prev => ({
        ...prev,
        top: newTopPercentStr,
        left: newLeftPercentStr,
      }));
    };
    
    const movementDelay = (effectiveStatus === 'idle' || effectiveStatus === 'presenting_text' || effectiveStatus === 'presenting_image') ? (5000 + Math.random() * 5000) : 500;
    const intervalId = setTimeout(moveCharacter, movementDelay);
    
    // Update animation class based on effectiveStatus
    setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));

    return () => {
      clearTimeout(intervalId);
    };
  }, [effectiveStatus, isMounted, currentVisuals.characterAnimationClass]);


  if (!isMounted) {
    return null;
  }

  return (
    <div 
      className="fixed z-0 transition-all duration-[2000ms] sm:duration-[2500ms] ease-out pointer-events-none" // z-0 to be behind chat/gallery
      style={{ 
        top: position.top, 
        left: position.left, 
        transform: 'translate(-50%, -50%)',
      }}
    >
      <AiCharacterSVG animationClass={position.currentAnimationClass} />
    </div>
  );
}

