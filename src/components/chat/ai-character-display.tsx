
'use client';

import type { AiStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

type IdleVariation = 'default' | 'tongue_out' | 'teleporting' | 'sleeping' | 'laughing' | 'poker_face';

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
  // New smaller size: base w-24 h-36, sm:w-28 h-42, md:w-32 h-48
  return (
     <div className={cn(
        "w-24 h-36 sm:w-28 sm:h-42 md:w-32 md:h-48 character-container", 
         animationClass,
         idleVariation === 'tongue_out' && 'is-tongue-out',
         idleVariation === 'teleporting' && 'is-teleporting',
         idleVariation === 'sleeping' && 'is-sleeping',
         idleVariation === 'laughing' && 'is-laughing',
         idleVariation === 'poker_face' && 'is-poker-face'
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

        <ellipse cx="35" cy="50" rx="32" ry="48" fill="url(#pickleBodyGradient)" className="character-body-pickle" />
        
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
          {/* Adjusted mouth for more natural look - this path will be overridden by animation states */}
          <path d="M 25 60 Q 35 70 45 60 Q 35 65 25 60 Z" className="character-mouth" /> 
          <path d="M 30 65 Q 35 62 40 65" className="character-tongue" fill="hsl(var(--character-tongue-hsl))" stroke="hsl(var(--character-mouth-dark-hsl))" strokeWidth="0.5" />
        </g>
        
        <g className="character-sparkles">
            <circle cx="35" cy="10" r="3" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="20" r="2" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="15" r="2.5" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        <g className="character-prop-group">
            <circle cx="50" cy="90" r="8" fill="hsl(var(--turquoise-hsl))" className="character-prop-ball"/>
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
  const [idleVariation, setIdleVariation] = useState<IdleVariation>('default');
  
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const movementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleVariationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleFaceChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setIsMounted(true);
    chatAreaRef.current = document.getElementById('chat-area-wrapper');

    return () => { 
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
      if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
    };
  }, []); 

  useEffect(() => {
    if (!isMounted) return;

    if (position.currentAnimationClass !== currentVisuals.characterAnimationClass) {
       setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
    }

    const scheduleMovement = () => {
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      
      // New smaller size: md:w-32 (128px), md:h-48 (192px)
      const charWidthPx = 128; 
      const charHeightPx = 192; 

      const calculateSafeZones = () => {
        let chatRect = { top: window.innerHeight * 0.15, bottom: window.innerHeight * 0.85, left: window.innerWidth * 0.1, right: window.innerWidth * 0.9, width: window.innerWidth * 0.8, height: window.innerHeight * 0.7 };
        
        if (chatAreaRef.current) {
          const rect = chatAreaRef.current.getBoundingClientRect();
           // Define the chat area as a forbidden zone. The character's center should not be within this zone.
           // Add some padding to the forbidden zone so the character doesn't touch the edges of the chat.
           const padding = 20; // pixels
           chatRect = { 
            top: rect.top - charHeightPx / 2 - padding, 
            bottom: rect.bottom + charHeightPx / 2 + padding, 
            left: rect.left - charWidthPx / 2 - padding, 
            right: rect.right + charWidthPx / 2 + padding, 
            width: rect.width + charWidthPx + 2 * padding, 
            height: rect.height + charHeightPx + 2 * padding
          };
        }
        return { chatRect };
      };
      
      const isOverlappingForbiddenZone = (centerX: number, centerY: number, forbiddenRect: { top: number, bottom: number, left: number, right: number }) => {
          // Check if the character's *center point* (centerX, centerY) falls within the forbiddenRect
          return centerX > forbiddenRect.left && centerX < forbiddenRect.right &&
                 centerY > forbiddenRect.top && centerY < forbiddenRect.bottom;
      };

      let newTopPercentStr = position.top; 
      let newLeftPercentStr = position.left;
      
      const { chatRect } = calculateSafeZones();
      let attempts = 0;
      let randomXPx = 0, randomYPx = 0;
      
      // Generate random *center* positions for the character
      do {
        randomXPx = Math.random() * window.innerWidth;
        randomYPx = Math.random() * window.innerHeight;
        attempts++;
      } while (
        isOverlappingForbiddenZone(randomXPx, randomYPx, chatRect) && attempts < 50 // Increased attempts
      );
      
      // If a non-overlapping spot is found, use it.
      // Otherwise, it will stick to its previous position or a default if this is the first run.
      // The actual new position will be set so that (randomXPx, randomYPx) is the center.
      if (attempts < 50) { 
          newLeftPercentStr = `${(randomXPx / window.innerWidth) * 100}%`;
          newTopPercentStr = `${(randomYPx / window.innerHeight) * 100}%`;
      } else {
          // Fallback: try to place it on an edge, preferring top/bottom if sides are too constrained by chat
          if (Math.random() < 0.5) { // Try top or bottom
            newTopPercentStr = Math.random() < 0.5 ? `${(charHeightPx / 2 / window.innerHeight) * 100 + 2}%` : `${100 - (charHeightPx / 2 / window.innerHeight) * 100 - 2}%`;
            newLeftPercentStr = `${(Math.random() * (window.innerWidth - charWidthPx) + charWidthPx/2) / window.innerWidth * 100}%`;
          } else { // Try left or right
            newLeftPercentStr = Math.random() < 0.5 ? `${(charWidthPx / 2 / window.innerWidth) * 100 + 2}%` : `${100 - (charWidthPx / 2 / window.innerWidth) * 100 - 2}%`;
            newTopPercentStr = `${(Math.random() * (window.innerHeight - charHeightPx) + charHeightPx/2) / window.innerHeight * 100}%`;
          }
      }
      
      const doMove = () => {
        setPosition(prev => ({
          ...prev,
          top: newTopPercentStr,
          left: newLeftPercentStr,
        }));
      };

      let movementDelayMs = 2500 + Math.random() * 3000; 
      if (effectiveStatus === 'idle' && idleVariation === 'teleporting') {
        movementDelayMs = 750; // Faster movement if teleporting
      }
      
      movementTimeoutRef.current = setTimeout(doMove, movementDelayMs);
    };

    // Separate useEffect for idle variations (face changes, teleporting)
    useEffect(() => {
        if (effectiveStatus !== 'idle' || !isMounted) {
            if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
            if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
            setIdleVariation('default'); // Reset to default when not idle
            return;
        }

        const scheduleIdleVariation = () => {
            if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
            
            let nextIdleVariation: IdleVariation = 'default';
            const rand = Math.random();

            // More diverse idle states beyond just teleporting
            if (rand < 0.25) nextIdleVariation = 'default';        // 25%
            else if (rand < 0.45) nextIdleVariation = 'tongue_out'; // 20%
            else if (rand < 0.60) nextIdleVariation = 'sleeping';     // 15%
            else if (rand < 0.75) nextIdleVariation = 'laughing';     // 15%
            else if (rand < 0.90) nextIdleVariation = 'poker_face';   // 15%
            else nextIdleVariation = 'teleporting';      // 10%

            setIdleVariation(prevVariation => {
              // If teleporting, do it, then switch to default after animation
              if (nextIdleVariation === 'teleporting') {
                if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
                idleFaceChangeTimeoutRef.current = setTimeout(() => setIdleVariation('default'), 1500); // Duration of teleport animation
                return 'teleporting';
              }
              return nextIdleVariation;
            });
            
            // Schedule the next change
            idleVariationTimeoutRef.current = setTimeout(scheduleIdleVariation, 5000 + Math.random() * 5000); // Changes every 5-10 seconds
        };

        scheduleIdleVariation(); // Start the cycle

        return () => {
            if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
            if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
        };
    }, [effectiveStatus, isMounted]);


    scheduleMovement();
    
    return () => { 
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveStatus, isMounted]); // Removed idleVariation from deps to let its own timer handle it

  if (!isMounted) {
    return null;
  }

  return (
    <div 
      className="fixed z-0 pointer-events-none" 
      style={{ 
        top: position.top, 
        left: position.left, 
        transform: 'translate(-50%, -50%)', // Center the character based on its top/left
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

