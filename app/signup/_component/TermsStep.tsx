'use client';

import { useState } from 'react';
import Button from '@/component/Button';
import CheckIcon from './CheckIcon';
import { TermItem } from '@/lib/api/terms';
import Image from 'next/image';
import TermsIframeView from '@/component/TermsIframeView';

interface TermsStepProps {
  terms: TermItem[];
  termsLoading: boolean;
  termsAgreed: Record<number, boolean>;
  onToggleTerm: (id: number) => void;
  onToggleAll: () => void;
  onNext: () => void;
}

export default function TermsStep({ terms, termsLoading, termsAgreed, onToggleTerm, onToggleAll, onNext }: TermsStepProps) {
  const [selectedTermUrl, setSelectedTermUrl] = useState<string | null>(null);
  const [selectedTermTitle, setSelectedTermTitle] = useState<string>('');
  
  const allTermsChecked = terms.length > 0 && terms.every((term) => termsAgreed[term.id]);
  const requiredTermsChecked = terms.filter((term) => term.isRequired).every((term) => termsAgreed[term.id]);

  const handleTermDetailClick = (term: TermItem) => {
    if (term.contentUrl) {
      setSelectedTermUrl(term.contentUrl);
      setSelectedTermTitle(term.title);
    }
  };

  const handleCloseModal = () => {
    setSelectedTermUrl(null);
    setSelectedTermTitle('');
  };

  return (
    <div className="flex flex-col min-h-screen pb-[calc(5rem+2rem)]">
      <div className="flex flex-col flex-1">
        <div className="px-5 pt-8 pb-6">
          <h1 className="text-headline-2 font-bold text-black">
            NomadWallet 서비스<br />
            이용약관을 확인해주세요
          </h1>
        </div>
        
        {/* 약관 동의 선택 영역 */}
        <div className="p-[2rem]">
          <div className="bg-white flex flex-col gap-[1.8rem]">
            {/* 모두 동의 영역 */}
            <div>
              <button
                type="button"
                onClick={onToggleAll}
                className="flex items-center w-full text-left"
              >
                <CheckIcon checked={allTermsChecked} />
                <span className="ml-3 text-headline-4 font-bold text-button-primary">
                  모두 동의
                </span>
              </button>
            </div>
            
            {/* 구분선 */}
            <div className="border-b border-[#D9D9D9]"></div>
            
            {/* 개별 약관 목록 */}
            <div className="flex flex-col gap-[2rem]">
            {termsLoading ? (
              <p className="py-6 text-sm text-center text-grayscale-600">약관을 불러오는 중...</p>
            ) : terms.length === 0 ? (
              <p className="py-6 text-sm text-center text-grayscale-600">약관 정보가 없습니다.</p>
            ) : (
              terms.map((term, index) => (
                <div
                  key={term.id}
                  className="flex items-center justify-between w-full"
                >
                  <button
                    type="button"
                    onClick={() => onToggleTerm(term.id)}
                    className="flex items-center flex-1 min-w-0 text-left"
                  >
                    <CheckIcon checked={!!termsAgreed[term.id]} />
                    <span className="ml-3 text-body-3 font-semibold text-black flex-1">
                      [{term.isRequired ? '필수' : '선택'}] {term.title}
                    </span>
                  </button>
                  {term.contentUrl && (
                    <button
                      type="button"
                      onClick={() => handleTermDetailClick(term)}
                      className="flex-shrink-0"
                    >
                      <Image
                        src="/icons/icon-arrow_right-24.svg"
                        alt="상세보기"
                        width={24}
                        height={24}
                      />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        </div>
      </div>
      
      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
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

      {/* 약관 상세 모달 */}
      {selectedTermUrl && (
        <TermsIframeView
          url={selectedTermUrl}
          title={selectedTermTitle}
          onBack={handleCloseModal}
          isModal={true}
        />
      )}
    </div>
  );
}

