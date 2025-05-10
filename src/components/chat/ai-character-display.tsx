
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
  idle: { characterAnimationClass: 'character-idle' }, 
  user_typing: { characterAnimationClass: 'character-user_typing' }, 
  thinking_text: { characterAnimationClass: 'character-thinking_text' }, 
  thinking_image: { characterAnimationClass: 'character-thinking_image' }, 
  presenting_text: { characterAnimationClass: 'character-presenting_text' },
  presenting_image: { characterAnimationClass: 'character-presenting_image' },
  error: { characterAnimationClass: 'character-error' },
};

// Expanded Idle Animations for Pickle Rick
const idleAnimationTypes = [
  'default_bob', 'jump_playful', 'quick_spin_showoff', 
  'disappear_reappear_sparkles', 'look_around_dynamic', 
  'shrug_confused', 'maniacal_laugh_pose', 'juggle_ball', 'sleeping'
];


const AiCharacterSVG = ({ animationClass }: { animationClass: string }) => {
  const [currentIdleSubAnimation, setCurrentIdleSubAnimation] = useState('is-bobbing');
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const playRandomIdleAnimation = () => {
      if (!animationClass.includes('character-idle')) {
        setCurrentIdleSubAnimation(''); // Clear sub-animation if not idle
        return;
      }

      const randType = idleAnimationTypes[Math.floor(Math.random() * idleAnimationTypes.length)];
      let nextDelay = 4000 + Math.random() * 3000;

      // Apply a class for the specific idle sub-animation
      // The actual animation details are in globals.css
      switch(randType) {
        case 'jump_playful':
          setCurrentIdleSubAnimation('is-jumping');
          nextDelay = 1000; // Shorter delay after a jump
          break;
        case 'quick_spin_showoff':
          setCurrentIdleSubAnimation('is-spinning');
          nextDelay = 1500;
          break;
        case 'disappear_reappear_sparkles':
          setCurrentIdleSubAnimation('is-teleporting');
          nextDelay = 2500;
          break;
        case 'look_around_dynamic':
          setCurrentIdleSubAnimation('is-looking-around');
          nextDelay = 2000;
          break;
        case 'shrug_confused':
          setCurrentIdleSubAnimation('is-shrugging');
          nextDelay = 1200;
          break;
        case 'maniacal_laugh_pose':
          setCurrentIdleSubAnimation('is-laughing');
          nextDelay = 1800;
          break;
        case 'juggle_ball':
          setCurrentIdleSubAnimation('is-juggling');
          nextDelay = 3000; // Juggling can last a bit
          break;
        case 'sleeping':
          setCurrentIdleSubAnimation('is-sleeping');
          nextDelay = 5000; // Sleep for longer
          break;
        case 'default_bob':
        default:
          setCurrentIdleSubAnimation('is-bobbing'); // Default bobbing
          break;
      }
      
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = setTimeout(playRandomIdleAnimation, nextDelay);
    };

    if (animationClass.includes('character-idle')) {
      if (!animationTimeoutRef.current && !currentIdleSubAnimation.startsWith('is-')) {
         // Initial call or if idle state is re-entered
        playRandomIdleAnimation();
      } else if (currentIdleSubAnimation === ''){
        // If idle but no sub-animation, start one
        playRandomIdleAnimation();
      }
    } else {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null; // Clear timeout when not idle
      setCurrentIdleSubAnimation(''); // Reset sub-animation class
    }

    // Cleanup timeout on component unmount or when animationClass changes significantly
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    };
  }, [animationClass, currentIdleSubAnimation]);

  // Adjusted size: w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44
  // ViewBox for Pickle Rick: approx 70 wide, 150 tall.
  return (
     <div className={cn("w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44 character-container", animationClass, currentIdleSubAnimation)}>
      <svg viewBox="0 0 70 150" className="w-full h-full ai-character-svg">
        <defs>
          <radialGradient id="pickleBodyGradient" cx="50%" cy="50%" r="70%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="hsl(var(--character-pickle-body-light-hsl))" />
            <stop offset="100%" stopColor="hsl(var(--character-pickle-body-main-hsl))" />
          </radialGradient>
        </defs>
        
        <ellipse cx="35" cy="145" rx="25" ry="5" fill="hsla(var(--background), 0.2)" />

        <ellipse cx="35" cy="75" rx="30" ry="70" fill="url(#pickleBodyGradient)" className="character-body-pickle" />
        
        <circle cx="25" cy="50" r="3" fill="hsl(var(--character-pickle-body-main-hsl))" opacity="0.7"/>
        <circle cx="45" cy="80" r="4" fill="hsl(var(--character-pickle-body-main-hsl))" opacity="0.7"/>
        <circle cx="30" cy="110" r="3.5" fill="hsl(var(--character-pickle-body-main-hsl))" opacity="0.7"/>

        <g className="character-face-group" transform="translate(0, -10)">
          <g className="character-eyes-group">
            {/* Modified eyes: wider, slightly less tall, more intense */}
            <ellipse cx="22" cy="45" rx="12" ry="10" className="character-eye-white character-eye-left" />
            <ellipse cx="48" cy="45" rx="12" ry="10" className="character-eye-white character-eye-right" />
            {/* Modified pupils: smaller */}
            <circle cx="22" cy="45" r="2.5" className="character-pupil character-pupil-left" />
            <circle cx="48" cy="45" r="2.5" className="character-pupil character-pupil-right" />
          </g>

          <path d="M 18 30 Q 35 25 52 30" className="character-unibrow" />
           {/* Modified mouth: wider, more characteristic Pickle Rick grin */}
          <path d="M 18 60 C 22 78, 48 78, 52 60 Q 35 72 18 60 Z" className="character-mouth" />
           {/* Modified teeth: thinner, taller, more numerous to fill the wider mouth */}
          <g className="character-teeth">
              <rect x="20" y="61" width="3" height="6" rx="0.5"/>
              <rect x="24" y="61" width="3" height="7" rx="0.5"/>
              <rect x="28" y="61" width="3" height="8" rx="0.5"/>
              <rect x="32" y="61" width="3" height="9" rx="0.5"/> 
              <rect x="36" y="61" width="3" height="8" rx="0.5"/>
              <rect x="40" y="61" width="3" height="7" rx="0.5"/>
              <rect x="44" y="61" width="3" height="6" rx="0.5"/>
          </g>
          <ellipse cx="35" cy="67" rx="8" ry="3" className="character-tongue" />
        </g>

        <g className="character-listening-ears">
          <path d="M10 35 Q 5 25 12 18" className="pickle-limb" fill="hsl(var(--character-pickle-body-light-hsl))"/>
          <path d="M60 35 Q 65 25 58 18" className="pickle-limb" fill="hsl(var(--character-pickle-body-light-hsl))"/>
        </g>

        <g className="character-limbs-group">
          <g className="character-hand-chin-group">
            <path d="M15 80 C 5 90, 10 105, 25 95" className="pickle-limb" />
          </g>
          <g className="character-hands-presenting-group">
            <path d="M12 90 C -5 100, 0 120, 15 105" className="pickle-limb pickle-limb-left" />
            <path d="M58 90 C 75 100, 70 120, 55 105" className="pickle-limb pickle-limb-right" />
          </g>
        </g>
        
        <g className="character-sparkles">
            <circle cx="35" cy="15" r="2.5" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="25" r="1.5" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="20" r="2" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        <g className="character-prop-group">
            <circle cx="50" cy="120" r="8" fill="hsl(var(--turquoise-hsl))" className="character-prop-ball"/>
            <text x="35" y="25" className="character-prop-zzz" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">Zzz</text>
        </g>
      </svg>
    </div>
  );
};

export function AiCharacterDisplay({ status, isUserTyping }: AiCharacterDisplayProps) {
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image' || status === 'error') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;
  const [isMounted, setIsMounted] = useState(false);
  // Ensure initial animation class is set
  const [position, setPosition] = useState({ top: '10%', left: '10%', currentAnimationClass: statusConfig.idle.characterAnimationClass });


  useEffect(() => {
    setIsMounted(true);
     // Set initial animation class when component mounts
    setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
  }, []); // currentVisuals dependency removed to avoid loop on initial setup

  useEffect(() => {
    if (!isMounted) return;

    let newTopPercentStr = '10%'; 
    let newLeftPercentStr = '10%';

    // Define viewport-relative bounding box for chat area (approximate)
    // Chat: max-w-2xl (64rem = 1024px), centered. Gallery below it.
    // Character dimensions: md:w-32 (8rem = 128px)
    const chatWidthThreshold = 1024; // px
    const galleryHeightThreshold = window.innerHeight * 0.33; // Gallery takes bottom 1/3

    const charWidthPx = 128; // Approximate character width
    const charHeightPx = 176; // Approximate character height


    if (effectiveStatus === 'user_typing') {
      // Near chat input area but not overlapping
      // Try to position to the side of the chat area if possible
      if (window.innerWidth > chatWidthThreshold + charWidthPx * 2) { // Enough space on sides
         newLeftPercentStr = '15%'; // Left of chat
      } else {
         newLeftPercentStr = '10%'; // General left
      }
      newTopPercentStr = `${Math.min(75, 100 - (galleryHeightThreshold + charHeightPx/2) / window.innerHeight * 100 - 5)}%`; // Above gallery
    } else if (effectiveStatus === 'thinking_text' || effectiveStatus === 'thinking_image') {
      // Focus area, avoiding center (chat)
      const thinkingLeftRoll = Math.random();
      if (window.innerWidth > chatWidthThreshold + charWidthPx * 2) {
          newLeftPercentStr = thinkingLeftRoll < 0.5 ? `${10 + Math.random() * 10}%` : `${80 + Math.random() * 10}%`; // Far left or far right
      } else {
          newLeftPercentStr = thinkingLeftRoll < 0.5 ? '10%' : '90%';
      }
      newTopPercentStr = `${10 + Math.random() * 15}%`; // Upper part
    } else if (effectiveStatus === 'idle' || effectiveStatus === 'presenting_text' || effectiveStatus === 'presenting_image' || effectiveStatus === 'error') {
      // Free-roaming, avoiding chat and gallery
      let randomTop, randomLeft;
      const roll = Math.random();

      const safeTopMax = 100 - (galleryHeightThreshold + charHeightPx) / window.innerHeight * 100 - 5; // Max top % to stay above gallery
      
      if (window.innerWidth <= chatWidthThreshold + charWidthPx) { // Screen is narrow, character mostly top
        randomTop = 5 + Math.random() * (Math.min(20, safeTopMax - 5)); // Upper area
        randomLeft = 5 + Math.random() * 90; // Full width roam in that upper band
      } else { // Screen has space on sides of chat
        const chatLeftEdgePercent = (window.innerWidth - chatWidthThreshold) / 2 / window.innerWidth * 100;
        const chatRightEdgePercent = 100 - chatLeftEdgePercent;

        if (roll < 0.33) { // Top strip (above chat)
          randomTop = 5 + Math.random() * 10;
          randomLeft = 5 + Math.random() * 90;
        } else if (roll < 0.66) { // Left of chat
          randomTop = Math.max(5, 5 + Math.random() * (safeTopMax - 5));
          randomLeft = 5 + Math.random() * Math.max(5, chatLeftEdgePercent - (charWidthPx / window.innerWidth * 100) - 5);
        } else { // Right of chat
          randomTop = Math.max(5, 5 + Math.random() * (safeTopMax - 5));
          randomLeft = Math.min(95, chatRightEdgePercent + 5 + Math.random() * (100 - (chatRightEdgePercent + 5) - (charWidthPx / window.innerWidth * 100) - 5));
        }
      }
      newTopPercentStr = `${Math.max(5, Math.min(safeTopMax, randomTop))}%`;
      newLeftPercentStr = `${Math.max(5, Math.min(95 - (charWidthPx / window.innerWidth * 100), randomLeft))}%`;
    }
    
    const moveCharacter = () => {
      setPosition(prev => ({
        ...prev,
        top: newTopPercentStr,
        left: newLeftPercentStr,
      }));
    };
    
    const movementDelay = (effectiveStatus === 'idle' || effectiveStatus === 'presenting_text' || effectiveStatus === 'presenting_image') ? (3000 + Math.random() * 2500) : 400;
    const timeoutId = setTimeout(moveCharacter, movementDelay); 
    
    // Ensure currentAnimationClass is updated immediately when effectiveStatus changes
    if (position.currentAnimationClass !== currentVisuals.characterAnimationClass) {
       setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
    }


    return () => {
      clearTimeout(timeoutId);
    };
  // position.currentAnimationClass removed from deps to prevent re-triggering movement on class change only
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
      }}
    >
      <AiCharacterSVG animationClass={cn(position.currentAnimationClass)} />
    </div>
  );
}

