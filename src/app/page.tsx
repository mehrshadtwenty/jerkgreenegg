
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
import { Button } from '@/components/ui/button'; // Keep for potential future use or styling
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
        title: "Storage Error",
        description: "Could not load images from local gallery.",
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
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(currentGallery.slice(0, 50))); // Limit gallery size
      setGalleryImages(currentGallery.slice(0, 50)); // Update state
    } catch (error) {
      console.error("Failed to save to gallery in localStorage:", error);
      toast({
        title: "Storage Error",
        description: "Could not save image to local gallery.",
        variant: "destructive",
      });
    }
  };

  const handleNewMessageSubmit = async (questionText: string) => {
    if (!questionText.trim()) return;

    setIsLoading(true);
    setIsUserTyping(false);
    setAiStatus('thinking_text');
    setCurrentQuestion(''); // Clear textarea

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
          text: "My magic circuits are a bit tangled! My humanoid form is glitching. Please try that again.",
          isLoadingText: false,
          timestamp: new Date()
        } : msg
      ));
      setAiStatus('error');
      toast({ title: "AI Text Error", description: "Failed to get text response.", variant: "destructive" });
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
        title: "Nothing to Imagine",
        description: "There's no suitable AI response to generate an image for, or the original question is missing.",
        variant: "default"
      });
      return;
    }

    setIsLoading(true); // General loading state for UI disabling
    setIsImageGenerating(true); // Specific state for image generation
    setAiStatus('thinking_image');

    setMessages(prev => prev.map(msg =>
      msg.id === lastAiMessage.id ? { ...msg, isLoadingImage: true } : msg
    ));

    let imageErrorOccurred = null;
    try {
      const imageResult = await generateImageFromQuestion({ question: lastAiMessage.originalQuestion });
      if (imageResult.imageUrl) {
        saveToGallery({ id: uuidv4(), prompt: lastAiMessage.originalQuestion, imageUrl: imageResult.imageUrl, timestamp: new Date() });
      }
      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { ...msg, imageUrl: imageResult.imageUrl, isLoadingImage: false } : msg
      ));
      setAiStatus('presenting_image');
    } catch (imageError) {
      imageErrorOccurred = imageError;
      console.error("Error generating image:", imageError);
      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { ...msg, isLoadingImage: false } : msg
      ));
      setAiStatus('error');
      toast({ title: "AI Image Error", description: "Failed to generate image.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setIsImageGenerating(false);
      setTimeout(() => setAiStatus(prevStatus => (imageErrorOccurred && prevStatus === 'error') ? 'error' : 'idle'), imageErrorOccurred ? 2500 : 1500);
    }
  };

  const handleStopImageGeneration = () => {
    // This logic would ideally involve actually stopping the Genkit flow if possible.
    // For now, it's a client-side stop of waiting and visual feedback.
    setIsImageGenerating(false);
    setIsLoading(false); // Reset general loading state
    setAiStatus('idle');

    setMessages(prev => prev.map(msg =>
      msg.isLoadingImage ? { ...msg, isLoadingImage: false, text: (msg.text || "") + "\n\n(Hmph. Changed your mind, huh? Fine, no masterpiece for you... this time.)" } : msg
    ));

    toast({ title: "Image Generation Halted", description: "Alright, alright, I'll stop conjuring... for now! My creative genius was just warming up." });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion(e.target.value);
    setIsUserTyping(e.target.value.trim().length > 0);
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNewMessageSubmit(currentQuestion);
  };

  const clearGallery = () => {
    if (window.confirm("Are you sure you want to clear the entire gallery? This cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_GALLERY_KEY);
      setGalleryImages([]);
      toast({ title: "Gallery Cleared", description: "All images have been removed from your local gallery."});
    }
  };


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      <AiCharacterDisplay status={aiStatus} isUserTyping={isUserTyping} />
      
      {/* Main Content Area: Chat and Gallery */}
      <div className="flex-grow flex flex-col overflow-hidden pt-16"> {/* pt for AppHeader */}
        {/* Chat Area */}
        <div className="flex-grow flex flex-col max-w-3xl w-full mx-auto overflow-hidden">
          <ScrollArea className="flex-grow p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center pt-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot mx-auto mb-4 opacity-70"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                <p className="text-xl font-semibold text-muted-foreground font-heading">The Void Awaits Your Query!</p>
                <p className="text-muted-foreground text-sm">Go on, ask me something. Try not to bore me.</p>
              </div>
            ) : (
              messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Combined Input and Action Area */}
          <div className="p-3 border-t border-border/50 bg-card/80 backdrop-blur-sm">
            <form onSubmit={handleSubmitForm} className="relative">
              <Textarea
                ref={textareaRef}
                value={currentQuestion}
                onChange={handleTextChange}
                onFocus={() => setIsUserTyping(currentQuestion.trim().length > 0)}
                onBlur={() => setIsUserTyping(false)}
                placeholder="Tell me if…"
                className="pr-12 min-h-[50px] text-base bg-input/70 text-input-foreground placeholder:text-muted-foreground/60 
                           border-2 border-primary/30 
                           focus:border-accent focus:shadow-fantasy-glow-accent focus:ring-0
                           rounded-lg shadow-inner resize-none" // resize-none to control height better
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitForm(e as unknown as FormEvent<HTMLFormElement>);
                  }
                }}
                disabled={isLoading || isImageGenerating}
                rows={1} // Start with 1 row, auto-expands with content due to min-h
                aria-label="Your question"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-70 rounded-full shadow-md hover:shadow-fantasy-glow-accent w-9 h-9" // Adjusted size
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
                  Generate Image
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
                    Stop
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Section - only rendered client side */}
        {isClient && (
          <ScrollArea className="h-1/3 max-h-72 mt-4 border-t border-border/30 p-4 bg-card/30">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-bold font-heading text-primary drop-shadow-sm flex items-center gap-2">
                <GalleryHorizontalEnd className="h-7 w-7 text-secondary" />
                Visions of the AI
              </h2>
              {galleryImages.length > 0 && (
                <Button variant="destructive" size="sm" onClick={clearGallery} className="font-heading text-xs">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Clear Gallery
                </Button>
              )}
            </div>
            {galleryImages.length === 0 ? (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 lucide lucide-images opacity-60">
                  <path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 18-3-3c-.928-.899-2.34-.926-3.296-.074L9 19"/><path d="M14.5 11.5a1.5 1.5 0 0 1 0-3l.5-.5a1.5 1.5 0 0 1 3 0l.5.5a1.5 1.5 0 0 1 0 3l-.5.5a1.5 1.5 0 0 1-3 0Z"/><path d="m22 6-3-3c-.928-.899-2.34-.926-3.296-.074L9 8"/>
                </svg>
                <p className="text-lg font-semibold font-heading text-muted-foreground">The Gallery is Bare!</p>
                <p className="text-muted-foreground text-xs">Ask me to "Generate Image" in the chat, and my masterpieces will appear here!</p>
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
