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

  // 각 variant에 맞는 스타일 반환
  const getButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '5.6rem',
      borderRadius: '0.8rem', // rounded-lg
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px', // subhead-2: 16px
      lineHeight: '22px', // subhead-2: 22px
      fontWeight: 700, // subhead-2: Bold
      transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxSizing: 'border-box',
    };

    switch (finalVariant) {
      case 'default':
        if (isPressed) {
          return { ...baseStyle, backgroundColor: '#35586E', color: '#FFFFFF' }; // button-pressed
        }
        if (isHovered) {
          return { ...baseStyle, backgroundColor: '#487290', color: '#FFFFFF' }; // button-hover
        }
        return { ...baseStyle, backgroundColor: '#406686', color: '#FFFFFF' }; // button-primary
      
      case 'hover':
        return { ...baseStyle, backgroundColor: '#487290', color: '#FFFFFF' }; // button-hover
      
      case 'pressed':
        return { ...baseStyle, backgroundColor: '#35586E', color: '#FFFFFF' }; // button-pressed
      
      case 'disabled':
        return { ...baseStyle, backgroundColor: '#B6C4CC', color: '#FFFFFF', cursor: 'not-allowed' }; // button-disabled
      
      case 'line':
        if (isPressed) {
          return { ...baseStyle, backgroundColor: '#35586E', color: '#FFFFFF', border: '1px solid #35586E' };
        }
        return { ...baseStyle, backgroundColor: 'transparent', color: '#406686', border: '1px solid #406686' }; // text-button-primary는 button-primary와 동일
      
      default:
        return { ...baseStyle, backgroundColor: '#406686', color: '#FFFFFF' };
    }
  };

  const { style: propsStyle, ...restProps } = props;
  const mergedStyle = { ...getButtonStyle(), ...propsStyle };

  return (
    <button
      style={mergedStyle}
      className={className}
      disabled={disabled || finalVariant === 'disabled'}
      onMouseEnter={(e) => {
        if (finalVariant === 'default' || finalVariant === 'line') {
          setIsHovered(true);
        }
        restProps.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        setIsPressed(false);
        restProps.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (finalVariant === 'default' || finalVariant === 'line') {
          setIsPressed(true);
        }
        restProps.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setIsPressed(false);
        restProps.onMouseUp?.(e);
      }}
      {...restProps}
    >
      {children}
    </button>
  );
}

