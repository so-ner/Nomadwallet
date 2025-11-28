'use client';

import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '5rem',
        left: '50%',
        transform: `translateX(-50%) ${isVisible ? 'translateY(0)' : 'translateY(30px)'}`,
        maxWidth: '600px',
        width: 'calc(100% - 4rem)',
        padding: '0 2rem',
        boxSizing: 'border-box',
        zIndex: 10000,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderRadius: '12px',
          backgroundColor: '#091E41', // Primary-900
          color: '#FFFFFF',
          fontSize: '16px', // body-3: 16px
          lineHeight: '24px', // body-3: 24px
          fontWeight: 600, // body-3: 600
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {message}
      </div>
    </div>
  );
}

