'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/component/Button';

interface CompleteContentProps {
  userName: string;
}

export default function CompleteContent({ userName }: CompleteContentProps) {
  const router = useRouter();

  const handleStart = () => {
    router.push('/expense');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <div className="w-full max-w-[600px] mx-auto flex flex-col gap-[4.8rem]">
        <div className="flex flex-col gap-[1.4rem] mt-[7.2rem]">
          <h1 className="text-headline-1 font-bold text-black text-center">
            환영합니다<br />
            {userName}님!
          </h1>
          <p className="text-body-4 font-medium text-grayscale-600 text-center">
            여행 경비부터 일상 지출까지,<br />
            Nomad Wallet으로 똑똑하게 관리해볼까요?
          </p>
        </div>

        {/* 환영 키비주얼 */}
        <div className="w-full flex items-center justify-center">
          <Image
            src="/welcome-kv.png"
            alt="환영 키비주얼"
            width={231}
            height={245}
            className="object-contain"
          />
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
        <Button type="button" variant="default" onClick={handleStart} className="w-full">
          시작하기
        </Button>
      </div>
    </div>
  );
}

