'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '@/component/ConfirmModal';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const showConfirm = useCallback((newOptions: ConfirmOptions) => {
    setOptions(newOptions);
    setIsVisible(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (options?.onConfirm) {
      options.onConfirm();
    }
    setIsVisible(false);
    // 애니메이션을 위해 약간의 딜레이 후 옵션 제거
    setTimeout(() => {
      setOptions(null);
    }, 300);
  }, [options]);

  const handleCancel = useCallback(() => {
    if (options?.onCancel) {
      options.onCancel();
    }
    setIsVisible(false);
    // 애니메이션을 위해 약간의 딜레이 후 옵션 제거
    setTimeout(() => {
      setOptions(null);
    }, 300);
  }, [options]);

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {options && (
        <ConfirmModal
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          isVisible={isVisible}
          onConfirm={handleConfirm}
          onCancel={options.onCancel ? handleCancel : handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
}

