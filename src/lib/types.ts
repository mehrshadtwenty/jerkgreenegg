
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  imageUrl?: string;
  isLoadingText?: boolean; // For the initial text generation
  isLoadingImage?: boolean; // For subsequent image generation request for this message
  timestamp: Date;
  originalQuestion?: string; // For AI messages, the user question that prompted this
}

export type AiStatus = 
  | 'idle' 
  | 'thinking_text' 
  | 'thinking_image' 
  | 'presenting_text' 
  | 'presenting_image'
  | 'error'
  | 'user_typing'; // Added user_typing to AiStatus
    
