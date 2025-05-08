'use client';

import { useState, useEffect } from 'react';
import type { ChatMessage, AiStatus, GalleryImage } from '@/lib/types';
import { ChatInterface } from '@/components/chat/chat-interface';
import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { generateImageFromQuestion } from '@/ai/flows/generate-image-from-question';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_GALLERY_KEY = 'tellMeIfAiGallery';

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [isLoading, setIsLoading] = useState(false); // Global loading state for input disabling
  const [isUserTyping, setIsUserTyping] = useState(false);
  const { toast } = useToast();

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
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    const aiPlaceholderMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      isLoadingText: true,
      originalQuestion: question, // Store the question that prompted this AI response
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);
    setAiStatus('thinking_text');

    try {
      const textResult = await answerUserQuestion({ question });
      const aiTextResponse = textResult.answer;
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholderMessage.id ? { 
          ...msg, 
          text: aiTextResponse, 
          isLoadingText: false,
          timestamp: new Date() 
        } : msg
      ));
      setAiStatus('presenting_text');
    } catch (error) {
      console.error("Error getting text answer:", error);
      setAiStatus('error');
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholderMessage.id ? { 
          ...msg, 
          text: "My magic fizzled out! Please try asking again.", 
          isLoadingText: false, 
          timestamp: new Date()
        } : msg
      ));
      toast({
        title: "AI Text Error",
        description: "Failed to get text response from AI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (aiStatus !== 'error') {
        setTimeout(() => setAiStatus('idle'), 1500); // Give time for presenting_text animation
      }
    }
  };

  const handleGenerateImageForLastResponse = async () => {
    // Find the last fully loaded AI text message
    const lastAiMessage = [...messages].reverse().find(
      m => m.role === 'assistant' && m.text && !m.isLoadingText && !m.isLoadingImage
    );

    if (!lastAiMessage || !lastAiMessage.originalQuestion) {
      toast({ 
        title: "Nothing to Imagine", 
        description: "There's no previous AI response to generate an image for, or the original question is missing.",
        variant: "default" 
      });
      return;
    }

    setIsLoading(true); // Disable chat input
    setAiStatus('thinking_image');

    setMessages(prev => prev.map(msg =>
      msg.id === lastAiMessage.id ? { ...msg, isLoadingImage: true } : msg
    ));

    try {
      const imageResult = await generateImageFromQuestion({ question: lastAiMessage.originalQuestion });
      const aiImageResponseUrl = imageResult.imageUrl;

      if (aiImageResponseUrl) {
        saveToGallery({
          id: uuidv4(),
          prompt: lastAiMessage.originalQuestion,
          imageUrl: aiImageResponseUrl,
          timestamp: new Date(),
        });
      }

      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { ...msg, imageUrl: aiImageResponseUrl, isLoadingImage: false } : msg
      ));
      setAiStatus('presenting_image');

    } catch (imageError) {
      console.error("Error generating image for existing message:", imageError);
      setAiStatus('error');
      setMessages(prev => prev.map(msg =>
        msg.id === lastAiMessage.id ? { 
          ...msg, 
          isLoadingImage: false, 
          // Optionally add a note about image failure to the message text
          // text: (msg.text || "") + "\n\n(But I couldn't conjure an image for that.)" 
        } : msg
      ));
      toast({
        title: "AI Image Error",
        description: "Failed to generate image for the response.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
       if (aiStatus !== 'error') {
        setTimeout(() => setAiStatus('idle'), 1500); // Give time for presenting_image animation
      }
    }
  };

  return (
    <ChatInterface
      messages={messages}
      aiStatus={aiStatus}
      isLoading={isLoading}
      isUserTyping={isUserTyping}
      onSetIsUserTyping={setIsUserTyping}
      onNewMessage={handleNewMessage}
      onGenerateImageRequest={handleGenerateImageForLastResponse} // Pass the new handler
    />
  );
}
