'use client';

import type { ChatMessage } from '@/lib/types';
import { ChatMessageItem } from './chat-message-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-[400px] sm:h-[500px] w-full rounded-md border border-border p-4 shadow-inner bg-background/30" ref={scrollAreaRef}>
       <div ref={viewportRef} className="h-full w-full"> {/* This div is now the direct child for scrolling */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-xl font-semibold text-muted-foreground">Welcome to TellMeIf AI!</p>
            <p className="text-muted-foreground">Ask a question or describe a scenario below to begin.</p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
        )}
      </div>
    </ScrollArea>
  );
}

    