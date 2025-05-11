
'use client';

import type { AiStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

type IdleVariation = 'default' | 'tongue_out' | 'teleporting' | 'laughing' | 'poker_face';

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
  // Adjusted size: base w-20 h-auto (aspect-ratio will handle height)
  return (
     <div className={cn(
        "w-20 h-auto character-container", 
         animationClass,
         idleVariation === 'tongue_out' && 'is-tongue-out',
         idleVariation === 'teleporting' && 'is-teleporting',
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
        
        {/* Subtle shadow */}
        <ellipse cx="35" cy="95" rx="28" ry="5" fill="hsla(var(--background), 0.15)" />

        {/* Main Body using gradient */}
        <ellipse cx="35" cy="50" rx="32" ry="48" fill="url(#pickleBodyGradient)" className="character-body-pickle" />
        
        {/* Body spots for Pickle Rick */}
        <circle cx="25" cy="35" r="3" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>
        <circle cx="45" cy="60" r="4" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>
        <circle cx="30" cy="75" r="3.5" fill="hsl(var(--character-pickle-dark-green-hsl) / 0.5)" opacity="0.7"/>

        {/* Face group - moved slightly up for better proportion */}
        <g className="character-face-group" transform="translate(0, -5)"> 
          {/* Eyes */}
          <g className="character-eyes-group">
            <ellipse cx="24" cy="42" rx="11" ry="13" className="character-eye-white character-eye-left" />
            <ellipse cx="46" cy="42" rx="11" ry="13" className="character-eye-white character-eye-right" />
            <circle cx="24" cy="42" r="3" className="character-pupil character-pupil-left" />
            <circle cx="46" cy="42" r="3" className="character-pupil character-pupil-right" />
          </g>
          {/* Unibrow */}
          <path d="M 18 30 Q 35 22 52 30" strokeWidth="3" strokeLinecap="round" className="character-unibrow" />
          {/* Mouth - default smiling/smirking path will be animated */}
          <path d="M 22 58 Q 35 72 48 58 Q 35 68 22 58 Z" className="character-mouth" />  
          {/* Tongue - hidden by default, animated for "tongue_out" */}
          <path d="M 30 65 Q 35 62 40 65" className="character-tongue" fill="hsl(var(--character-tongue-hsl))" stroke="hsl(var(--character-mouth-dark-hsl))" strokeWidth="0.5" />
        </g>
        
        {/* Sparkles for teleport/special effects */}
        <g className="character-sparkles">
            <circle cx="35" cy="10" r="3" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="20" r="2" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="15" r="2.5" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        {/* Group for props like cards, paintbrush, etc. Hidden by default. */}
        <g className="character-prop-group">
            {/* Placeholder for props - these will be styled and animated by CSS */}
            {/* <rect x="10" y="50" width="15" height="20" rx="2" fill="hsl(var(--ruby-red-hsl))" className="character-prop-card"/>
            <path d="M55 60 L 65 50 L 60 45 Z" fill="hsl(var(--emerald-green-hsl))" className="character-prop-paintbrush"/> */}
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
    // Attempt to get the chat area. If it's not there, movement will be less constrained.
    chatAreaRef.current = document.getElementById('chat-area-wrapper');

    return () => { 
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
      if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
    };
  }, []); 

  useEffect(() => {
    if (!isMounted) return;

    // Update animation class based on AI status
    if (position.currentAnimationClass !== currentVisuals.characterAnimationClass) {
       setPosition(prev => ({...prev, currentAnimationClass: currentVisuals.characterAnimationClass}));
    }

    const scheduleMovement = () => {
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      
      // Approximate character dimensions (can be refined)
      // Based on w-20 (80px at base font size) and aspect ratio, let's say ~115px height
      const charWidthPx = 80; 
      const charHeightPx = 115; 

      const calculateSafeZones = () => {
        // Default "forbidden" zone if chat area isn't found - a generous center area.
        let forbiddenRect = { 
            top: window.innerHeight * 0.25, 
            bottom: window.innerHeight * 0.75, 
            left: window.innerWidth * 0.20, 
            right: window.innerWidth * 0.80,
        };
        
        if (chatAreaRef.current) {
          const rect = chatAreaRef.current.getBoundingClientRect();
           // Define the forbidden zone around the chat area, ensuring character doesn't overlap too much
           // The character's position is its center, so adjust for half its width/height
           const padding = 10; // Small padding
           forbiddenRect = { 
            top: rect.top - charHeightPx / 2 - padding, 
            bottom: rect.bottom + charHeightPx / 2 + padding, 
            left: rect.left - charWidthPx / 2 - padding, 
            right: rect.right + charWidthPx / 2 + padding,
          };
        }
        return { forbiddenRect };
      };
      
      const isOverlappingForbiddenZone = (centerX: number, centerY: number, zone: { top: number, bottom: number, left: number, right: number }) => {
          return centerX > zone.left && centerX < zone.right &&
                 centerY > zone.top && centerY < zone.bottom;
      };

      let newTopPercentStr = position.top; 
      let newLeftPercentStr = position.left;
      
      const { forbiddenRect } = calculateSafeZones();
      let attempts = 0;
      let randomXPx = 0, randomYPx = 0;
      const maxAttempts = 50;
      
      // Try to find a position outside the forbidden zone
      do {
        // Random position within viewport, ensuring character center is fully visible
        randomXPx = (charWidthPx / 2) + Math.random() * (window.innerWidth - charWidthPx);
        randomYPx = (charHeightPx / 2) + Math.random() * (window.innerHeight - charHeightPx);
        attempts++;
      } while (
        isOverlappingForbiddenZone(randomXPx, randomYPx, forbiddenRect) && attempts < maxAttempts
      );
      
      // If a non-overlapping position is found, use it
      if (attempts < maxAttempts) { 
          newLeftPercentStr = `${(randomXPx / window.innerWidth) * 100}%`;
          newTopPercentStr = `${(randomYPx / window.innerHeight) * 100}%`;
      } else {
          // Fallback: if too many attempts, place it along the edges, away from the center bias of the forbidden zone
          const edgeMarginPercent = 5; // % from edge
          if (Math.random() < 0.5) { // Top or Bottom edge
            newTopPercentStr = Math.random() < 0.5 ? `${edgeMarginPercent}%` : `${100 - edgeMarginPercent}%`;
            newLeftPercentStr = `${(Math.random() * (100 - 2 * edgeMarginPercent)) + edgeMarginPercent}%`;
          } else { // Left or Right edge
            newLeftPercentStr = Math.random() < 0.5 ? `${edgeMarginPercent}%` : `${100 - edgeMarginPercent}%`;
            newTopPercentStr = `${(Math.random() * (100 - 2 * edgeMarginPercent)) + edgeMarginPercent}%`;
          }
      }
      
      const doMove = () => {
        setPosition(prev => ({
          ...prev,
          top: newTopPercentStr,
          left: newLeftPercentStr,
        }));
      };

      // Movement delay, shorter if teleporting
      let movementDelayMs = 2500 + Math.random() * 3000; // 2.5s to 5.5s
      if (effectiveStatus === 'idle' && idleVariation === 'teleporting') {
        movementDelayMs = 750; // Quicker move after teleport
      }
      
      movementTimeoutRef.current = setTimeout(doMove, movementDelayMs);
    };

    scheduleMovement();
    
    return () => { 
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveStatus, isMounted, idleVariation]); 


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

          // Adjusted probabilities after removing 'sleeping'
          if (rand < 0.30) nextIdleVariation = 'default';        // 30%
          else if (rand < 0.55) nextIdleVariation = 'tongue_out'; // 25%
          else if (rand < 0.75) nextIdleVariation = 'laughing';     // 20%
          else if (rand < 0.90) nextIdleVariation = 'poker_face';   // 15%
          else nextIdleVariation = 'teleporting';      // 10%

          setIdleVariation(prevVariation => {
            // If next is teleporting, schedule reset to default face after teleport animation
            if (nextIdleVariation === 'teleporting') {
              if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
              // Teleport animation is 1.5s, reset face shortly after
              idleFaceChangeTimeoutRef.current = setTimeout(() => setIdleVariation('default'), 1500); 
              return 'teleporting';
            }
            // Otherwise, just set the new face variation
            return nextIdleVariation;
          });
          
          // Schedule next idle variation change
          idleVariationTimeoutRef.current = setTimeout(scheduleIdleVariation, 5000 + Math.random() * 5000); // 5s to 10s
      };

      scheduleIdleVariation(); // Initial call to start the cycle

      return () => {
          if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
          if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
      };
  }, [effectiveStatus, isMounted]);


  if (!isMounted) {
    // Prevent SSR or rendering before mount to avoid layout shifts / hydration issues with random positioning
    return null;
  }

  return (
    <div 
      className="fixed z-0 pointer-events-none" // Character is behind chat but visible
      style={{ 
        top: position.top, 
        left: position.left, 
        transform: 'translate(-50%, -50%)', // Center the character on the coordinates
      }}
      aria-hidden="true"
    >
      <AiCharacterSVG 
        animationClass={cn(position.currentAnimationClass)}
        idleVariation={status === 'idle' ? idleVariation : 'default'} // Only apply idle face variations when status is idle
      />
    </div>
  );
}

