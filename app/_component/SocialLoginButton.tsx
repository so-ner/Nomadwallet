'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

type SocialProvider = 'kakao' | 'naver' | 'google';

interface SocialLoginButtonProps {
  provider: SocialProvider;
}

const providerConfig: Record<SocialProvider, { icon: string; alt: string }> = {
  kakao: { icon: '/icons/kakao.svg', alt: '카카오 로그인' },
  naver: { icon: '/icons/naver.svg', alt: '네이버 로그인' },
  google: { icon: '/icons/google.svg', alt: '구글 로그인' },
};

export default function SocialLoginButton({ provider }: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  return (
    <button
      type="button"
      className="w-[5.8rem] h-[5.8rem] border-none flex items-center justify-center cursor-pointer"
      onClick={() => signIn(provider)}
    >
      <Image src={config.icon} alt={config.alt} width={58} height={58} priority />
    </button>
  );
}

