'use client';

import SocialLoginButton from './SocialLoginButton';

export default function SocialLoginSection() {
  return (
    <div className="flex flex-col items-center max-w-[600px] w-full">
      <h3 className="text-body-3 text-black mt-[4.6rem]">
        간편 로그인
      </h3>
      <div className="flex items-center justify-center px-[6.8rem] py-[2.1rem] gap-[3.2rem]">
        <SocialLoginButton provider="kakao" />
        <SocialLoginButton provider="naver" />
        <SocialLoginButton provider="google" />
      </div>
    </div>
  );
}

