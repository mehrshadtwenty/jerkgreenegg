'use client';

import type { ChatMessage } from '@/lib/types';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Avatar no longer used
import { Card, CardContent } from '@/components/ui/card';
// import { User, Bot } from 'lucide-react'; // Icons for Avatar no longer used
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const alignment = isUser ? 'items-end' : 'items-start';
  const bubbleColor = isUser ? 'bg-primary/80 text-primary-foreground' : 'bg-secondary/90 text-secondary-foreground';
  const bubblePosition = isUser ? 'rounded-br-none' : 'rounded-bl-none';

  return (
    <div className={cn('flex flex-col gap-1 py-3', alignment)}>
      <div className={cn('flex items-end', isUser ? 'flex-row-reverse' : 'flex-row')}>
        {/* Avatar component removed as per request */}
        <Card className={cn('max-w-xs sm:max-w-md md:max-w-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02]', bubbleColor, bubblePosition)}>
          <CardContent className="p-3 space-y-2">
            {message.isLoadingText && ( 
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              </div>
            )}
            {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
            
            {message.isLoadingImage && ( 
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                <span className="italic">Conjuring image...</span>
              </div>
            )}

            {message.imageUrl && !message.isLoadingImage && (
              <div className="chat-image-container mt-2 rounded-lg overflow-hidden border-2 border-primary/50 shadow-fantasy-glow-primary p-1 bg-black/20">
                <Image 
                  src={message.imageUrl} 
                  alt="Generated image by AI" 
                  width={300} 
                  height={300} 
                  className="object-cover w-full h-auto rounded" 
                  data-ai-hint="fantasy art"
                  priority={true} // Prioritize loading for latest images
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <p className={cn('text-xs text-muted-foreground/80', isUser ? 'text-right mr-1' : 'text-left ml-1')}>
        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
      </p>
    </div>
  );
}

