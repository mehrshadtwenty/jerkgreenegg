
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import type { ChatMessage, AiStatus, GalleryImage } from '@/lib/types';
import { ChatMessageItem } from '@/components/chat/chat-message-item';
import { AiCharacterDisplay } from '@/components/chat/ai-character-display';
import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { generateImageFromQuestion } from '@/ai/flows/generate-image-from-question';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button'; 
import { Send, Sparkles, StopCircle, Trash2, GalleryHorizontalEnd } from 'lucide-react';
import { ImageCard } from '@/components/gallery/image-card';
import { cn } from '@/lib/utils';


const LOCAL_STORAGE_GALLERY_KEY = 'tellMeIfAiGallery';

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState('');

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isClient, setIsClient] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedImages = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
      if (storedImages) {
        setGalleryImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error("Failed to load gallery from localStorage:", error);
      toast({
        title: "Storage Error, Dumbass",
        description: "Couldn't load your shitty 'art' from local gallery. Big surprise.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveToGallery = (newImage: GalleryImage) => {
    try {
      const currentGallery = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY) || '[]');
      currentGallery.unshift(newImage); 
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(currentGallery.slice(0, 50))); 
      setGalleryImages(currentGallery.slice(0, 50)); 
    } catch (error) {
      console.error("Failed to save to gallery in localStorage:", error);
      toast({
        title: "Storage Full of Crap Error",
        description: "Couldn't save image to local gallery. Probably full of your other terrible ideas.",
        variant: "destructive",
      });
    }
  };

  const handleNewMessageSubmit = async (questionText: string) => {
    if (!questionText.trim()) return;

    setIsLoading(true);
    setIsUserTyping(false); 
    setAiStatus('thinking_text');
    setCurrentQuestion(''); 

    const userMessage: ChatMessage = { id: uuidv4(), role: 'user', text: questionText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    const aiPlaceholderMessageId = uuidv4();
    const aiPlaceholderMessage: ChatMessage = {
      id: aiPlaceholderMessageId,
      role: 'assistant',
      isLoadingText: true,
      originalQuestion: questionText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    let textResultError = null;
    try {
      const textResult = await answerUserQuestion({ question: questionText });
      setMessages(prev => prev.map(msg =>
        msg.id === aiPlaceholderMessageId ? {
          ...msg,
          text: textResult.answer,
          isLoadingText: false,
          timestamp: new Date()
        } : msg
      ));
      setAiStatus('presenting_text');
    } catch (error) {
      textResultError = error;
      console.error("Error getting text answer:", error);
      setMessages(prev => prev.map(msg =>
        msg.id === aiPlaceholderMessageId ? {
          ...msg,
          text: "My circuits are fried, or maybe I'm just too lazy to answer that. Ask something else, preferably less stupid, you absolute walnut.",
          isLoadingText: false,
          timestamp: new Date()
        } : msg
      ));
      setAiStatus('error');
      toast({ title: "AI Text Error - My Brain Hurts", description: "The AI is having a moment. Probably because your question was idiotic.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      if (textareaRef.current) textareaRef.current.focus();
      setTimeout(() => setAiStatus(prevStatus => (textResultError && prevStatus === 'error') ? 'error' : 'idle'), textResultError ? 2500: 1500);
    }
  };

  const handleGenerateImageForLastResponse = async () => {
    const lastAiMessage = [...messages].reverse().find(
      m => m.role === 'assistant' && m.text && !m.isLoadingText && !m.isLoadingImage && !m.imageUrl
    );

    if (!lastAiMessage || !lastAiMessage.originalQuestion) {
      toast({
        title: "What am I supposed to imagine, genius?",
        description: "There's no proper AI response to base an image on. Ask a question first, maybe one that doesn't suck for a change.",
        variant: "default"
      });
      return;
    }

    setIsLoading(true); 
    setIsImageGenerating(true);
    setAiStatus('thinking_image');

    setMessages(prev => prev.map(msg =>
      msg.id === lastAiMessage.id ? { ...msg, isLoadingImage: true } : msg
    ));

    let imageErrorOccurred = null;
    try {
      const imagePromptContext = lastAiMessage.originalQuestion; 
      const imageResult = await generateImageFromQuestion({ question: imagePromptContext });
      
      if (imageResult.imageUrl) {
        saveToGallery({ id: uuidv4(), prompt: imagePromptContext, imageUrl: imageResult.imageUrl, timestamp: new Date() });
      }
      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { ...msg, imageUrl: imageResult.imageUrl, isLoadingImage: false } : msg
      ));
      setAiStatus('presenting_image');
    } catch (imageError) {
      imageErrorOccurred = imageError;
      console.error("Error generating image:", imageError);
      // Image generation failed, do not append text to the message.
      // The toast notification will inform the user.
      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { ...msg, isLoadingImage: false } : msg
      ));
      setAiStatus('error');
      toast({ title: "AI Image Malfunction - Shocking", description: "Couldn't generate an image. My artistic talent is wasted on your crap prompts.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setIsImageGenerating(false);
      setTimeout(() => setAiStatus(prevStatus => (imageErrorOccurred && prevStatus === 'error') ? 'error' : 'idle'), imageErrorOccurred ? 2500 : 1500);
    }
  };

  const handleStopImageGeneration = () => {
    setIsImageGenerating(false);
    setIsLoading(false); 
    setAiStatus('idle');

    // Do not append text message if image generation is stopped by user.
    setMessages(prev => prev.map(msg =>
      msg.isLoadingImage ? { ...msg, isLoadingImage: false } : msg
    ));

    toast({ title: "Image Generation Halted - You Quitter", description: "Alright, genius, I've stopped. My masterpiece can wait for someone less impatient." });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion(e.target.value);
    const typing = e.target.value.trim().length > 0;
    if (typing && !isUserTyping) {
      setAiStatus('user_typing'); 
    } else if (!typing && isUserTyping) {
      setAiStatus('idle'); 
    }
    setIsUserTyping(typing);
  };
  
  const handleFocus = () => {
    if (currentQuestion.trim().length > 0) {
      setIsUserTyping(true);
      setAiStatus('user_typing');
    }
  };

  const handleBlur = () => {
    setIsUserTyping(false);
    if (aiStatus === 'user_typing') {
      setAiStatus('idle');
    }
  };


  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNewMessageSubmit(currentQuestion);
  };

  const clearGallery = () => {
    if (window.confirm("You sure you wanna delete all this 'art', you cretin? Can't get it back.")) {
      localStorage.removeItem(LOCAL_STORAGE_GALLERY_KEY);
      setGalleryImages([]);
      toast({ title: "Gallery Nuked. Good Riddance.", description: "All images gone. Not like they were Mona Lisas."});
    }
  };


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      <AiCharacterDisplay status={aiStatus} isUserTyping={isUserTyping} /> 
      
      <div className="flex-grow flex flex-col overflow-hidden pt-16"> 
        {/* Chat Area - Max width changed to 2xl */}
        <div className="relative z-20 flex-grow flex flex-col max-w-2xl w-full mx-auto overflow-hidden">
          <ScrollArea className="flex-grow p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center pt-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot mx-auto mb-4 opacity-70"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                <p className="text-xl font-semibold text-muted-foreground font-heading">The Void Awaits Your Stupidity!</p>
                <p className="text-muted-foreground text-sm">Go on, ask something. Try not to bore me to actual, literal death.</p>
              </div>
            ) : (
              messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-3 border-t border-border/50 bg-card/80 backdrop-blur-sm">
            <form onSubmit={handleSubmitForm} className="relative">
              <Textarea
                ref={textareaRef}
                value={currentQuestion}
                onChange={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Tell me if… (Don't be shy, your questions can't get much dumber!)"
                className="pr-12 min-h-[50px] text-base bg-input/70 text-input-foreground placeholder:text-muted-foreground/60 
                           border-2 border-primary/30 
                           focus:border-accent focus:shadow-fantasy-glow-accent focus:ring-0
                           rounded-lg shadow-inner resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitForm(e as unknown as FormEvent<HTMLFormElement>);
                  }
                }}
                disabled={isLoading || isImageGenerating}
                rows={1} 
                aria-label="Your question"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-70 rounded-full shadow-md hover:shadow-fantasy-glow-accent w-9 h-9"
                disabled={isLoading || isImageGenerating || !currentQuestion.trim()}
                aria-label="Send question"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 flex items-center justify-between text-sm">
              <div>
                <span
                  onClick={!isLoading && !isImageGenerating ? handleGenerateImageForLastResponse : undefined}
                  className={cn(
                    'text-link-style',
                    (isLoading || isImageGenerating) && 'opacity-50 cursor-not-allowed'
                  )}
                  role="button"
                  tabIndex={(isLoading || isImageGenerating) ? -1 : 0}
                  aria-disabled={isLoading || isImageGenerating}
                >
                  <Sparkles className="inline-block h-4 w-4 mr-1" />
                  Generate Image (If you've got the guts, pipsqueak)
                </span>
              </div>
              {isImageGenerating && (
                <div>
                  <span
                    onClick={handleStopImageGeneration}
                    className="text-link-style-stop"
                    role="button"
                    tabIndex={0}
                  >
                    <StopCircle className="inline-block h-4 w-4 mr-1" />
                    Stop! (My genius is too much for your feeble mind anyway)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isClient && (
          <ScrollArea className="relative z-10 h-1/3 max-h-72 mt-4 border-t border-border/30 p-4 bg-card/30"> 
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-bold font-heading text-primary drop-shadow-sm flex items-center gap-2">
                <GalleryHorizontalEnd className="h-7 w-7 text-secondary" />
                Visions of My Infinite Genius (and some crap I made)
              </h2>
              {galleryImages.length > 0 && (
                <Button variant="destructive" size="sm" onClick={clearGallery} className="font-heading text-xs">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Clear This Abomination
                </Button>
              )}
            </div>
            {galleryImages.length === 0 ? (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 lucide lucide-images opacity-60">
                  <path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 18-3-3c-.928-.899-2.34-.926-3.296-.074L9 19"/><path d="M14.5 11.5a1.5 1.5 0 0 1 0-3l.5-.5a1.5 1.5 0 0 1 3 0l.5.5a1.5 1.5 0 0 1 0 3l-.5.5a1.5 1.5 0 0 1-3 0Z"/><path d="m22 6-3-3c-.928-.899-2.34-.926-3.296-.074L9 8"/>
                </svg>
                <p className="text-lg font-semibold font-heading text-muted-foreground">Gallery's Empty. What a surprise, not.</p>
                <p className="text-muted-foreground text-xs">Click "Generate Image" in chat. Maybe you'll get lucky and I'll make something that doesn't completely suck. Doubt it.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {galleryImages.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

