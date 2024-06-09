import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IMessage {
  id: number;
  text: string;
  type: 'incoming' | 'outgoing';
}

interface IMessageContext {
  messages: IMessage[];
  sendMessage: (text: string) => void;
}

const defaultMessageContext: IMessageContext = {
  messages: [],
  sendMessage: () => {},
};

const MessageContext = createContext<IMessageContext>(defaultMessageContext);

export const useMessages = () => useContext(MessageContext);

interface IMessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<IMessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

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
