'use client';

import React from 'react';
import Image from 'next/image';

interface NavigationProps {
  icon: string;
  text: string;
  isOn: boolean;
  onClick?: () => void;
}

export default function Navigation({
  icon,
  text,
  isOn,
  onClick,
}: NavigationProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '5.6rem',
        height: '5.6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: onClick ? 'pointer' : 'default',
        opacity: isOn ? 1 : 0.3,
      }}
    >
      <Image
        src={icon}
        alt={text}
        width={28}
        height={28}
        style={{ width: '28px', height: '28px' }}
      />
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          lineHeight: '16px',
          letterSpacing: '-0.25px',
          color: '#326789', // Button/button-primary
          fontFamily: 'Pretendard',
        }}
      >
        {text}
      </span>
    </button>
  );
}

