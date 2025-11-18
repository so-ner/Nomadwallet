'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface SocialLoginButtonsProps {
  className?: string;
}

export default function SocialLoginButtons({ className }: SocialLoginButtonsProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className || ''}`} style={{ maxWidth: '600px', width: '100%' }}>
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '24px',
          color: '#212121',
          marginTop: '4.6rem',
        }}
      >
        간편 로그인
      </h3>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 6.8rem',
          gap: '3.2rem',
        }}
      >
        {/* 카카오 */}
        <button
          type="button"
          style={{
            width: '5.8rem',
            height: '5.8rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => signIn('kakao')}
        >
          <Image src="/icons/kakao.svg" alt="카카오 로그인" width={58} height={58} priority />
        </button>

        {/* 네이버 */}
        <button
          type="button"
          style={{
            width: '5.8rem',
            height: '5.8rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => signIn('naver')}
        >
          <Image src="/icons/naver.svg" alt="네이버 로그인" width={58} height={58} priority />
        </button>

        {/* 구글 */}
        <button
          type="button"
          style={{
            width: '5.8rem',
            height: '5.8rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => signIn('google')}
        >
          <Image src="/icons/google.svg" alt="구글 로그인" width={58} height={58} priority />
        </button>
      </div>
    </div>
  );
}

