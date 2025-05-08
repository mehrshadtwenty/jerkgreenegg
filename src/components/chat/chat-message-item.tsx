'use client';

import type { ChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { User, Bot } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const alignment = isUser ? 'items-end' : 'items-start';
  const bubbleColor = isUser ? 'bg-primary/80 text-primary-foreground' : 'bg-secondary/80 text-secondary-foreground';
  const bubblePosition = isUser ? 'rounded-br-none' : 'rounded-bl-none';

  return (
    <div className={cn('flex flex-col gap-2 py-3', alignment)}>
      <div className={cn('flex gap-3 items-end', isUser ? 'flex-row-reverse' : 'flex-row')}>
        <Avatar className="shadow-md">
          <AvatarImage src={isUser ? undefined : "https://picsum.photos/40/40?random=2"} alt={isUser ? "User" : "AI Genie"} data-ai-hint={isUser ? "user avatar" : "genie avatar"} />
          <AvatarFallback className={cn(isUser ? "bg-accent text-accent-foreground" : "bg-mystic-gold-hsl text-primary-foreground")}>
            {isUser ? <User /> : <Bot />}
          </AvatarFallback>
        </Avatar>
        <Card className={cn('max-w-xs sm:max-w-md md:max-w-lg shadow-lg transform transition-all duration-300 hover:scale-105', bubbleColor, bubblePosition)}>
          <CardContent className="p-3 space-y-2">
            {message.isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              </div>
            )}
            {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
            {message.imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border-2 border-primary/50">
                <Image 
                  src={message.imageUrl} 
                  alt="Generated image" 
                  width={300} 
                  height={300} 
                  className="object-cover w-full h-auto" 
                  data-ai-hint="fantasy art"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <p className={cn('text-xs text-muted-foreground/80', isUser ? 'text-right pr-12' : 'text-left pl-12')}>
        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
      </p>
    </div>
  );
}

    