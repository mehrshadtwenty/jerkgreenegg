export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  imageUrl?: string;
  isLoading?: boolean;
  timestamp: Date;
  status?: AiStatus; // Optional: to show different lamp states for this message
}

export interface GalleryImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

export type AiStatus = 
  | 'idle' 
  | 'thinking_text' 
  | 'thinking_image' 
  | 'presenting_text' 
  | 'presenting_image'
  | 'error';

    