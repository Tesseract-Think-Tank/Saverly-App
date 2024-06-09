import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the message interface
interface IMessage {
  id: number;
  text: string;
  type: 'incoming' | 'outgoing';
}

// Define the context interface
interface IMessageContext {
  messages: IMessage[];
  sendMessage: (text: string) => void;
}

// Provide default context values
const defaultMessageContext: IMessageContext = {
  messages: [],
  sendMessage: () => {},
};

// Create the message context
const MessageContext = createContext<IMessageContext>(defaultMessageContext);

// Custom hook to use the MessageContext
export const useMessages = () => useContext(MessageContext);

// Define the provider's props interface
interface IMessageProviderProps {
  children: ReactNode;
}

// MessageProvider component to manage the state of messages
export const MessageProvider: React.FC<IMessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  // Function to send a message and update the state
  const sendMessage = (text: string): void => {
    const newMessage: IMessage = {
      id: Date.now(),
      text,
      type: 'outgoing',
    };
    setMessages(currentMessages => [...currentMessages, newMessage]);
  };

  return (
    <MessageContext.Provider value={{ messages, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};