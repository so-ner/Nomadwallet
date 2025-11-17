'use client';

import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  if (!isVisible || !message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '5rem',
        left: '2rem',
        right: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderRadius: '12px',
        backgroundColor: '#091E41', // Primary-900
        color: '#FFFFFF',
        fontSize: '16px', // body-3: 16px
        lineHeight: '24px', // body-3: 24px
        fontWeight: 600, // body-3: 600
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
      className="md:left-1/2 md:-translate-x-1/2"
    >
      {message}
    </div>
  );
}

