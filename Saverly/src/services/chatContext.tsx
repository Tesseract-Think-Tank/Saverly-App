import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: number;
  text: string;
  type: 'incoming' | 'outgoing';
}

interface ChatContextType {
  messages: Message[];
  // Updated to reflect the new sendMessage function signature
  sendMessage: (text: string, type?: 'incoming' | 'outgoing') => void;
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
    { id: 1, text: "Welcome to SaveBot Chat! How can we assist you today?", type: 'incoming' },
  ]);

  // Add a type parameter to the sendMessage function
  const sendMessage = (text: string, type: 'incoming' | 'outgoing' = 'outgoing') => {
    const newMessage = {
      id: messages.length + 1, // Assuming you have a way to generate unique IDs
      text: text,
      type: type,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  


  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
