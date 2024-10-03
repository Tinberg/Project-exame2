
import { useState, useEffect } from 'react';
import { Message, MessageType, MessageOptions } from '../types/message';

export const useMessage = () => {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = (
    type: MessageType,
    content: string,
    options?: MessageOptions
  ) => {
    setMessage({ type, content, options });
  };

  useEffect(() => {
    if (message) {
      const duration = message.options?.duration ?? 5000; 
      const timer = setTimeout(() => {
        setMessage(null);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const clearMessage = () => {
    setMessage(null);
  };

  return { message, showMessage, clearMessage };
};
