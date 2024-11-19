export type MessageType = 'success' | 'error' | 'info' | 'warning' | 'danger';

export interface Message {
  type: MessageType;
  content: string;
  options?: MessageOptions;
}

export interface MessageOptions {
  duration?: number; 
}

export interface MessageProps {
  message: Message;
  onClose: () => void;
}