'use client';

import type { ChatMessage, AiStatus } from '@/lib/types';
import { AiCharacterDisplay } from './ai-character-display'; // Changed import
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  aiStatus: AiStatus;
  isLoading: boolean;
  isUserTyping: boolean;
  onSetIsUserTyping: (isTyping: boolean) => void;
  onNewMessage: (question: string, generateImage: boolean) => Promise<void>;
}

export function ChatInterface({
  messages,
  aiStatus,
  isLoading,
  isUserTyping,
  onSetIsUserTyping,
  onNewMessage,
}: ChatInterfaceProps) {
  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Changed MagicLampDisplay to AiCharacterDisplay */}
      <AiCharacterDisplay status={aiStatus} isUserTyping={isUserTyping} />
      
      <ChatInput 
        onSubmit={onNewMessage} 
        isLoading={isLoading}
        onUserTypingChange={onSetIsUserTyping} 
      />

      <div className="flex-grow overflow-y-auto mt-4 mb-4">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
