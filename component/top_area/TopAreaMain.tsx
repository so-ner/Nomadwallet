'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TopAreaMainProps {
  title?: string;
  notificationUrl?: string;
  hasNotification?: boolean;
}

export default function TopAreaMain({
  title,
  notificationUrl = '/notification',
  hasNotification = false,
}: TopAreaMainProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 2rem',
      }}
    >
      {/* 왼쪽 텍스트 */}
      {title && (
        <h1 style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 700 }}>
          {title}
        </h1>
      )}

      {/* 오른쪽 알림 버튼 */}
      <Link
        href={notificationUrl}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          textDecoration: 'none',
          position: 'relative',
          width: '42px',
          height: '42px',
        }}
      >
        <Image
          src="/icons/icon-alarm.svg"
          alt="알림"
          width={42}
          height={42}
          style={{ width: '42px', height: '42px' }}
        />
        {hasNotification && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#EB4F49',
            }}
          />
        )}
      </Link>
    </div>
  );
}

