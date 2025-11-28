'use client';

import { useState, useEffect } from 'react';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';
import ScrollablePicker from '@/component/BottomSheet/core/ScrollablePicker';

interface DateSelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  currentMonth: number; // 0-11
  onSelect: (year: number, month: number) => void; // month는 1-12
}

export default function DateSelectBottomSheet({
  isOpen,
  onClose,
  currentYear,
  currentMonth,
  onSelect,
}: DateSelectBottomSheetProps) {
  const currentDate = new Date();
  const currentYearValue = currentDate.getFullYear();
  
  // 년도 목록 생성 (현재 년도 기준 ±10년)
  const years = Array.from({ length: 21 }, (_, i) => currentYearValue - 10 + i);
  
  // 월 목록 생성 (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // 바텀시트가 열릴 때마다 현재 값으로 초기화
  const [selectedYear, setSelectedYear] = useState(() => currentYear);
  const [selectedMonth, setSelectedMonth] = useState(() => currentMonth + 1); // 1-12로 변환

  // 바텀시트가 열릴 때만 현재 값으로 즉시 초기화
  useEffect(() => {
    if (isOpen) {
      // 즉시 상태 업데이트
      setSelectedYear(currentYear);
      setSelectedMonth(currentMonth + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentYear, currentMonth]); // isOpen이 변경될 때와 currentYear/currentMonth가 변경될 때 초기화

  const handleSelect = () => {
    onSelect(selectedYear, selectedMonth);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-center px-5">
          <h2 className="text-subhead-1 text-text-primary">캘린더 날짜 선택</h2>
        </div>

        {/* Year and Month Pickers */}
        <div className="flex gap-8 px-5">
          {/* Year Picker */}
          <div className="flex-1">
            <ScrollablePicker
              items={years}
              selectedValue={selectedYear}
              onSelect={setSelectedYear}
              formatItem={(year) => `${year}년`}
              isOpen={isOpen}
            />
          </div>

          {/* Month Picker */}
          <div className="flex-1">
            <ScrollablePicker
              items={months}
              selectedValue={selectedMonth}
              onSelect={setSelectedMonth}
              formatItem={(month) => `${month}월`}
              isOpen={isOpen}
            />
          </div>
        </div>

        {/* Select Button */}
        <div className="px-5 pb-2">
          <button
            onClick={handleSelect}
            className="w-full py-3.5 bg-button-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-button-primary-hover"
          >
            선택하기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

