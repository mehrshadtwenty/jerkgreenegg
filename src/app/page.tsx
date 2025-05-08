'use client';

import { useState, useEffect } from 'react';
import type { ChatMessage, AiStatus, GalleryImage } from '@/lib/types';
import { ChatInterface } from '@/components/chat/chat-interface';
import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { generateImageFromQuestion } from '@/ai/flows/generate-image-from-question';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

const LOCAL_STORAGE_GALLERY_KEY = 'tellMeIfAiGallery';

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false); // New state for user typing
  const { toast } = useToast();

  // Load gallery from localStorage on mount
  useEffect(() => {
    // This effect runs only on the client after hydration
    // No need to specifically manage galleryImages state here for this page,
    // as it's primarily for the gallery page. We just save to localStorage.
  }, []);
  
  const saveToGallery = (newImage: GalleryImage) => {
    try {
      const currentGallery = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY) || '[]');
      currentGallery.unshift(newImage); // Add to the beginning
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(currentGallery.slice(0, 50))); // Keep last 50
    } catch (error) {
      console.error("Failed to save to gallery in localStorage:", error);
      toast({
        title: "Storage Error",
        description: "Could not save image to local gallery.",
        variant: "destructive",
      });
    }
  };


  const handleNewMessage = async (question: string, shouldGenerateImage: boolean) => {
    setIsLoading(true);
    setIsUserTyping(false); // Stop typing animation when message is sent
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
      isLoading: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    try {
      setAiStatus('thinking_text'); // Initial state for AI processing
      
      let aiTextResponse: string | undefined;
      let aiImageResponseUrl: string | undefined;

      // Get text answer
      try {
        const textResult = await answerUserQuestion({ question });
        aiTextResponse = textResult.answer;
        // Status will be updated based on whether an image is also being generated
      } catch (textError) {
        console.error("Error getting text answer:", textError);
        aiTextResponse = "I had a little trouble thinking of an answer for that. Please try again!";
        toast({
          title: "AI Text Error",
          description: "Failed to get text response.",
          variant: "destructive",
        });
      }
      
      // Update placeholder with text, keep loading if image is next
       setAiStatus(shouldGenerateImage ? 'thinking_image' : 'presenting_text');
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholderMessage.id ? { ...msg, text: aiTextResponse, isLoading: shouldGenerateImage } : msg
      ));

      if (shouldGenerateImage) {
        // setAiStatus('thinking_image'); // Already set or will be set
        try {
          const imageResult = await generateImageFromQuestion({ question });
          aiImageResponseUrl = imageResult.imageUrl;
          
          if (aiImageResponseUrl) {
            saveToGallery({
              id: uuidv4(),
              prompt: question,
              imageUrl: aiImageResponseUrl,
              timestamp: new Date(),
            });
          }
        } catch (imageError) {
          console.error("Error generating image:", imageError);
          toast({
            title: "AI Image Error",
            description: "Failed to generate image.",
            variant: "destructive",
          });
           // Update placeholder to show image error, text is already there
           setMessages(prev => prev.map(msg => 
            msg.id === aiPlaceholderMessage.id ? { ...msg, text: (msg.text || "") + "\n\n(But I couldn't conjure an image for that.)", imageUrl: undefined, isLoading: false } : msg
          ));
        }
        setAiStatus('presenting_image'); // Image (or failure) is ready
      }
      
      // Final update to AI message
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholderMessage.id ? { 
          ...msg, 
          text: aiTextResponse, 
          imageUrl: aiImageResponseUrl, 
          isLoading: false,
          timestamp: new Date() // Update timestamp to reflect completion
        } : msg
      ));

    } catch (error) {
      console.error("Error handling new message:", error);
      setAiStatus('error');
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholderMessage.id ? { 
          ...msg, 
          text: "My magic fizzled out! Please try asking again.", 
          isLoading: false, 
          timestamp: new Date()
        } : msg
      ));
      toast({
        title: "Something went wrong",
        description: "The AI encountered an unexpected problem.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (aiStatus !== 'error') { // Don't reset to idle if there was an error that set its own status
         setAiStatus('idle');
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
    />
  );
}
