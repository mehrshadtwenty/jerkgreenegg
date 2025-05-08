'use client';

import type { ChatMessage, AiStatus } from '@/lib/types';
import { AiCharacterDisplay } from './ai-character-display';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  aiStatus: AiStatus;
  isLoading: boolean;
  isUserTyping: boolean;
  onSetIsUserTyping: (isTyping: boolean) => void;
  onNewMessage: (question: string) => Promise<void>; // Updated signature
  onGenerateImageRequest: () => void; // New prop
}

export function ChatInterface({
  messages,
  aiStatus,
  isLoading,
  isUserTyping,
  onSetIsUserTyping,
  onNewMessage,
  onGenerateImageRequest, // Destructure new prop
}: ChatInterfaceProps) {
  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <AiCharacterDisplay status={aiStatus} isUserTyping={isUserTyping} />
      
      <ChatInput 
        onSubmit={onNewMessage} 
        isLoading={isLoading}
        onUserTypingChange={onSetIsUserTyping} 
        onGenerateImageRequest={onGenerateImageRequest} // Pass down the new handler
      />

      <div className="flex-grow overflow-y-auto mt-4 mb-4">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
