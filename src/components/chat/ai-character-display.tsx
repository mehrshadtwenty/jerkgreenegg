
'use client';

import type { AiStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AiCharacterDisplayProps {
  status: AiStatus;
  isUserTyping: boolean;
}

type IdleVariation = 'default' | 'tongue_out' | 'laughing' | 'poker_face' | 'teleporting';


// Status mapping for Tokhme Sabz (Green Egg)
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
  // Character container size is now controlled by .character-container class in globals.css
  return (
     <div className={cn(
        "character-container",
         animationClass,
         idleVariation === 'tongue_out' && 'is-tongue-out',
         idleVariation === 'teleporting' && 'is-teleporting',
         idleVariation === 'laughing' && 'is-laughing',
         idleVariation === 'poker_face' && 'is-poker-face'
      )}
     >
      <svg viewBox="0 0 70 100" className="ai-character-svg">
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
          {/* Unibrow removed */}
          <path d="M 18 58 Q 35 72 52 58 Q 35 68 18 58 Z" className="character-mouth" />  
          <path d="M 30 65 Q 35 62 40 65" className="character-tongue" fill="hsl(var(--character-tongue-hsl))" stroke="hsl(var(--character-mouth-dark-hsl))" strokeWidth="0.5" />
        </g>
        
        <g className="character-sparkles">
            <circle cx="35" cy="10" r="3" fill="hsl(var(--accent))" className="sparkle-1"/>
            <circle cx="15" cy="20" r="2" fill="hsl(var(--golden-yellow-hsl))" className="sparkle-2"/>
            <circle cx="55" cy="15" r="2.5" fill="hsl(var(--neon-pink-hsl))" className="sparkle-3"/>
        </g>

        <g className="character-prop-group">
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
  
  const chatAreaWrapperRef = useRef<HTMLDivElement | null>(null);
  const movementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleVariationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleFaceChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setIsMounted(true);
    chatAreaWrapperRef.current = document.getElementById('chat-area-wrapper');

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
      
      const charWidthPx = 96; 
      const charHeightPx = Math.round(charWidthPx * (100/70)); 

      const calculateSafeZones = () => {
        let forbiddenRect = { 
            top: window.innerHeight * 0.20, 
            bottom: window.innerHeight * 0.80, 
            left: window.innerWidth * 0.15, 
            right: window.innerWidth * 0.85,
        };
        
        if (chatAreaWrapperRef.current) {
          const rect = chatAreaWrapperRef.current.getBoundingClientRect();
           const padding = 20; 
           forbiddenRect = { 
            top: rect.top - charHeightPx - padding,
            bottom: rect.bottom + padding, 
            left: rect.left - charWidthPx - padding,
            right: rect.right + charWidthPx + padding,
          };
        }
        return { forbiddenRect };
      };
      
      const isOverlappingForbiddenZone = (newX: number, newY: number, zone: { top: number, bottom: number, left: number, right: number }) => {
          const charLeft = newX - charWidthPx / 2;
          const charRight = newX + charWidthPx / 2;
          const charTop = newY - charHeightPx / 2;
          const charBottom = newY + charHeightPx / 2;

          return charRight > zone.left && charLeft < zone.right &&
                 charBottom > zone.top && charTop < zone.bottom;
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
          const edgeMarginPercent = Math.max(5, (charWidthPx / window.innerWidth) * 100 + 2); 
          const verticalEdgeMarginPercent = Math.max(5, (charHeightPx / window.innerHeight) * 100 + 2);

          if (Math.random() < 0.5) { 
            newTopPercentStr = Math.random() < 0.5 ? `${verticalEdgeMarginPercent}%` : `${100 - verticalEdgeMarginPercent}%`;
            newLeftPercentStr = `${(Math.random() * (100 - 2 * edgeMarginPercent)) + edgeMarginPercent}%`;
          } else { 
            newLeftPercentStr = Math.random() < 0.5 ? `${edgeMarginPercent}%` : `${100 - edgeMarginPercent}%`;
            newTopPercentStr = `${(Math.random() * (100 - 2 * verticalEdgeMarginPercent)) + verticalEdgeMarginPercent}%`;
          }
      }
      
      const doMove = () => {
        setPosition(prev => ({
          ...prev,
          top: newTopPercentStr,
          left: newLeftPercentStr,
        }));
      };

      let movementDelayMs = 3000 + Math.random() * 4000; 
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


  useEffect(() => {
      if (effectiveStatus !== 'idle' || !isMounted) {
          if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
          if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
          setIdleVariation('default'); 
          return;
      }

      const scheduleIdleVariation = () => {
          if (idleVariationTimeoutRef.current) clearTimeout(idleVariationTimeoutRef.current);
          
          const idleVariationsArray: IdleVariation[] = ['default', 'tongue_out', 'laughing', 'poker_face'];
          let nextIdleVariation = idleVariationsArray[Math.floor(Math.random() * idleVariationsArray.length)];
          
          if (Math.random() < 0.1) nextIdleVariation = 'teleporting'; 

          setIdleVariation(prevVariation => {
            if (nextIdleVariation === 'teleporting' && prevVariation !== 'teleporting') {
              if (idleFaceChangeTimeoutRef.current) clearTimeout(idleFaceChangeTimeoutRef.current);
              idleFaceChangeTimeoutRef.current = setTimeout(() => setIdleVariation('default'), 1500); 
              return 'teleporting';
            }
            if (prevVariation === 'teleporting' && nextIdleVariation === 'teleporting') {
              return 'default';
            }
            return nextIdleVariation;
          });
          
          idleVariationTimeoutRef.current = setTimeout(scheduleIdleVariation, 7000 + Math.random() * 6000); 
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
      className="fixed pointer-events-none"
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
