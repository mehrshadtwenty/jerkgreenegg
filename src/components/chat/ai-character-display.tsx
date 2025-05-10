
'use client';

import type { AiStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

type IdleVariation = 'default' | 'tongue_out' | 'teleporting';

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

const AiCharacterSVG = ({ animationClass, idleVariation }: { animationClass: string, idleVariation: IdleVariation }) => {
  // ViewBox for Pickle Rick: 0 0 70 100 (original aspect ratio)
  return (
     <div className={cn(
        "w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-60 character-container", // Reverted to a previous larger size
         animationClass,
         idleVariation === 'tongue_out' && 'is-tongue-out',
         idleVariation === 'teleporting' && 'is-teleporting'
      )}
     >
      <svg viewBox="0 0 70 100" className="w-full h-full ai-character-svg"> {/* viewBox kept at 70 100 */}
        <defs>
          <radialGradient id="pickleBodyGradient" cx="50%" cy="50%" r="70%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="hsl(var(--character-pickle-body-light-hsl))" />
            <stop offset="100%" stopColor="hsl(var(--character-pickle-body-main-hsl))" />
          </radialGradient>
        </defs>
        
        {/* Shadow - scaled with character if needed, or adjust rx/ry */}
        <ellipse cx="35" cy="95" rx="28" ry="5" fill="hsla(var(--background), 0.15)" />

        {/* Body - centered in viewBox */}
        <ellipse cx="35" cy="50" rx="32" ry="48" fill="url(#pickleBodyGradient)" className="character-body-pickle" />
        
        {/* Body spots */}
        <circle cx="25" cy="35" r="3" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>
        <circle cx="45" cy="60" r="4" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>
        <circle cx="30" cy="75" r="3.5" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>

        <g className="character-face-group" transform="translate(0, -5)"> 
          <g className="character-eyes-group">
            <ellipse cx="24" cy="42" rx="11" ry="13" className="character-eye-white character-eye-left" />
            <ellipse cx="46" cy="42" rx="11" ry="13" className="character-eye-white character-eye-right" />
            <circle cx="24" cy="42" r="3" className="character-pupil character-pupil-left" />
            <circle cx="46" cy="42" r="3" className="character-pupil character-pupil-right" />
          </g>
          <path d="M 18 30 Q 35 22 52 30" strokeWidth="3" strokeLinecap="round" className="character-unibrow" />
          <path d="M 22 58 Q 35 72 48 58 Q 35 68 22 58 Z" className="character-mouth" /> 
          <path d="M 30 65 Q 35 62 40 65" className="character-tongue" fill="hsl(var(--character-tongue-hsl))" stroke="hsl(var(--character-mouth-dark-hsl))" strokeWidth="0.5" />
        </g>
        
        {/* Removed specific animation groups like listening-ears, hand-chin, hands-presenting */}
        {/* Sparkles and Prop group remain as they are general */}
        <g className="character-sparkles">
            <circle cx="35" cy="10" r="3" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="20" r="2" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="15" r="2.5" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        <g className="character-prop-group">
            {/* Example props - can be animated via CSS based on new generic states if needed */}
            <circle cx="50" cy="90" r="8" fill="hsl(var(--turquoise-hsl))" className="character-prop-ball"/>
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
  const [idleVariation, setIdleVariation] = useState<IdleVariation>('default');
  
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const galleryAreaRef = useRef<HTMLDivElement | null>(null);
  const movementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleVariationTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setIsMounted(true);
    chatAreaRef.current = document.getElementById('chat-area-wrapper');
    galleryAreaRef.current = document.getElementById('gallery-area-wrapper');

    return () => { 
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
    };
  }, []); 

  useEffect(() => {
    if (!isMounted) return;

    if (position.currentAnimationClass !== currentVisuals.characterAnimationClass) {
       setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
    }

    const scheduleMovement = () => {
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      
      // Adjusted for new character size: md:w-40 (160px), md:h-60 (240px)
      const charWidthPx = 160; 
      const charHeightPx = 240; 

      const calculateSafeZones = () => {
        let chatRect = { top: window.innerHeight * 0.15, bottom: window.innerHeight * 0.7, left: window.innerWidth * 0.1, right: window.innerWidth * 0.9, width: window.innerWidth * 0.8, height: window.innerHeight * 0.55 };
        let galleryRect = { top: window.innerHeight * 0.75, bottom: window.innerHeight * 0.95, left: window.innerWidth * 0.05, right: window.innerWidth * 0.95, width: window.innerWidth * 0.9, height: window.innerHeight * 0.2 };

        if (chatAreaRef.current) {
          const rect = chatAreaRef.current.getBoundingClientRect();
          // Ensure character does not overlap chat area at all
           chatRect = { 
            top: rect.top - charHeightPx, // Allow space above
            bottom: rect.bottom + charHeightPx, // Allow space below (but it's usually at bottom)
            left: rect.left - charWidthPx, // Allow space to the left
            right: rect.right + charWidthPx, // Allow space to the right
            // The actual "forbidden zone" is the rect itself, so we use original rect values for checks
            // For checking, use original rect:
            // forbiddenTop: rect.top, forbiddenBottom: rect.bottom, forbiddenLeft: rect.left, forbiddenRight: rect.right
            width: rect.width, height: rect.height // Store original width/height for checks
          };
        }
        if (galleryAreaRef.current && galleryAreaRef.current.offsetParent !== null) { 
          const rect = galleryAreaRef.current.getBoundingClientRect();
          galleryRect = { ...rect, width: rect.width, height: rect.height };
        } else { 
          galleryRect = {top: -1, bottom: -1, left: -1, right: -1, width: 0, height: 0};
        }
        return { chatRect, galleryRect };
      };
      
      const isOverlappingForbiddenZone = (x: number, y: number, forbiddenRect: { top: number, bottom: number, left: number, right: number, width: number, height: number }) => {
          if (forbiddenRect.width === 0 || forbiddenRect.height === 0) return false;
          
          const charBox = { // Character's bounding box (center x, y)
              top: y - charHeightPx / 2,
              bottom: y + charHeightPx / 2,
              left: x - charWidthPx / 2,
              right: x + charWidthPx / 2,
          };
          // Check for overlap with the original, unpadded rectangle
          return !(charBox.right < forbiddenRect.left || 
                   charBox.left > forbiddenRect.right || 
                   charBox.bottom < forbiddenRect.top || 
                   charBox.top > forbiddenRect.bottom);
      };

      let newTopPercentStr = position.top; 
      let newLeftPercentStr = position.left;
      let nextIdleVariation: IdleVariation = 'default';

      // For all states, character should roam freely but avoid forbidden zones
      const { chatRect, galleryRect } = calculateSafeZones();
      let attempts = 0;
      let randomXPx = 0, randomYPx = 0;
      do {
        randomXPx = charWidthPx / 2 + Math.random() * (window.innerWidth - charWidthPx);
        randomYPx = charHeightPx / 2 + Math.random() * (window.innerHeight - charHeightPx);
        attempts++;
      } while (
        (isOverlappingForbiddenZone(randomXPx, randomYPx, chatRect) || 
        (galleryRect.width > 0 && isOverlappingForbiddenZone(randomXPx, randomYPx, galleryRect))) && attempts < 30 // Increased attempts
      );
      
      if (attempts < 30) { // Found a good spot
          newLeftPercentStr = `${(randomXPx / window.innerWidth) * 100}%`;
          newTopPercentStr = `${(randomYPx / window.innerHeight) * 100}%`;
      } else {
          // Fallback: if too many attempts, try to place it top-left or top-right, away from center
          if (Math.random() < 0.5) {
              newLeftPercentStr = `${(charWidthPx / window.innerWidth) * 60}%`; // ~10% from left edge for center
          } else {
              newLeftPercentStr = `${100 - (charWidthPx / window.innerWidth) * 60}%`; // ~10% from right edge for center
          }
          newTopPercentStr = `${(charHeightPx / window.innerHeight) * 60}%`; // ~10% from top edge
      }


      if (effectiveStatus === 'idle') {
        const rand = Math.random();
        if (rand < 0.55) nextIdleVariation = 'default'; // Higher chance of default idle
        else if (rand < 0.85) nextIdleVariation = 'tongue_out';
        else nextIdleVariation = 'teleporting';
      } else {
        nextIdleVariation = 'default'; // Other states revert to default idle look if they become idle
      }
      
      const doMove = () => {
        setPosition(prev => ({
          ...prev,
          top: newTopPercentStr,
          left: newLeftPercentStr,
        }));
        
        if (effectiveStatus === 'idle') {
            if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
            idleVariationTimeoutRef.current = setTimeout(() => {
                setIdleVariation(nextIdleVariation);
            }, nextIdleVariation === 'teleporting' ? 50 : 2000 + Math.random() * 2500); 
        } else {
            setIdleVariation('default'); 
        }
      };

      let movementDelayMs = 2500 + Math.random() * 3000; 
      if (effectiveStatus === 'idle' && idleVariation === 'teleporting') {
        movementDelayMs = 750; 
      }
      
      movementTimeoutRef.current = setTimeout(doMove, movementDelayMs);
    };

    scheduleMovement();
    
    return () => { 
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveStatus, isMounted, idleVariation]); 

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
      <AiCharacterSVG 
        animationClass={cn(position.currentAnimationClass)}
        idleVariation={status === 'idle' ? idleVariation : 'default'}
      />
    </div>
  );
}

