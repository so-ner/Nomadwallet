'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const EVENT_KEYS = {
  ESCAPE: 'Escape',
} as const;

export default function BottomSheet({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      // 바텀시트가 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 바텀시트가 닫힐 때 body 스크롤 복원
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onKeyDown={(e) => {
        if (e.key === EVENT_KEYS.ESCAPE) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Backdrop - 600px 영역 내에서만 표시 */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-full bg-black/70 transition-opacity"
        onClick={handleBackdropClick}
        role="presentation"
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={`relative w-full max-w-[600px] h-fit bg-white rounded-t-[20px] max-h-[80vh] flex flex-col transform transition-transform duration-300 ease-out pt-[32px] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

