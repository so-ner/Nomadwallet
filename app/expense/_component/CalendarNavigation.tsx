import Link from 'next/link';
import Image from 'next/image';

interface CalendarNavigationProps {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onDateClick: () => void;
}

export default function CalendarNavigation({
  monthLabel,
  onPrev,
  onNext,
  onDateClick,
}: CalendarNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      {/* 왼쪽: 년.월 영역 */}
      <div className="flex items-center gap-[0.6rem] p-[0.4rem]">
        <button 
          className="bg-transparent border-none cursor-pointer text-text-primary transition-colors hover:opacity-70 flex items-center justify-center" 
          onClick={onPrev} 
          aria-label="이전 달"
        >
          <Image 
            src="/icons/icon-arrow_down_fill_16.svg"
            alt="이전 달"
            width={16}
            height={16}
          />
        </button>
        <button
          onClick={onDateClick}
          className="text-headline-4 font-bold text-text-primary cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="날짜 선택"
        >
          {monthLabel}
        </button>
        <button 
          className="bg-transparent border-none cursor-pointer text-text-primary transition-colors hover:opacity-70 flex items-center justify-center" 
          onClick={onNext} 
          aria-label="다음 달"
        >
          <Image 
            src="/icons/icon-arrow_down_fill_16.svg"
            alt="다음 달"
            width={16}
            height={16}
            style={{ transform: 'rotate(180deg)' }}
          />
        </button>
      </div>
      
      {/* 오른쪽: 소비 리포트 버튼 */}
      <Link 
        href="/statistics" 
        className="py-[0.8rem] px-[1.4rem] gap-[0.8rem] rounded-[2rem] bg-[#D9F4F9] text-subhead-2 font-bold text-text-primary no-underline flex items-center whitespace-nowrap"
      >
        <Image 
          src="/icons/icon-graph-20.svg"
          alt="소비 리포트"
          width={20}
          height={20}
        />
        소비 리포트
      </Link>
    </div>
  );
}

