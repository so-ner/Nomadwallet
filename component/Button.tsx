'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'hover' | 'pressed' | 'disabled' | 'line';
  children: React.ReactNode;
}

export default function Button({
  variant = 'default',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // disabled prop이 있으면 variant를 disabled로 강제
  const finalVariant = disabled ? 'disabled' : variant;

  // line variant는 hover/pressed 상태 처리 필요
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  // 각 variant에 맞는 테일윈드 클래스 반환
  const getVariantClasses = () => {
    // Subhead2: 16px, Bold, 22px line-height
    const baseClasses = 'w-full h-[5.6rem] rounded-lg flex items-center justify-center text-[16px] leading-[22px] font-bold transition-colors';
    
    switch (finalVariant) {
      case 'default':
        if (isPressed) {
          return `${baseClasses} bg-button-pressed text-white`;
        }
        if (isHovered) {
          return `${baseClasses} bg-button-hover text-white`;
        }
        return `${baseClasses} bg-button-primary text-white hover:bg-button-hover active:bg-button-pressed`;
      
      case 'hover':
        return `${baseClasses} bg-button-hover text-white`;
      
      case 'pressed':
        return `${baseClasses} bg-button-pressed text-white`;
      
      case 'disabled':
        return `${baseClasses} bg-button-disabled text-white cursor-not-allowed`;
      
      case 'line':
        if (isPressed) {
          return `${baseClasses} bg-button-pressed text-white border border-button-pressed`;
        }
        if (isHovered) {
          return `${baseClasses} bg-button-primary text-white border border-button-primary`;
        }
        return `${baseClasses} bg-transparent border border-button-primary text-button-primary hover:bg-button-primary hover:text-white active:bg-button-pressed active:text-white`;
      
      default:
        return `${baseClasses} bg-button-primary text-white`;
    }
  };

  return (
    <button
      className={`${getVariantClasses()} ${className}`}
      disabled={disabled || finalVariant === 'disabled'}
      onMouseEnter={(e) => {
        if (finalVariant === 'default' || finalVariant === 'line') {
          setIsHovered(true);
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        setIsPressed(false);
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (finalVariant === 'default' || finalVariant === 'line') {
          setIsPressed(true);
        }
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setIsPressed(false);
        props.onMouseUp?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

