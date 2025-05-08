'use client';

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (question: string, generateImage: boolean) => Promise<void>;
  isLoading: boolean;
  onUserTypingChange: (isTyping: boolean) => void;
}

export function ChatInput({ onSubmit, isLoading, onUserTypingChange }: ChatInputProps) {
  const [question, setQuestion] = useState('');
  const [generateImage, setGenerateImage] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onUserTypingChange(false); // Stop typing animation on submit
    await onSubmit(question, generateImage);
    setQuestion('');
    // setGenerateImage(false); // Optionally reset checkbox
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
    <form onSubmit={handleSubmit} className="mt-6 p-4 border-t border-border bg-card/50 rounded-b-lg shadow-up-lg">
      <div className="relative">
        <Textarea
          value={question}
          onChange={handleTextChange}
          onFocus={() => onUserTypingChange(question.trim().length > 0)}
          onBlur={() => onUserTypingChange(false)}
          placeholder="Type your question or scenario here... e.g., 'What if cats could talk?'"
          className="pr-20 min-h-[80px] text-base bg-input text-input-foreground placeholder:text-muted-foreground/70 focus:ring-accent"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-70"
          disabled={isLoading || !question.trim()}
          aria-label="Send question"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="generateImage" 
            checked={generateImage}
            onCheckedChange={(checked) => setGenerateImage(Boolean(checked))}
            disabled={isLoading}
            className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
          />
          <Label htmlFor="generateImage" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-emerald-green-hsl" />
            Imagine It? (Generate an image)
          </Label>
        </div>
      </div>
    </form>
  );
}
