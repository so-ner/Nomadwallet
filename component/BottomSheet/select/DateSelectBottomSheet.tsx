'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/component/Button';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';
import ScrollablePicker from '@/component/BottomSheet/core/ScrollablePicker';

type DateSelectMode = 'year' | 'year-month' | 'year-month-day';

interface DateSelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD 또는 YYYY-MM 또는 YYYY 형식
  onSelect: (date: string) => void;
  title: string;
  mode?: DateSelectMode; // 기본값: 'year-month-day'
}

export default function DateSelectBottomSheet({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
  title,
  mode = 'year-month-day',
}: DateSelectBottomSheetProps) {

  // 현재 년도 기준 ±20년 범위 계산
  const currentYear = new Date().getFullYear();
  const START_YEAR = currentYear - 20;
  const END_YEAR = currentYear + 20;

  // 선택된 날짜 파싱
  const parseDate = (dateStr: string) => {
    if (!dateStr) {
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
    }
    const parts = dateStr.split('-').map(Number);
    return {
      year: parts[0] || new Date().getFullYear(),
      month: parts[1] || (mode === 'year' ? 1 : new Date().getMonth() + 1),
      day: parts[2] || (mode === 'year-month' ? 1 : new Date().getDate()),
    };
  };

  const { year: selectedYear, month: selectedMonth, day: selectedDay } = parseDate(selectedDate);

  // 년도, 월, 일 배열 생성
  const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempDay, setTempDay] = useState(selectedDay);

  // tempYear, tempMonth가 변경되면 일 수 재계산
  const tempDays = useMemo(() => {
    const daysInMonth = new Date(tempYear, tempMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [tempYear, tempMonth]);

  // 일이 유효하지 않으면 조정 (예: 31일 -> 30일로 변경)
  useEffect(() => {
    if (tempDays.length > 0 && tempDay > tempDays.length) {
      setTempDay(tempDays.length);
    }
  }, [tempDays, tempDay]);

  // 바텀시트가 열릴 때 선택된 날짜로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempYear(selectedYear);
      setTempMonth(selectedMonth);
      setTempDay(selectedDay);
    }
  }, [isOpen, selectedYear, selectedMonth, selectedDay]);

  // 선택하기 버튼 클릭 시 날짜 선택
  const handleConfirmSelect = () => {
    let dateStr = '';
    if (mode === 'year') {
      dateStr = `${tempYear}`;
    } else if (mode === 'year-month') {
      dateStr = `${tempYear}-${String(tempMonth).padStart(2, '0')}`;
    } else {
      dateStr = `${tempYear}-${String(tempMonth).padStart(2, '0')}-${String(tempDay).padStart(2, '0')}`;
    }
    onSelect(dateStr);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        <div className="flex items-center justify-center mb-[2.4rem]">
          <h2 className="text-subhead-1 text-text-primary">{title}</h2>
        </div>

        <div className="relative h-[200px] overflow-hidden flex-shrink-0">
          {/* 년도, 월, 일 컬럼 */}
          <div className="flex h-[200px] relative">
            {/* 년도 컬럼 */}
            <ScrollablePicker
              items={years}
              selectedValue={tempYear}
              onSelect={(year) => setTempYear(year)}
              formatItem={(year) => `${year}년`}
              isOpen={isOpen}
            />

            {/* 월 컬럼 - year-month, year-month-day 모드에서만 표시 */}
            {(mode === 'year-month' || mode === 'year-month-day') && (
              <ScrollablePicker
                items={months}
                selectedValue={tempMonth}
                onSelect={(month) => {
                  setTempMonth(month);
                  // 월이 변경되면 일도 조정
                  const daysInNewMonth = new Date(tempYear, month, 0).getDate();
                  if (tempDay > daysInNewMonth) {
                    setTempDay(daysInNewMonth);
                  }
                }}
                formatItem={(month) => `${month}월`}
                isOpen={isOpen}
              />
            )}

            {/* 일 컬럼 - year-month-day 모드에서만 표시 */}
            {mode === 'year-month-day' && (
              <ScrollablePicker
                items={tempDays}
                selectedValue={tempDay}
                onSelect={(day) => setTempDay(day)}
                formatItem={(day) => `${day}일`}
                isOpen={isOpen}
              />
            )}
          </div>
        </div>

        <div className="mt-[2rem] p-[2rem] bg-white box-border">
          <Button
            type="button"
            onClick={handleConfirmSelect}
          >
            선택하기
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

