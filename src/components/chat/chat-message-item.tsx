
'use client';

import type { ChatMessage } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const alignment = isUser ? 'items-end' : 'items-start';
  const bubbleColor = isUser ? 'bg-primary/80 text-primary-foreground' : 'bg-secondary/90 text-secondary-foreground';
  const bubblePosition = isUser ? 'rounded-br-none' : 'rounded-bl-none';
  const { toast } = useToast();

  const handleDownload = () => {
    if (!message.imageUrl) return;

    const link = document.createElement('a');
    link.href = message.imageUrl;
    
    let filename = "ai_generated_image.png"; // Default filename
    if (message.originalQuestion) {
      // Sanitize the original question to use as filename
      filename = message.originalQuestion.substring(0, 50).replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".png";
    } else if (message.text) {
      // Fallback to AI's text response for filename if originalQuestion is not available
      filename = message.text.substring(0,50).replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".png";
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Image Downloading, Asshole!", description: "Your probably shitty image is on its way. Don't fuck it up." });
  };

  return (
    <div className={cn('flex flex-col gap-1 py-3', alignment)}>
      <div className={cn('flex items-end', isUser ? 'flex-row-reverse' : 'flex-row')}>
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
                <span className="italic">Conjuring image... try not to shit your pants in anticipation.</span>
              </div>
            )}

            {message.imageUrl && !message.isLoadingImage && (
              <div className="mt-2 space-y-2">
                <div className="chat-image-container rounded-lg overflow-hidden border-2 border-primary/50 shadow-fantasy-glow-primary p-1 bg-black/20">
                  <Image 
                    src={message.imageUrl} 
                    alt={message.originalQuestion || "AI generated image"} 
                    width={300} 
                    height={300} 
                    className="object-cover w-full h-auto rounded" 
                    data-ai-hint="fantasy art"
                    priority={true} 
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="w-full text-xs bg-card/70 hover:bg-accent hover:text-accent-foreground border-primary/30"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download This Crap
                </Button>
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

