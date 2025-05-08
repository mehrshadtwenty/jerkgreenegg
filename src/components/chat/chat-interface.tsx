'use client';

import type { ChatMessage, AiStatus } from '@/lib/types';
import { MagicLampDisplay } from './magic-lamp-display';
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
    // Ensure this container allows flex-grow for MessageList if needed
    // The overall page structure in layout.tsx (MainLayout) uses flex-grow for main content area
    // This component itself can be a flex column.
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <MagicLampDisplay status={aiStatus} isUserTyping={isUserTyping} />
      
      {/* ChatInput is now centrally below the lamp */}
      <ChatInput 
        onSubmit={onNewMessage} 
        isLoading={isLoading}
        onUserTypingChange={onSetIsUserTyping} 
      />

      {/* MessageList will take remaining space and scroll */}
      <div className="flex-grow overflow-y-auto mt-4 mb-4"> {/* Added mt-4 for spacing */}
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
