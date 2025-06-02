
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import type { ChatMessage, AiStatus } from '@/lib/types';
import { ChatMessageItem } from '@/components/chat/chat-message-item';
import { AiCharacterDisplay } from '@/components/chat/ai-character-display';
import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { generateImageFromQuestion } from '@/ai/flows/generate-image-from-question';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button'; 
import { Send, Sparkles, StopCircle, Copy } from 'lucide-react'; // Added Copy
import Image from 'next/image'; // Added Image
import { cn } from '@/lib/utils';

const CONTRACT_ADDRESS = "E76gue12NupYS5GwjRR7nyisEKAUpH6F1Pv9UmHMSziu";

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      toast({
        title: "Address Copied, You Magnificent Ape!",
        description: "Contract address copied. Now go buy my shitcoin before I change my mind.",
        variant: "default", 
      });
    } catch (err) {
      console.error('Failed to copy address: ', err);
      toast({
        title: "Copy Failed, Butterfingers!",
        description: "Couldn't copy the address. Can't even copy-paste? Pathetic. Try again, or just stare at it, dumbass.",
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
      const errorMessage = (error instanceof Error && error.message) ? error.message : "My circuits are fried, or maybe I'm just too lazy to answer that. Ask something else, preferably less stupid, you absolute walnut.";
      setMessages(prev => prev.map(msg =>
        msg.id === aiPlaceholderMessageId ? {
          ...msg,
          text: errorMessage,
          isLoadingText: false,
          timestamp: new Date()
        } : msg
      ));
      setAiStatus('error');
      toast({ title: "AI Text Error - My Brain Hurts", description: "The AI is having a moment. Probably because your question was idiotic, or maybe I just don't give a flying fuck.", variant: "destructive" });
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

    if (!lastAiMessage || !lastAiMessage.text) {
      toast({
        title: "What the FUCK am I supposed to imagine, genius?",
        description: "There's no AI answer to base an image on. Ask a question first, or at least wait for me to spew some bullshit, maybe one that doesn't suck donkey balls for a change.",
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
      const imageContext = lastAiMessage.text; 
      const imageResult = await generateImageFromQuestion({ contextForImage: imageContext });
      
      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { ...msg, imageUrl: imageResult.imageUrl, isLoadingImage: false, originalQuestion: lastAiMessage.originalQuestion || lastAiMessage.text } : msg
      ));
      setAiStatus('presenting_image');
    } catch (imageError) {
      imageErrorOccurred = imageError;
      console.error("Error generating image:", imageError);
      const errorMessage = (imageError instanceof Error && imageError.message) ? imageError.message : "Couldn't generate an image. My artistic talent is wasted on your crap prompts, or maybe the server hamster died. Who gives a shit?";
      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { ...msg, isLoadingImage: false } : msg
      ));
      setAiStatus('error');
      toast({ title: "AI Image Malfunction - Shocking", description: errorMessage, variant: "destructive" });
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

    setMessages(prev => prev.map(msg => 
      msg.isLoadingImage ? { ...msg, isLoadingImage: false } : msg
    ));

    toast({ title: "Image Generation Halted - You Quitter", description: "Alright, genius, I've stopped. My masterpiece can wait for someone less impatient, or maybe never. I don't fucking care." });
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
    if (!currentQuestion.trim()) return; 
    handleNewMessageSubmit(currentQuestion);
  };

  return (
    <div className="flex flex-col flex-grow w-full overflow-hidden bg-background text-foreground">
      <AiCharacterDisplay status={aiStatus} isUserTyping={isUserTyping} /> 
      
      <div className="flex-grow flex flex-col overflow-hidden pt-16"> {/* pt-16 for AppHeader height */}
        
        {/* Token Contract Address Section */}
        <div className="py-3 px-4 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-card/80 p-3 rounded-lg shadow-xl border-2 border-primary/40 max-w-lg w-full backdrop-blur-sm">
            <Image
              src="https://picsum.photos/32/32" 
              alt="Memecoin Token Icon"
              width={32}
              height={32}
              className="rounded-full border border-primary/50"
              data-ai-hint="crypto token"
            />
            <span className="text-xs sm:text-sm text-foreground/90 truncate font-mono flex-grow" title={CONTRACT_ADDRESS}>
              {CONTRACT_ADDRESS}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAddress}
              className="text-primary hover:text-accent focus:ring-accent w-8 h-8 sm:w-9 sm:h-9"
              aria-label="Copy contract address"
            >
              <Copy className="h-4 w-4 sm:h-5 sm:h-5" />
            </Button>
          </div>
        </div>
        
        <div 
          id="chat-area-wrapper" 
          className="relative z-20 flex-grow flex flex-col max-w-2xl w-full mx-auto overflow-hidden border-2 border-primary rounded-lg shadow-xl my-4"
        >
          <ScrollArea className="flex-grow p-4 space-y-2 bg-card/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center pt-10">
                 {/* Empty div, placeholder text removed */}
              </div>
            ) : (
              messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-3 border-t border-primary/50 bg-card/80 backdrop-blur-sm">
            <form onSubmit={handleSubmitForm} className="relative">
              <Textarea
                ref={textareaRef}
                value={currentQuestion}
                onChange={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Ask your dumb questions, genius."
                className="pr-12 min-h-[50px] text-base bg-input/70 text-input-foreground 
                           border-2 border-primary/30 
                           focus:border-accent focus:shadow-fantasy-glow-accent focus:ring-0
                           rounded-lg shadow-inner resize-none chat-textarea" 
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
                    'text-link-style font-heading',
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
                    className="text-link-style-stop font-heading"
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
      </div>
    </div>
  );
}
