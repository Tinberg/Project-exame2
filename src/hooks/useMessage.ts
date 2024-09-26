import { useState, useEffect } from "react";
import { Message, MessageType } from "../types/message"; // Import the interface and type

export const useMessage = (
  initialMessage: string | null = null,
  timeout: number = 3000
) => {
  const [message, setMessage] = useState<Message | null>(null);
  const [visible, setVisible] = useState<boolean>(!!initialMessage);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [message, timeout]);

  const showMessage = (newMessage: string, type: MessageType = "success") => {
    setMessage({ text: newMessage, type });
    setVisible(true);
  };

  const hideMessage = () => {
    setVisible(false);
  };

  return { message, visible, showMessage, hideMessage };
};
