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
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <MagicLampDisplay status={aiStatus} isUserTyping={isUserTyping} />
      <div className="flex-grow overflow-y-auto mb-4"> {/* MessageList is inside this div now */}
        <MessageList messages={messages} />
      </div>
      <ChatInput 
        onSubmit={onNewMessage} 
        isLoading={isLoading}
        onUserTypingChange={onSetIsUserTyping} 
      />
    </div>
  );
}
