'use client';

import { useState, useEffect, useRef } from 'react';
import type { ChatMessage, AiStatus, GalleryImage } from '@/lib/types';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { AiCharacterDisplay } from '@/components/chat/ai-character-display';
import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { generateImageFromQuestion } from '@/ai/flows/generate-image-from-question';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_GALLERY_KEY = 'tellMeIfAiGallery';

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [isLoading, setIsLoading] = useState(false); 
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const { toast } = useToast();

  const [headerHeight, setHeaderHeight] = useState(0);
  const chatInputRef = useRef<HTMLDivElement>(null);
  const [inputAreaHeight, setInputAreaHeight] = useState(0);

  useEffect(() => {
    const headerElement = document.querySelector('header');
    if (headerElement) {
      setHeaderHeight(headerElement.offsetHeight);
    }
    if (chatInputRef.current) {
      setInputAreaHeight(chatInputRef.current.offsetHeight);
    }
    // Add resize listener if dynamic height changes are expected
    const handleResize = () => {
      if (headerElement) setHeaderHeight(headerElement.offsetHeight);
      if (chatInputRef.current) setInputAreaHeight(chatInputRef.current.offsetHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const saveToGallery = (newImage: GalleryImage) => {
    try {
      const currentGallery = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY) || '[]');
      currentGallery.unshift(newImage); 
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(currentGallery.slice(0, 50)));
    } catch (error) {
      console.error("Failed to save to gallery in localStorage:", error);
      toast({
        title: "Storage Error",
        description: "Could not save image to local gallery.",
        variant: "destructive",
      });
    }
  };

  const handleNewMessage = async (question: string) => {
    setIsLoading(true);
    setIsUserTyping(false);
    setAiStatus('thinking_text');

    const userMessage: ChatMessage = { id: uuidv4(), role: 'user', text: question, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    const aiPlaceholderMessageId = uuidv4();
    const aiPlaceholderMessage: ChatMessage = {
      id: aiPlaceholderMessageId,
      role: 'assistant',
      isLoadingText: true,
      originalQuestion: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    let textResultError = null;
    try {
      const textResult = await answerUserQuestion({ question });
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
          text: "My magic circuits are a bit tangled! Please try that again.", 
          isLoadingText: false, 
          timestamp: new Date()
        } : msg
      ));
      setAiStatus('error');
      toast({ title: "AI Text Error", description: "Failed to get text response.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      if (textResultError) {
        setTimeout(() => setAiStatus('idle'), 2500);
      } else {
         setTimeout(() => setAiStatus(prevStatus => prevStatus === 'error' ? 'error' : 'idle'), 1500);
      }
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

    setIsLoading(true);
    setIsImageGenerating(true);
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
      if (imageErrorOccurred) {
         setTimeout(() => setAiStatus('idle'), 2500);
      } else {
        setTimeout(() => setAiStatus(prevStatus => prevStatus === 'error' ? 'error' : 'idle'), 1500);
      }
    }
  };

  const handleStopImageGeneration = () => {
    setIsImageGenerating(false);
    setIsLoading(false);
    setAiStatus('idle'); 
    
    setMessages(prev => prev.map(msg => 
      msg.isLoadingImage ? { ...msg, isLoadingImage: false, text: (msg.text || "") + "\n\n(Hmm, I guess you didn't want to see that masterpiece after all!)" } : msg
    ));

    toast({ title: "Image Generation Halted", description: "Alright, alright, I'll stop conjuring... for now!" });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <AiCharacterDisplay status={aiStatus} isUserTyping={isUserTyping} />
      
      <div 
        className="flex-grow overflow-y-auto"
        style={{ paddingTop: `${headerHeight}px`, paddingBottom: `${inputAreaHeight}px`}}
      >
        <div className="max-w-3xl mx-auto h-full">
          <MessageList messages={messages} />
        </div>
      </div>

      <div ref={chatInputRef} className="fixed bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <ChatInput
              onSubmit={handleNewMessage}
              onGenerateImageRequest={handleGenerateImageForLastResponse}
              onStopImageGeneration={handleStopImageGeneration}
              isLoading={isLoading}
              isImageGenerating={isImageGenerating}
              onUserTypingChange={setIsUserTyping}
          />
        </div>
      </div>
    </div>
  );
}
