'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Travel } from '@/types/travel';
import { getTravels } from '@/lib/api/travel';
import dayjs from '@/lib/dayjs';

interface TravelSelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTravelId: number | null;
  onSelect: (travelId: number) => void;
  returnTo?: string; // 어디서 왔는지 (expense/new 등)
}

export default function TravelSelectBottomSheet({
  isOpen,
  onClose,
  selectedTravelId,
  onSelect,
  returnTo,
}: TravelSelectBottomSheetProps) {
  const router = useRouter();
  const [travels, setTravels] = useState<Travel[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadTravels();
    }
  }, [isOpen]);

  const loadTravels = async () => {
    try {
      const response = await getTravels();
      setTravels(response.travels || []);
    } catch (error) {
      console.error('예산 목록 조회 실패:', error);
    }
  };

  const handleTravelSelect = (travelId: number) => {
    onSelect(travelId);
    onClose();
  };

  const handleAddBudget = () => {
    const returnToParam = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
    router.push(`/budget/new${returnToParam}`);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('YYYY.MM.DD');
  };

  const formatAmount = (amount: number) => {
    return `+${amount.toLocaleString('ko-KR')}원`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-[100]"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] z-[101] max-h-[80vh] flex flex-col md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2 py-[32px]">
        {/* Content Container */}
        <div className="flex flex-col gap-[20px]">
          {/* Header */}
          <div className="flex items-center justify-between px-[20px]">
            <h2 className="text-subhead-1 text-text-primary">예산명 추가</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-grayscale-600 text-headline-5"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* Summary */}
          <div className="px-[20px]">
            <p className="text-body-4 font-medium text-grayscale-600">총 {travels.length}건</p>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-grayscale-300 px-[20px]" />

          {/* Travel List */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-[26px] px-[20px]">
              {/* Travel Items */}
              {travels.map((travel) => {
                const isSelected = travel.travel_id === selectedTravelId;
                return (
                  <button
                    key={travel.travel_id}
                    onClick={() => handleTravelSelect(travel.travel_id)}
                    className={`w-full flex items-center justify-between hover:bg-grayscale-50 transition-colors ${
                      isSelected ? 'bg-grayscale-50' : ''
                    }`}
                  >
                    {/* 왼쪽 영역: 타이틀과 날짜 */}
                    <div className="flex flex-col gap-[2px] items-start">
                      <p className="text-body-4 font-medium text-text-primary text-left">{travel.travel_title}</p>
                      <p className="text-body-5 font-medium text-grayscale-600 text-left">
                        {formatDate(travel.start_date)} - {formatDate(travel.end_date)}
                      </p>
                    </div>
                    {/* 오른쪽 영역: 금액 */}
                    <p className="text-body-4 font-medium text-text-primary">
                      {formatAmount(travel.total_budget)}
                    </p>
                  </button>
                );
              })}

              {/* 예산 추가 버튼 */}
              <button
                onClick={handleAddBudget}
                className="flex items-center gap-[8px] w-full"
              >
                <div className="w-[40px] h-[40px] rounded-full bg-status-input flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/icons/icon-plus2-20.svg"
                    alt="추가"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-body-4 font-medium text-text-primary">예산 추가</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

