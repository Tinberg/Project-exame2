export type MessageType = 'success' | 'error' | 'info' | 'warning';

export interface MessageOptions {
  duration?: number; 
}

export interface Message {
  type: MessageType;
  content: string;
  options?: MessageOptions;
}