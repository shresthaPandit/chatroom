"use client"
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  message: string;
  username: string;
  time: string;
}

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: { message: string; username: string }) => any;
  messages: Message[];
  status: string;
  clearMessages: () => void;
  typingUsers: string[];
  sendTyping: (username: string) => void;
  activeCount: number;
  toastMsg: string;
  setToastMsg: (msg: string) => void;
}

const SocketContext = React.createContext<ISocketContext | null>(null);
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is undefined");
  return state;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState('Connecting...');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeCount, setActiveCount] = useState(1);
  const [toastMsg, setToastMsg] = useState("");

  const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
    if (socket) {
      socket.emit("event:message", msg);
    }
  }, [socket]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendTyping = useCallback((username: string) => {
    if (socket) {
      socket.emit("typing", username);
    }
  }, [socket]);

  useEffect(() => {
    const _socket = io(SOCKET_URL);
    setSocket(_socket);

    _socket.on('connect', () => {
      setStatus('🟢 Connected');
      setToastMsg('Connected to chat!');
      _socket.emit('getActiveCount');
    });
    _socket.on('disconnect', () => {
      setStatus('🔴 Disconnected');
      setToastMsg('Disconnected from chat!');
    });
    _socket.on('message', (msg: string) => {
      const { message, username, time } = JSON.parse(msg);
      setMessages(prev => [...prev, { message, username, time }]);
    });
    _socket.on('typing', (username: string) => {
      setTypingUsers(prev => {
        if (!prev.includes(username)) return [...prev, username];
        return prev;
      });
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== username));
      }, 2000);
    });
    _socket.on('activeCount', (count: number) => {
      setActiveCount(count);
    });
    return () => {
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  // Toast notification helper
  function toast(msg: string, type: 'success' | 'error') {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.position = 'fixed';
    el.style.bottom = '32px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.background = type === 'success' ? '#007aff' : '#e74c3c';
    el.style.color = '#fff';
    el.style.padding = '10px 24px';
    el.style.borderRadius = '8px';
    el.style.fontWeight = 'bold';
    el.style.zIndex = '9999';
    el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
    document.body.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 2000);
  }

  return (
    <SocketContext.Provider value={{ sendMessage, messages, status, clearMessages, typingUsers, sendTyping, activeCount, toastMsg, setToastMsg }}>
      {children}
    </SocketContext.Provider>
  );
};

