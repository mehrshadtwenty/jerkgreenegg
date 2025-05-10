
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
  // ViewBox for Pickle Rick: 0 0 70 100 (made shorter as feet removed)
  return (
     <div className={cn(
        "w-16 h-[100px] sm:w-20 sm:h-[125px] md:w-24 md:h-[150px] character-container", // Adjusted height for no feet
         animationClass,
         idleVariation === 'tongue_out' && 'is-tongue-out',
         idleVariation === 'teleporting' && 'is-teleporting'
      )}
     >
      <svg viewBox="0 0 70 100" className="w-full h-full ai-character-svg">
        <defs>
          <radialGradient id="pickleBodyGradient" cx="50%" cy="50%" r="70%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="hsl(var(--character-pickle-body-light-hsl))" />
            <stop offset="100%" stopColor="hsl(var(--character-pickle-body-main-hsl))" />
          </radialGradient>
        </defs>
        
        <ellipse cx="35" cy="95" rx="28" ry="5" fill="hsla(var(--background), 0.15)" />

        {/* Body - y position adjusted slightly up due to no feet, slightly plumper */}
        <ellipse cx="35" cy="50" rx="32" ry="48" fill="url(#pickleBodyGradient)" className="character-body-pickle" />
        
        {/* Body spots */}
        <circle cx="25" cy="35" r="3" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>
        <circle cx="45" cy="60" r="4" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>
        <circle cx="30" cy="75" r="3.5" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>

        <g className="character-face-group" transform="translate(0, -5)"> {/* Adjusted y-transform for face slightly */}
          <g className="character-eyes-group">
            {/* Eyes slightly larger and closer */}
            <ellipse cx="24" cy="42" rx="11" ry="13" className="character-eye-white character-eye-left" />
            <ellipse cx="46" cy="42" rx="11" ry="13" className="character-eye-white character-eye-right" />
            <circle cx="24" cy="42" r="3" className="character-pupil character-pupil-left" /> {/* Larger pupils */}
            <circle cx="46" cy="42" r="3" className="character-pupil character-pupil-right" />
          </g>
          {/* Unibrow thicker */}
          <path d="M 18 30 Q 35 22 52 30" strokeWidth="3" strokeLinecap="round" className="character-unibrow" />
          {/* Mouth path slightly wider and expressive */}
          <path d="M 22 58 Q 35 72 48 58 Q 35 68 22 58 Z" className="character-mouth" /> 
          <path d="M 30 65 Q 35 62 40 65" className="character-tongue" fill="hsl(var(--character-tongue-hsl))" stroke="hsl(var(--character-mouth-dark-hsl))" strokeWidth="0.5" />
        </g>

        <g className="character-listening-ears"> {/* Ears remain simple for now */}
          <path d="M10 35 Q 5 25 12 18" className="pickle-limb pickle-ear" fill="hsl(var(--character-pickle-body-light-hsl))"/>
          <path d="M60 35 Q 65 25 58 18" className="pickle-limb pickle-ear" fill="hsl(var(--character-pickle-body-light-hsl))"/>
        </g>

        {/* Limbs (hands) are still simple paths, for specific states */}
        <g className="character-limbs-group">
          <g className="character-hand-chin-group"> {/* For thinking_text */}
            <path d="M15 70 C 5 75, 10 85, 25 80" className="pickle-limb pickle-hand" />
          </g>
          <g className="character-hands-presenting-group"> {/* For presenting_image */}
            <path d="M12 75 C -5 80, 0 95, 15 85" className="pickle-limb pickle-hand pickle-limb-left" />
            <path d="M58 75 C 75 80, 70 95, 55 85" className="pickle-limb pickle-hand pickle-limb-right" />
          </g>
        </g>
        
        <g className="character-sparkles">
            <circle cx="35" cy="10" r="3" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="20" r="2" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="15" r="2.5" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        {/* Prop group remains for potential future use, currently not primary animated parts */}
        <g className="character-prop-group">
            <circle cx="50" cy="90" r="8" fill="hsl(var(--turquoise-hsl))" className="character-prop-ball"/>
            <text x="35" y="15" className="character-prop-zzz" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">Zzz</text>
            <rect x="10" y="40" width="15" height="20" rx="2" fill="hsl(var(--ruby-red-hsl))" className="character-prop-card"/>
            <path d="M55 50 L 65 40 L 60 35 Z" fill="hsl(var(--emerald-green-hsl))" className="character-prop-paintbrush"/>
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

    return () => { // Cleanup timeouts on unmount
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
    };
  }, []); 

  useEffect(() => {
    if (!isMounted) return;

    // Update currentAnimationClass based on effectiveStatus
    if (position.currentAnimationClass !== currentVisuals.characterAnimationClass) {
       setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
    }

    const scheduleMovement = () => {
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      
      const charWidthPx = 96; 
      const charHeightPx = 150; // Adjusted for new SVG height

      const calculateSafeZones = () => {
        let chatRect = { top: window.innerHeight * 0.15, bottom: window.innerHeight * 0.7, left: window.innerWidth * 0.1, right: window.innerWidth * 0.9, width: window.innerWidth * 0.8, height: window.innerHeight * 0.55 };
        let galleryRect = { top: window.innerHeight * 0.75, bottom: window.innerHeight * 0.95, left: window.innerWidth * 0.05, right: window.innerWidth * 0.95, width: window.innerWidth * 0.9, height: window.innerHeight * 0.2 };

        if (chatAreaRef.current) {
          const rect = chatAreaRef.current.getBoundingClientRect();
          chatRect = { ...rect, width: rect.width, height: rect.height };
        }
        if (galleryAreaRef.current && galleryAreaRef.current.offsetParent !== null) { // Check if gallery is visible
          const rect = galleryAreaRef.current.getBoundingClientRect();
          galleryRect = { ...rect, width: rect.width, height: rect.height };
        } else { // If gallery not visible or not found, make its safe zone non-restrictive
          galleryRect = {top: -1, bottom: -1, left: -1, right: -1, width: 0, height: 0};
        }
        return { chatRect, galleryRect };
      };
      
      const isOverlappingCompletely = (x: number, y: number, rect: { top: number, bottom: number, left: number, right: number }) => {
          if (rect.width === 0 || rect.height === 0) return false; // Don't overlap with non-existent rects
          const charBox = { // Character's bounding box (center x, y)
              top: y - charHeightPx / 2,
              bottom: y + charHeightPx / 2,
              left: x - charWidthPx / 2,
              right: x + charWidthPx / 2,
          };
          // Check for overlap
          return !(charBox.right < rect.left + charWidthPx * 0.2 || // Allow slight overlap at edges
                   charBox.left > rect.right - charWidthPx * 0.2 || 
                   charBox.bottom < rect.top + charHeightPx * 0.2 || 
                   charBox.top > rect.bottom - charHeightPx * 0.2);
      };

      let newTopPercentStr = position.top; 
      let newLeftPercentStr = position.left;
      let nextIdleVariation: IdleVariation = 'default';

      if (effectiveStatus === 'user_typing') {
        const { chatRect } = calculateSafeZones();
        let targetX = chatRect.left - charWidthPx / 2 - 20; 
        let targetY = chatRect.top + (chatRect.height) / 2; 

        if (targetX < charWidthPx / 2 || targetX > window.innerWidth - charWidthPx / 2 || chatRect.width < (charWidthPx + 40) * 1.5 ) { 
            targetX = chatRect.right + charWidthPx / 2 + 20; 
        }
        if (targetX < charWidthPx / 2 || targetX > window.innerWidth - charWidthPx / 2) { 
            targetX = charWidthPx / 2 + 30; 
            targetY = chatRect.top > charHeightPx + 20 ? chatRect.top - charHeightPx / 2 -10 : charHeightPx / 2 + 70;
        }
        targetY = Math.max(charHeightPx / 2 + 10, Math.min(window.innerHeight - charHeightPx/2 -10, targetY));
        newLeftPercentStr = `${(targetX / window.innerWidth) * 100}%`;
        newTopPercentStr = `${(targetY / window.innerHeight) * 100}%`;
        nextIdleVariation = 'default';
      } else if (effectiveStatus === 'idle' && idleVariation === 'teleporting') {
        // Teleport logic: find a new random spot
        const { chatRect, galleryRect } = calculateSafeZones();
        let attempts = 0;
        let randomXPx = 0, randomYPx = 0;
        do {
          randomXPx = charWidthPx / 2 + Math.random() * (window.innerWidth - charWidthPx);
          randomYPx = charHeightPx / 2 + Math.random() * (window.innerHeight - charHeightPx);
          attempts++;
        } while ((isOverlappingCompletely(randomXPx, randomYPx, chatRect) || (galleryRect.width > 0 && isOverlappingCompletely(randomXPx, randomYPx, galleryRect))) && attempts < 20);
        
        newLeftPercentStr = `${(randomXPx / window.innerWidth) * 100}%`;
        newTopPercentStr = `${(randomYPx / window.innerHeight) * 100}%`;
        // After teleporting, revert to default idle or another random one
        nextIdleVariation = Math.random() < 0.7 ? 'default' : 'tongue_out';
      } else if (effectiveStatus === 'idle') {
         // Normal idle roaming or other idle variations, find a new spot
        const { chatRect, galleryRect } = calculateSafeZones();
        let attempts = 0;
        let randomXPx = 0, randomYPx = 0;
        do {
          randomXPx = charWidthPx / 2 + Math.random() * (window.innerWidth - charWidthPx);
          randomYPx = charHeightPx / 2 + Math.random() * (window.innerHeight - charHeightPx);
          attempts++;
        } while ((isOverlappingCompletely(randomXPx, randomYPx, chatRect) || (galleryRect.width > 0 && isOverlappingCompletely(randomXPx, randomYPx, galleryRect))) && attempts < 20);

        newLeftPercentStr = `${(randomXPx / window.innerWidth) * 100}%`;
        newTopPercentStr = `${(randomYPx / window.innerHeight) * 100}%`;
        
        // Choose next idle variation
        const rand = Math.random();
        if (rand < 0.6) nextIdleVariation = 'default';
        else if (rand < 0.85) nextIdleVariation = 'tongue_out';
        else nextIdleVariation = 'teleporting';

      } else { // For non-idle, non-typing states (thinking, presenting, error)
        // Might want specific positions or less movement
        // For now, let it stay or make a small random move if needed
        if (Math.random() < 0.3) { // 30% chance of small move
            let currentXPercent = parseFloat(position.left);
            let currentYPercent = parseFloat(position.top);
            let dX = (Math.random() - 0.5) * 10; // Move up to 5% left/right
            let dY = (Math.random() - 0.5) * 10; // Move up to 5% up/down
            
            let newX = Math.max( (charWidthPx / window.innerWidth)*50 + 5, Math.min(95 - (charWidthPx / window.innerWidth)*50, currentXPercent + dX));
            let newY = Math.max( (charHeightPx / window.innerHeight)*50 + 5, Math.min(95 - (charHeightPx / window.innerHeight)*50, currentYPercent + dY));

            newLeftPercentStr = `${newX}%`;
            newTopPercentStr = `${newY}%`;
        }
        nextIdleVariation = 'default'; // Revert to default when not idle
      }
      
      const doMove = () => {
        setPosition(prev => ({
          ...prev,
          top: newTopPercentStr,
          left: newLeftPercentStr,
        }));
        // If we just teleported, or are now in idle, schedule next idle variation change
        if (effectiveStatus === 'idle') {
            if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
            idleVariationTimeoutRef.current = setTimeout(() => {
                setIdleVariation(nextIdleVariation);
            }, nextIdleVariation === 'teleporting' ? 50 : 1500 + Math.random() * 2000); // Shorter delay before starting teleport
        } else {
            setIdleVariation('default'); // Ensure non-idle states are default
        }
      };

      // Determine movement delay
      let movementDelayMs = 2500 + Math.random() * 3000; // Default idle roam
      if (effectiveStatus !== 'idle') {
        movementDelayMs = 3000 + Math.random() * 2000; // Slower/less frequent moves when not idle
      }
      if (effectiveStatus === 'idle' && idleVariation === 'teleporting') {
        // Movement happens *after* teleport animation. Teleport animation is 1.5s.
        // JS sets new position, then CSS animates to it visually.
        // The actual position change in JS should align with the "reappear" part of the animation.
        // So, schedule the visual update of position for after the "disappear" part.
        movementDelayMs = 750; // Matches approx mid-point of teleport animation
      }
      
      movementTimeoutRef.current = setTimeout(doMove, movementDelayMs);
    };

    scheduleMovement();
    
    return () => { // Cleanup on status change or unmount
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveStatus, isMounted, idleVariation]); // position.currentAnimationClass removed from deps

  if (!isMounted) {
    return null;
  }

  return (
    <div 
      className="fixed z-0 pointer-events-none" // z-0 to be behind other content with higher z-index
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
