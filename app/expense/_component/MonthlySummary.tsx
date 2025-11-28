import Image from 'next/image';
import { nfmt } from './utils';

interface MonthlySummaryProps {
  expense: number;
  income: number;
}

export default function MonthlySummary({ expense, income }: MonthlySummaryProps) {
  return (
    <div className="px-[2.8rem] py-[1rem] rounded-[1.2rem] border border-grayscale-300 bg-status-input flex items-center justify-around gap-3">
      <div className="flex flex-col gap-[0.2rem]">
        <div className="text-subhead-2 font-bold text-text-primary flex items-center gap-[0.4rem]">
          <Image
            src="/icons/icon-minus1-20.svg"
            alt="지출"
            width={20}
            height={20}
          />
          월 지출
        </div>
        <div className="text-body-3 font-semibold text-text-primary">{nfmt(expense)}</div>
      </div>
      <div className="flex flex-col gap-[0.2rem]">
        <div className="text-subhead-2 font-bold text-text-primary flex items-center gap-[0.4rem]">
          <Image
            src="/icons/icon-plus1-20.svg"
            alt="수입"
            width={20}
            height={20}
          />
          월 수입
        </div>
        <div className="text-body-3 font-semibold text-text-primary">{nfmt(income)}</div>
      </div>
    </div>
  );
}

