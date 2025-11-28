'use client';

import { useRouter } from 'next/navigation';
import Button from '@/component/Button';

interface OnboardContentProps {
  userName: string;
}

export default function OnboardContent({ userName }: OnboardContentProps) {
  const router = useRouter();

  const handleStart = () => {
    router.push('/expense');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-5 py-8 bg-white">
      <div className="w-full max-w-[600px] flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 mt-12">
          <h1 className="text-[32px] font-bold text-[#111827]">
            환영합니다
          </h1>
          <h2 className="text-[32px] font-bold text-[#111827]">
            {userName}님!
          </h2>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-[16px] text-[#4B5563] leading-6">
            여행 경비부터 일상 지출까지,
          </p>
          <p className="text-[16px] text-[#4B5563] leading-6">
            Nomad Wallet으로 똑똑하게 관리해볼까요?
          </p>
        </div>

        <div className="w-full max-w-[400px] h-64 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mt-8">
          <span className="text-[16px] text-[#9CA3AF]">키비주얼</span>
        </div>

        <div className="w-full px-5 mt-12">
          <Button type="button" variant="default" onClick={handleStart}>
            시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}

