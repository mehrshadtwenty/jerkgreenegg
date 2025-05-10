
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

const AiCharacterSVG = ({ animationClass }: { animationClass: string }) => {
  // Removed currentIdleSubAnimation and related logic.
  // Base idle animations are now handled by CSS via `character-idle` class.

  // Adjusted size: w-16 h-28 sm:w-20 sm:h-32 md:w-24 md:h-36
  // ViewBox for Pickle Rick: approx 70 wide, 140 tall (to give some space if feet were there, now can be tighter)
  // Let's keep viewBox a bit generous: 0 0 70 140
  return (
     <div className={cn("w-16 h-28 sm:w-20 sm:h-32 md:w-24 md:h-36 character-container", animationClass)}>
      <svg viewBox="0 0 70 140" className="w-full h-full ai-character-svg">
        <defs>
          <radialGradient id="pickleBodyGradient" cx="50%" cy="50%" r="70%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="hsl(var(--character-pickle-body-light-hsl))" />
            <stop offset="100%" stopColor="hsl(var(--character-pickle-body-main-hsl))" />
          </radialGradient>
        </defs>
        
        {/* Shadow - slightly adjusted for no feet */}
        <ellipse cx="35" cy="135" rx="25" ry="5" fill="hsla(var(--background), 0.2)" />

        {/* Body - y position adjusted slightly up due to no feet */}
        <ellipse cx="35" cy="70" rx="30" ry="65" fill="url(#pickleBodyGradient)" className="character-body-pickle" />
        
        <circle cx="25" cy="45" r="3" fill="hsl(var(--character-pickle-body-main-hsl))" opacity="0.7"/>
        <circle cx="45" cy="75" r="4" fill="hsl(var(--character-pickle-body-main-hsl))" opacity="0.7"/>
        <circle cx="30" cy="105" r="3.5" fill="hsl(var(--character-pickle-body-main-hsl))" opacity="0.7"/>

        <g className="character-face-group" transform="translate(0, -15)"> {/* Adjusted y-transform for face slightly */}
          <g className="character-eyes-group">
            <ellipse cx="22" cy="45" rx="12" ry="10" className="character-eye-white character-eye-left" />
            <ellipse cx="48" cy="45" rx="12" ry="10" className="character-eye-white character-eye-right" />
            <circle cx="22" cy="45" r="2.5" className="character-pupil character-pupil-left" />
            <circle cx="48" cy="45" r="2.5" className="character-pupil character-pupil-right" />
          </g>

          <path d="M 18 30 Q 35 25 52 30" className="character-unibrow" />
          <path d="M 20 60 Q 35 75 50 60 Q 35 65 20 60 Z" className="character-mouth" /> 
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
           {/* Feet elements removed */}
        </g>
        
        <g className="character-sparkles">
            <circle cx="35" cy="15" r="2.5" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="25" r="1.5" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="20" r="2" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        {/* Prop group remains for potential future use or context-specific props, but JS logic for idle props removed */}
        <g className="character-prop-group">
            <circle cx="50" cy="120" r="8" fill="hsl(var(--turquoise-hsl))" className="character-prop-ball"/>
            <text x="35" y="25" className="character-prop-zzz" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">Zzz</text>
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
  
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const galleryAreaRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    setIsMounted(true);
    // setPosition currentAnimationClass is already handled by the second useEffect.
    // This one is just for initial mount.
    
    chatAreaRef.current = document.getElementById('chat-area-wrapper');
    galleryAreaRef.current = document.getElementById('gallery-area-wrapper');

  }, []); 

  useEffect(() => {
    if (!isMounted) return;

    let newTopPercentStr = '10%'; 
    let newLeftPercentStr = '10%';

    // Adjusted character dimensions for collision detection (based on new md size: w-24 -> ~96px, h-36 -> ~144px)
    const charWidthPx = 96; 
    const charHeightPx = 144;

    const calculateSafeZones = () => {
      let chatRect = { top: 0, bottom: window.innerHeight * 0.6, left: 0, right: window.innerWidth, width: window.innerWidth, height: window.innerHeight * 0.6 };
      let galleryRect = { top: window.innerHeight * 0.65, bottom: window.innerHeight, left: 0, right: window.innerWidth, width: window.innerWidth, height: window.innerHeight * 0.35 };

      if (chatAreaRef.current) {
        const rect = chatAreaRef.current.getBoundingClientRect();
        chatRect = { ...rect, width: rect.width, height: rect.height };
      }
      if (galleryAreaRef.current) {
        const rect = galleryAreaRef.current.getBoundingClientRect();
        galleryRect = { ...rect, width: rect.width, height: rect.height };
      }
      return { chatRect, galleryRect };
    };
    
    const isOverlapping = (x: number, y: number, rect: { top: number, bottom: number, left: number, right: number }) => {
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
      const { chatRect } = calculateSafeZones();
      let targetX = chatRect.left - charWidthPx / 2 - 20; 
      let targetY = chatRect.top + (chatRect.bottom - chatRect.top) / 2; 

      if (targetX < charWidthPx / 2 || targetX > window.innerWidth - charWidthPx / 2 || chatRect.width < (charWidthPx + 40) *2 ) { // If too narrow or out of bounds on left
          targetX = chatRect.right + charWidthPx / 2 + 20; 
      }
       if (targetX < charWidthPx / 2 || targetX > window.innerWidth - charWidthPx / 2) { // If still out of bounds, default to top-left-ish
          targetX = charWidthPx / 2 + 30; 
          targetY = chatRect.top > charHeightPx + 20 ? chatRect.top - charHeightPx / 2 -10 : charHeightPx / 2 + 70;
      }
       
      targetY = Math.max(charHeightPx / 2 + 10, Math.min(window.innerHeight - charHeightPx/2 -10, targetY));

      newLeftPercentStr = `${(targetX / window.innerWidth) * 100}%`;
      newTopPercentStr = `${(targetY / window.innerHeight) * 100}%`;

    } else { 
      const { chatRect, galleryRect } = calculateSafeZones();
      let attempts = 0;
      let randomXPx = 0, randomYPx = 0; // Initialize to avoid TS error, will be set in loop

      do {
        randomXPx = charWidthPx / 2 + Math.random() * (window.innerWidth - charWidthPx);
        randomYPx = charHeightPx / 2 + Math.random() * (window.innerHeight - charHeightPx);
        attempts++;
      } while ((isOverlapping(randomXPx, randomYPx, chatRect) || isOverlapping(randomXPx, randomYPx, galleryRect)) && attempts < 50); // Increased attempts
      
      if (attempts >= 50 && (isOverlapping(randomXPx, randomYPx, chatRect) || isOverlapping(randomXPx, randomYPx, galleryRect))) {
        // Fallback strategy: Try corners or edges if primary areas are 'full'
        const positions = [
          { x: charWidthPx / 2 + 20, y: charHeightPx / 2 + 20 }, // Top-left
          { x: window.innerWidth - charWidthPx / 2 - 20, y: charHeightPx / 2 + 20 }, // Top-right
          // Check space above chat area
          ...(chatRect.top > charHeightPx + 40 ? [{ x: chatRect.left + chatRect.width / 2, y: chatRect.top - charHeightPx / 2 - 20 }] : []),
        ];
        let foundFallback = false;
        for (const pos of positions) {
            if (!isOverlapping(pos.x, pos.y, chatRect) && !isOverlapping(pos.x, pos.y, galleryRect)) {
                randomXPx = pos.x;
                randomYPx = pos.y;
                foundFallback = true;
                break;
            }
        }
        if (!foundFallback) { // Ultimate fallback
            randomXPx = charWidthPx/2 + 10;
            randomYPx = charHeightPx/2 + 60; // Below header
        }
      }
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
    
    const movementDelay = (effectiveStatus === 'idle' || effectiveStatus === 'presenting_text' || effectiveStatus === 'presenting_image') ? (2500 + Math.random() * 3000) : 400; // Slightly longer idle roam delay
    const timeoutId = setTimeout(moveCharacter, movementDelay); 
    
    // Ensure currentAnimationClass is updated if effectiveStatus changes
    if (position.currentAnimationClass !== currentVisuals.characterAnimationClass) {
       setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [effectiveStatus, isMounted, currentVisuals.characterAnimationClass]); // position.currentAnimationClass removed from deps


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
      aria-hidden="true"
    >
      <AiCharacterSVG animationClass={cn(position.currentAnimationClass)} />
    </div>
  );
}
