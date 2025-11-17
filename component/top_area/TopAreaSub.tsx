'use client';

import React from 'react';

interface TopAreaSubProps {
  leftIcon?: React.ReactNode;
  text?: string;
  rightElement?: React.ReactNode; // 아이콘 또는 텍스트
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

export default function TopAreaSub({
  leftIcon,
  text,
  rightElement,
  onLeftClick,
  onRightClick,
}: TopAreaSubProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* 왼쪽 아이콘 */}
      {leftIcon && (
        <button
          type="button"
          onClick={onLeftClick}
          style={{
            position: 'absolute',
            left: '2.1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '2.4rem',
            height: '2.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: onLeftClick ? 'pointer' : 'default',
            padding: 0,
            color: '#212121',
            fontSize: '24px',
          }}
        >
          {leftIcon}
        </button>
      )}

      {/* 가운데 텍스트 (항상 가운데 위치) */}
      {text && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '18px',
            lineHeight: '29px',
            fontWeight: 700,
            color: '#212121',
          }}
        >
          {text}
        </div>
      )}

      {/* 오른쪽 아이콘 또는 텍스트 */}
      {rightElement && (
        <button
          type="button"
          onClick={onRightClick}
          style={{
            position: 'absolute',
            right: '2.1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: typeof rightElement === 'string' ? 'auto' : '2.4rem',
            height: typeof rightElement === 'string' ? 'auto' : '2.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: onRightClick ? 'pointer' : 'default',
            padding: 0,
            color: '#212121',
            fontSize: typeof rightElement === 'string' ? '18px' : '24px',
          }}
        >
          {typeof rightElement === 'string' ? (
            <span style={{ fontSize: '18px', lineHeight: '29px', fontWeight: 700 }}>
              {rightElement}
            </span>
          ) : (
            rightElement
          )}
        </button>
      )}
    </div>
  );
}

