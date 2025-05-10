
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
  'shrug_confused', 'maniacal_laugh_pose', 'juggle_ball', 'sleeping',
  'scratch_head', 'kick_air', 'paint_canvas', 'play_card_trick'
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
        case 'scratch_head':
          setCurrentIdleSubAnimation('is-scratching-head');
          nextDelay = 1800;
          break;
        case 'kick_air':
          setCurrentIdleSubAnimation('is-kicking-air');
          nextDelay = 1500;
          break;
        case 'paint_canvas':
          setCurrentIdleSubAnimation('is-painting');
          nextDelay = 3500;
          break;
        case 'play_card_trick':
          setCurrentIdleSubAnimation('is-card-tricking');
          nextDelay = 3000;
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

  // Adjusted size: w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40
  // ViewBox for Pickle Rick: approx 70 wide, 150 tall.
  return (
     <div className={cn("w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 character-container", animationClass, currentIdleSubAnimation)}>
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
            <ellipse cx="22" cy="45" rx="12" ry="10" className="character-eye-white character-eye-left" />
            <ellipse cx="48" cy="45" rx="12" ry="10" className="character-eye-white character-eye-right" />
            <circle cx="22" cy="45" r="2.5" className="character-pupil character-pupil-left" />
            <circle cx="48" cy="45" r="2.5" className="character-pupil character-pupil-right" />
          </g>

          <path d="M 18 30 Q 35 25 52 30" className="character-unibrow" />
          <path d="M 20 60 Q 35 75 50 60 Q 35 65 20 60 Z" className="character-mouth" /> 
          {/* Teeth removed as per user request */}
          <ellipse cx="35" cy="70" rx="10" ry="4" className="character-tongue" />
        </g>

        <g className="character-listening-ears">
          <path d="M10 35 Q 5 25 12 18" className="pickle-limb pickle-ear" fill="hsl(var(--character-pickle-body-light-hsl))"/>
          <path d="M60 35 Q 65 25 58 18" className="pickle-limb pickle-ear" fill="hsl(var(--character-pickle-body-light-hsl))"/>
        </g>

        <g className="character-limbs-group">
          <g className="character-hand-chin-group">
            <path d="M15 80 C 5 90, 10 105, 25 95" className="pickle-limb pickle-hand" />
          </g>
          <g className="character-hands-presenting-group">
            <path d="M12 90 C -5 100, 0 120, 15 105" className="pickle-limb pickle-hand pickle-limb-left" />
            <path d="M58 90 C 75 100, 70 120, 55 105" className="pickle-limb pickle-hand pickle-limb-right" />
          </g>
           {/* Added feet elements */}
          <ellipse cx="25" cy="140" rx="10" ry="5" className="pickle-foot pickle-foot-left" fill="hsl(var(--character-pickle-limb-hsl))" stroke="hsl(var(--character-mouth-dark-hsl) / 0.6)" strokeWidth="0.5" />
          <ellipse cx="45" cy="140" rx="10" ry="5" className="pickle-foot pickle-foot-right" fill="hsl(var(--character-pickle-limb-hsl))" stroke="hsl(var(--character-mouth-dark-hsl) / 0.6)" strokeWidth="0.5"/>
        </g>
        
        <g className="character-sparkles">
            <circle cx="35" cy="15" r="2.5" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="25" r="1.5" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="20" r="2" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        <g className="character-prop-group">
            <circle cx="50" cy="120" r="8" fill="hsl(var(--turquoise-hsl))" className="character-prop-ball"/>
            <text x="35" y="25" className="character-prop-zzz" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">Zzz</text>
            {/* Props for new animations */}
            <rect x="10" y="50" width="15" height="20" rx="2" fill="hsl(var(--ruby-red-hsl))" className="character-prop-card"/>
            <path d="M55 60 L 65 50 L 60 45 Z" fill="hsl(var(--emerald-green-hsl))" className="character-prop-paintbrush"/>
        </g>
      </svg>
    </div>
  );
};

export function AiCharacterDisplay({ status, isUserTyping }: AiCharacterDisplayProps) {
  const effectiveStatus = isUserTyping && (status === 'idle' || status === 'presenting_text' || status === 'presenting_image' || status === 'error') ? 'user_typing' : status;
  const currentVisuals = statusConfig[effectiveStatus] || statusConfig.idle;
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: '10%', left: '10%', currentAnimationClass: statusConfig.idle.characterAnimationClass });
  
  // Refs for chat and gallery areas to avoid overlap
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const galleryAreaRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    setIsMounted(true);
    setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));

    // Attempt to get references to chat and gallery areas after mount
    // These IDs would need to be present on the respective wrapper divs in page.tsx
    chatAreaRef.current = document.getElementById('chat-area-wrapper');
    galleryAreaRef.current = document.getElementById('gallery-area-wrapper');

  }, []); 

  useEffect(() => {
    if (!isMounted) return;

    let newTopPercentStr = '10%'; 
    let newLeftPercentStr = '10%';

    const charWidthPx = 100; // Approximate character width (md:w-28 -> 7rem -> 112px, using 100 for buffer)
    const charHeightPx = 160; // Approximate character height (md:h-40 -> 10rem -> 160px)

    const calculateSafeZones = () => {
      let chatRect = { top: 0, bottom: window.innerHeight * 0.6, left: 0, right: window.innerWidth };
      let galleryRect = { top: window.innerHeight * 0.65, bottom: window.innerHeight, left: 0, right: window.innerWidth };

      if (chatAreaRef.current) {
        const rect = chatAreaRef.current.getBoundingClientRect();
        chatRect = {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        };
      }
      if (galleryAreaRef.current) {
        const rect = galleryAreaRef.current.getBoundingClientRect();
        galleryRect = {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        };
      }
      return { chatRect, galleryRect };
    };
    
    const isOverlapping = (x: number, y: number, rect: { top: number, bottom: number, left: number, right: number }) => {
        // x, y are center of character. Check if character's bounding box overlaps rect.
        const charBox = {
            top: y - charHeightPx / 2,
            bottom: y + charHeightPx / 2,
            left: x - charWidthPx / 2,
            right: x + charWidthPx / 2,
        };
        return !(charBox.right < rect.left || 
                 charBox.left > rect.right || 
                 charBox.bottom < rect.top || 
                 charBox.top > rect.bottom);
    };


    if (effectiveStatus === 'user_typing') {
      // User typing: Character sits beside the chat area
      const { chatRect } = calculateSafeZones();
      let targetX = chatRect.left - charWidthPx / 2 - 20; // 20px buffer
      let targetY = chatRect.top + (chatRect.bottom - chatRect.top) / 2; // Vertically centered with chat

      if (targetX < charWidthPx / 2 || targetX > window.innerWidth - charWidthPx / 2) { 
          targetX = chatRect.right + charWidthPx / 2 + 20; // Try right side
      }
      if (targetX < charWidthPx / 2 || targetX > window.innerWidth - charWidthPx / 2) { // If still out of bounds, default to top-left-ish
          targetX = charWidthPx / 2 + 30; 
      }
       
      targetY = Math.max(charHeightPx / 2 + 10, Math.min(window.innerHeight - charHeightPx/2 -10, targetY));


      newLeftPercentStr = `${(targetX / window.innerWidth) * 100}%`;
      newTopPercentStr = `${(targetY / window.innerHeight) * 100}%`;

    } else { // All other states: Roam freely but avoid overlap
      const { chatRect, galleryRect } = calculateSafeZones();
      let attempts = 0;
      let randomXPx, randomYPx;

      do {
        randomXPx = charWidthPx / 2 + Math.random() * (window.innerWidth - charWidthPx);
        randomYPx = charHeightPx / 2 + Math.random() * (window.innerHeight - charHeightPx);
        attempts++;
      } while ((isOverlapping(randomXPx, randomYPx, chatRect) || isOverlapping(randomXPx, randomYPx, galleryRect)) && attempts < 30);
      
      if (attempts >= 30 && (isOverlapping(randomXPx, randomYPx, chatRect) || isOverlapping(randomXPx, randomYPx, galleryRect))) {
        // Fallback: Try to position it above the chat area if space, otherwise default top-left
        if (chatRect.top > charHeightPx + 20) {
            randomXPx = chatRect.left + (chatRect.right - chatRect.left) / 2;
            randomYPx = chatRect.top - charHeightPx / 2 - 10;
        } else {
            randomXPx = charWidthPx / 2 + 20; 
            randomYPx = charHeightPx / 2 + 70; // Approx header height + buffer
        }
      }
      // Ensure character stays within viewport bounds after fallback
      randomXPx = Math.max(charWidthPx / 2, Math.min(window.innerWidth - charWidthPx / 2, randomXPx));
      randomYPx = Math.max(charHeightPx / 2, Math.min(window.innerHeight - charHeightPx / 2, randomYPx));


      newLeftPercentStr = `${(randomXPx / window.innerWidth) * 100}%`;
      newTopPercentStr = `${(randomYPx / window.innerHeight) * 100}%`;
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
    
    if (position.currentAnimationClass !== currentVisuals.characterAnimationClass) {
       setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
    }

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
      }}
      aria-hidden="true" // Decorative element
    >
      <AiCharacterSVG animationClass={cn(position.currentAnimationClass)} />
    </div>
  );
}

