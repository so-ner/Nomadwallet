'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/component/Toast';

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showToast = useCallback((msg: string, duration: number = 3000) => {
    setMessage(msg);
    setIsVisible(true);
    
    setTimeout(() => {
      setIsVisible(false);
      // 애니메이션을 위해 약간의 딜레이 후 메시지 제거
      setTimeout(() => {
        setMessage('');
      }, 300);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} isVisible={isVisible} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

