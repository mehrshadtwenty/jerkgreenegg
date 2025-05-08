'use client';

import type { ChatMessage } from '@/lib/types';
import { ChatMessageItem } from './chat-message-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const viewportRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (viewportRef.current) {
      // Scroll to the bottom of the content within the viewport
      viewportRef.current.parentElement?.scrollTo({top: viewportRef.current.scrollHeight, behavior: 'smooth'});
    }
  }, [messages]);

  return (
    <ScrollArea className="w-full h-full"> 
      {/* The direct child of ScrollArea's Viewport is this div */}
      <div ref={viewportRef} className="w-full px-4 py-2 space-y-2"> 
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center pt-10"> {/* Added pt-10 for better centering */}
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-messages-square mx-auto mb-4 opacity-70"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
            <p className="text-xl font-semibold text-muted-foreground font-heading">The Void Awaits Your Query!</p>
            <p className="text-muted-foreground text-sm">Toss a question into the ether and see what magic unfolds.</p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
        )}
      </div>
    </ScrollArea>
  );
}
