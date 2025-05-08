'use client';

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (question: string) => Promise<void>; // Image generation is now separate
  onGenerateImageRequest: () => void; // New handler for generating image for last response
  isLoading: boolean;
  onUserTypingChange: (isTyping: boolean) => void;
}

export function ChatInput({ onSubmit, onGenerateImageRequest, isLoading, onUserTypingChange }: ChatInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onUserTypingChange(false); 
    await onSubmit(question); // No longer passes generateImage boolean
    setQuestion('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    if (e.target.value.trim().length > 0) {
      onUserTypingChange(true);
    } else {
      onUserTypingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-4 border-t border-border/50 bg-card/30 rounded-b-lg shadow-up-lg">
      <div className="relative">
        <Textarea
          value={question}
          onChange={handleTextChange}
          onFocus={() => onUserTypingChange(question.trim().length > 0)}
          onBlur={() => onUserTypingChange(false)}
          placeholder="Tell me if…"
          className="pr-20 min-h-[70px] text-base bg-input/70 text-input-foreground placeholder:text-muted-foreground/60 
                     border-2 border-primary/30 
                     focus:border-accent focus:shadow-fantasy-glow-accent focus:ring-0
                     rounded-lg shadow-inner"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }
          }}
          disabled={isLoading}
          aria-label="Your question"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-70 rounded-full shadow-md hover:shadow-fantasy-glow-accent"
          disabled={isLoading || !question.trim()}
          aria-label="Send question"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-start"> {/* Changed to justify-start */}
        <Button
          type="button" // Important: not a submit button
          variant="link"
          onClick={onGenerateImageRequest}
          disabled={isLoading}
          className="p-0 h-auto text-sm font-medium text-emerald-green-hsl hover:text-emerald-green-hsl/80 disabled:text-muted-foreground/70 flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4" />
          Generate Image for last response
        </Button>
      </div>
    </form>
  );
}
