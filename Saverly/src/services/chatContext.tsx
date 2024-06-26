import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: number;
  text: string;
  type: 'incoming' | 'outgoing';
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, type?: 'incoming' | 'outgoing') => void;
  isLoading: boolean;
  toggleLoading: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: Date.now(), text: "Welcome to SaveBot Chat! How can we assist you today?", type: 'incoming' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const sendMessage = (text: string, type: 'incoming' | 'outgoing' = 'outgoing') => {
    const newMessage = {
      id: Date.now(),
      text: text,
      type: type,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Automatically set isLoading to false when an incoming message is sent
    if (type === 'incoming') {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLoading, toggleLoading }}>
      {children}
    </ChatContext.Provider>
  );
};