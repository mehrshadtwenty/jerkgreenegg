
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import type { ChatMessage, AiStatus } from '@/lib/types';
import { ChatMessageItem } from '@/components/chat/chat-message-item';
import { AiCharacterDisplay } from '@/components/chat/ai-character-display';
import { answerUserQuestion, AnswerUserQuestionInput } from '@/ai/flows/answer-user-question';
import { generateImageFromQuestion } from '@/ai/flows/generate-image-from-question';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, StopCircle, Copy } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CONTRACT_ADDRESS = "E76gue12NupYS5GwjRR7nyisEKAUpH6F1Pv9UmHMSziu";
const CHAT_STORAGE_KEY = 'jerkGreenEggChatMessages';
const MAX_HISTORY_MESSAGES_FOR_AI = 6; // Approx 3 user turns, 3 AI turns for AI context
const MAX_MESSAGES_FOR_LOCAL_STORAGE = 10; // Limit messages stored in localStorage

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load messages from localStorage on initial mount
  useEffect(() => {
    const storedMessagesRaw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (storedMessagesRaw) {
      try {
        const parsedMessages = JSON.parse(storedMessagesRaw) as ChatMessage[];
        // Convert string timestamps back to Date objects
        // Note: imageUrls are not stored, so they won't be loaded here.
        setMessages(
          parsedMessages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            imageUrl: undefined, // Explicitly ensure no imageUrl is loaded
          }))
        );
      } catch (error) {
        console.error("Failed to parse messages from localStorage", error);
        localStorage.removeItem(CHAT_STORAGE_KEY); // Clear corrupted data
      }
    }
    setHasLoadedFromStorage(true); // Indicate loading attempt is complete
  }, []);

  // Save messages to localStorage whenever they change, AFTER initial load attempt
  useEffect(() => {
    if (hasLoadedFromStorage) {
      const messagesToStore = messages
        .slice(-MAX_MESSAGES_FOR_LOCAL_STORAGE)
        .map(msg => {
          // Create a new object without the imageUrl to avoid storing large data URIs
          const { imageUrl, ...restOfMsg } = msg;
          return restOfMsg;
        });
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messagesToStore));
      } catch (error) {
        console.error("Error saving messages to localStorage:", error);
        // Check if it's a QuotaExceededError
        if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
            console.warn("LocalStorage quota exceeded even after removing image URLs. Clearing stored messages for JerkGreenEgg.");
            toast({
              title: "Storage Full, Captain Dipshit!",
              description: "My memory banks are overflowing with your genius. Couldn't save all your old chats. Tough luck.",
              variant: "destructive",
            });
            try {
              localStorage.removeItem(CHAT_STORAGE_KEY);
            } catch (clearError) {
              console.error("Failed to clear localStorage for JerkGreenEgg after quota error:", clearError);
            }
        }
      }
    }
  }, [messages, hasLoadedFromStorage, toast]);

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
    const updatedMessagesContext = [...messages, userMessage];
    setMessages(updatedMessagesContext);

    const aiPlaceholderMessageId = uuidv4();
    const aiPlaceholderMessage: ChatMessage = {
      id: aiPlaceholderMessageId,
      role: 'assistant',
      isLoadingText: true,
      originalQuestion: questionText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    const historyForAI = updatedMessagesContext
      .slice(-MAX_HISTORY_MESSAGES_FOR_AI -1)
      .filter(msg => msg.id !== aiPlaceholderMessageId && msg.text)
      .map(msg => ({
        role: msg.role,
        content: msg.text as string,
      }));

    const aiInput: AnswerUserQuestionInput = {
      question: questionText,
      conversationHistory: historyForAI.slice(0, -1),
    };


    let textResultError = null;
    try {
      const textResult = await answerUserQuestion(aiInput);
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
    <div className="flex flex-col h-full w-full bg-background text-foreground"> {/* Use h-full to fill parent main */}
      <AiCharacterDisplay status={aiStatus} isUserTyping={isUserTyping} />

      {/* This container handles content below the AI character display */}
      {/* It will grow and its children will be laid out vertically. Overflow is handled by parent <main> */}
      <div className="flex-grow flex flex-col overflow-hidden">

        {/* Token Contract Address Section */}
        <div className="py-3 px-4 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-card/80 p-3 rounded-lg shadow-xl border-2 border-primary/40 max-w-lg w-full backdrop-blur-sm">
            <Link href="https://pump.fun/coin/E76gue12NupYS5GwjRR7nyisEKAUpH6F1Pv9UmHMSziu" passHref legacyBehavior>
              <a target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading shadow-md hover:shadow-fantasy-glow-accent px-4"
                >
                  Ape In!
                </Button>
              </a>
            </Link>
            <span className="text-xs sm:text-sm text-foreground/90 truncate font-mono flex-grow" title={CONTRACT_ADDRESS}>
              {CONTRACT_ADDRESS}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAddress}
              className="text-primary w-8 h-8 sm:w-9 sm:h-9 shrink-0 icon-button-primary-hover"
              aria-label="Copy contract address"
            >
              <Copy className="h-4 w-4 sm:h-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area Wrapper: Takes remaining space and contains scrollable messages + input */}
        <div
          id="chat-area-wrapper"
          className="relative z-20 flex-grow flex flex-col max-w-2xl w-full mx-auto overflow-hidden border-2 border-primary rounded-lg shadow-xl my-4 min-h-0" // Added min-h-0
        >
          <ScrollArea className="flex-grow p-4 space-y-2 bg-card/50 min-h-0"> {/* min-h-0 is crucial */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center pt-10">
                 {/* Empty div, placeholder text removed */}
              </div>
            ) : (
              messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Form Area */}
          <div className="p-3 border-t border-primary/50 bg-card/80 backdrop-blur-sm">
            <form onSubmit={handleSubmitForm} className="relative">
              <Textarea
                ref={textareaRef}
                value={currentQuestion}
                onChange={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Ask your dumb questions, genius."
                className={cn(
                  "pr-12 min-h-[50px] text-base rounded-lg shadow-inner resize-none chat-textarea",
                  "bg-[linear-gradient(to_bottom,hsl(var(--amethyst-purple-hsl)/0.25)_0%,hsl(var(--pearl-white-hsl)/0.15)_100%)]",
                  "text-emerald-green-hsl placeholder:text-emerald-green-hsl/70",
                  "border-2 border-primary/30",
                  "focus:bg-[hsl(var(--input)/0.7)]",
                  "focus:border-accent focus:shadow-fantasy-glow-accent focus:ring-0"
                )}
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
