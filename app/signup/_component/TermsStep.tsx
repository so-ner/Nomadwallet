'use client';

import Button from '@/component/Button';
import CheckIcon from './CheckIcon';
import { TermItem } from '@/lib/api/terms';

interface TermsStepProps {
  terms: TermItem[];
  termsLoading: boolean;
  termsAgreed: Record<number, boolean>;
  onToggleTerm: (id: number) => void;
  onToggleAll: () => void;
  onNext: () => void;
}

export default function TermsStep({ terms, termsLoading, termsAgreed, onToggleTerm, onToggleAll, onNext }: TermsStepProps) {
  const allTermsChecked = terms.length > 0 && terms.every((term) => termsAgreed[term.id]);
  const requiredTermsChecked = terms.filter((term) => term.isRequired).every((term) => termsAgreed[term.id]);

  return (
    <div className="flex flex-col min-h-screen pb-[calc(5rem+2.5rem)]">
      <div className="px-8 pt-8">
        <h1 className="text-[24px] font-bold text-[#111827] leading-[32px]">NomadWallet 서비스 이용약관을 확인해주세요</h1>
      </div>
      
      {/* 약관 동의 선택 영역 - 헤드라인 바로 아래 */}
      <div className="px-5">
        <div className="flex flex-col gap-0">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
            <button
              type="button"
              onClick={onToggleAll}
              className="flex items-center justify-between w-full px-5 py-4 border-b border-[#E5E7EB] text-left"
            >
              <div className="flex items-center">
                <CheckIcon checked={allTermsChecked} />
                <span className={`ml-3 text-[16px] font-semibold ${allTermsChecked ? 'text-[#0F2B4F]' : 'text-[#1F2933]'}`}>
                  모두 동의
                </span>
              </div>
            </button>
            <div className="px-5">
              {termsLoading ? (
                <p className="py-6 text-sm text-center text-[#6B7280]">약관을 불러오는 중...</p>
              ) : terms.length === 0 ? (
                <p className="py-6 text-sm text-center text-[#6B7280]">약관 정보가 없습니다.</p>
              ) : (
                terms.map((term) => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => onToggleTerm(term.id)}
                    className="flex items-center justify-between w-full py-4 border-b border-[#EEF1F5] text-left last:border-b-0"
                  >
                    <div className="flex items-center flex-1">
                      <CheckIcon checked={!!termsAgreed[term.id]} />
                      <div className="ml-3">
                        <p className={`text-[15px] font-semibold ${termsAgreed[term.id] ? 'text-[#0F2B4F]' : 'text-[#1F2933]'}`}>
                          [{term.isRequired ? '필수' : '선택'}] {term.title}
                        </p>
                        {term.summary && (
                          <p className="text-xs text-[#616161] mt-1">{term.summary}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[#CBD2D9] text-xl ml-3">›</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-grayscale-300 md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
        <Button
          type="button"
          variant={requiredTermsChecked ? 'default' : 'disabled'}
          disabled={!requiredTermsChecked}
          onClick={onNext}
          className="w-full"
        >
          다음
        </Button>
      </div>
    </div>
  );
}

