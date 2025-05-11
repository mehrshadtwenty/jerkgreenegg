
'use client';

import type { AiStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

type IdleVariation = 'default' | 'tongue_out' | 'laughing' | 'poker_face' | 'teleporting';


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
  // Adjusted size: base w-32 h-auto (aspect-ratio will handle height) - MODIFIED from w-16
  return (
     <div className={cn(
        "w-32 h-auto character-container",  // MODIFIED from w-16
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
            {/* Example props: Card for card game, Paintbrush for drawing, Zzz for sleeping */}
            <rect x="10" y="50" width="15" height="20" rx="2" fill="hsl(var(--ruby-red-hsl))" className="character-prop-card character-prop-hidden"/>
            <path d="M55 60 L 65 50 L 60 45 Z" fill="hsl(var(--emerald-green-hsl))" className="character-prop-paintbrush character-prop-hidden"/>
            <text x="35" y="25" className="character-prop-zzz character-prop-hidden" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">Zzz</text>
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
      // Based on w-32 (128px at base font size) and aspect ratio, let's say ~183px height (128 * 100/70)
      const charWidthPx = 128; 
      const charHeightPx = Math.round(charWidthPx * (100/70)); // Maintain aspect ratio

      const calculateSafeZones = () => {
        let forbiddenRect = { 
            top: window.innerHeight * 0.25, 
            bottom: window.innerHeight * 0.75, 
            left: window.innerWidth * 0.20, 
            right: window.innerWidth * 0.80,
        };
        
        if (chatAreaRef.current) {
          const rect = chatAreaRef.current.getBoundingClientRect();
           const padding = 10; 
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
      
      do {
        randomXPx = (charWidthPx / 2) + Math.random() * (window.innerWidth - charWidthPx);
        randomYPx = (charHeightPx / 2) + Math.random() * (window.innerHeight - charHeightPx);
        attempts++;
      } while (
        isOverlappingForbiddenZone(randomXPx, randomYPx, forbiddenRect) && attempts < maxAttempts
      );
      
      if (attempts < maxAttempts) { 
          newLeftPercentStr = `${(randomXPx / window.innerWidth) * 100}%`;
          newTopPercentStr = `${(randomYPx / window.innerHeight) * 100}%`;
      } else {
          const edgeMarginPercent = 5; 
          if (Math.random() < 0.5) { 
            newTopPercentStr = Math.random() < 0.5 ? `${edgeMarginPercent}%` : `${100 - edgeMarginPercent}%`;
            newLeftPercentStr = `${(Math.random() * (100 - 2 * edgeMarginPercent)) + edgeMarginPercent}%`;
          } else { 
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

      let movementDelayMs = 2500 + Math.random() * 3000; 
      if (effectiveStatus === 'idle' && idleVariation === 'teleporting') {
        movementDelayMs = 750; 
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

          // Cycle through default, tongue_out, laughing (smile), poker_face, teleporting
          // Removed 'sleeping' and 'eye_roll'
          if (rand < 0.25) nextIdleVariation = 'default';         // 25%
          else if (rand < 0.50) nextIdleVariation = 'tongue_out';  // 25%
          else if (rand < 0.75) nextIdleVariation = 'laughing';    // 25% (serves as smile)
          else nextIdleVariation = 'poker_face';  // 25%
          // Teleporting can be triggered as part of a movement sequence or less frequently as a direct idle variation
          if (Math.random() < 0.1) nextIdleVariation = 'teleporting'; // 10% chance to teleport

          setIdleVariation(prevVariation => {
            if (nextIdleVariation === 'teleporting') {
              if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
              idleFaceChangeTimeoutRef.current = setTimeout(() => setIdleVariation('default'), 1500); 
              return 'teleporting';
            }
            return nextIdleVariation;
          });
          
          idleVariationTimeoutRef.current = setTimeout(scheduleIdleVariation, 5000 + Math.random() * 5000); 
      };

      scheduleIdleVariation(); 

      return () => {
          if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
          if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
      };
  }, [effectiveStatus, isMounted]);


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

    