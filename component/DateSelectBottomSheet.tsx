'use client';

import React, { useEffect, useRef } from 'react';
import Button from '@/component/Button';
import styles from './DateSelectBottomSheet.module.css';

interface DateSelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD 형식
  onSelect: (date: string) => void;
  title: string;
}

const ITEM_HEIGHT = 56; // 각 항목의 높이
const CONTAINER_HEIGHT = 200; // 스크롤 컨테이너 고정 높이
const START_YEAR = 2020;
const END_YEAR = 2100;

export default function DateSelectBottomSheet({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
  title,
}: DateSelectBottomSheetProps) {
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef({ year: false, month: false, day: false });

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
    const [year, month, day] = dateStr.split('-').map(Number);
    return { year, month, day };
  };

  const { year: selectedYear, month: selectedMonth, day: selectedDay } = parseDate(selectedDate);

  // 년도, 월, 일 배열 생성
  const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [tempYear, setTempYear] = React.useState(selectedYear);
  const [tempMonth, setTempMonth] = React.useState(selectedMonth);
  const [tempDay, setTempDay] = React.useState(selectedDay);

  // tempYear, tempMonth가 변경되면 일 수 재계산
  const tempDays = React.useMemo(() => {
    const daysInMonth = new Date(tempYear, tempMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [tempYear, tempMonth]);

  // 일이 유효하지 않으면 조정 (예: 31일 -> 30일로 변경)
  useEffect(() => {
    if (tempDays.length > 0 && tempDay > tempDays.length) {
      const newDay = tempDays.length;
      setTempDay(newDay);
      // 일이 변경되면 스크롤 위치도 업데이트
      setTimeout(() => {
        scrollToIndex(dayScrollRef.current, tempDays.indexOf(newDay));
      }, 100);
    }
  }, [tempDays]);

  // 바텀시트가 열릴 때 선택된 날짜로 스크롤
  useEffect(() => {
    if (isOpen) {
      setTempYear(selectedYear);
      setTempMonth(selectedMonth);
      setTempDay(selectedDay);

      setTimeout(() => {
        scrollToIndex(yearScrollRef.current, years.indexOf(selectedYear));
        scrollToIndex(monthScrollRef.current, months.indexOf(selectedMonth));
        const currentDays = new Date(selectedYear, selectedMonth, 0).getDate();
        const dayArray = Array.from({ length: currentDays }, (_, i) => i + 1);
        scrollToIndex(dayScrollRef.current, dayArray.indexOf(selectedDay));
      }, 100);
    }
  }, [isOpen, selectedYear, selectedMonth, selectedDay]);

  // 특정 인덱스로 스크롤
  const scrollToIndex = (container: HTMLDivElement | null, index: number) => {
    if (!container || index === -1) return;
    const centerOffset = CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2;
    const scrollPosition = index * ITEM_HEIGHT - centerOffset + ITEM_HEIGHT * 2.5;
    container.scrollTop = scrollPosition;
  };

  // 스크롤 종료 시 스냅
  const handleScrollEnd = (type: 'year' | 'month' | 'day') => {
    const refs = {
      year: yearScrollRef,
      month: monthScrollRef,
      day: dayScrollRef,
    };
    const containers = {
      year: years,
      month: months,
      day: tempDays,
    };
    const setters = {
      year: setTempYear,
      month: setTempMonth,
      day: setTempDay,
    };

    const container = refs[type].current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const centerOffset = CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2;
    const centerPosition = scrollTop + centerOffset;
    const selectedIndex = Math.round((centerPosition - ITEM_HEIGHT * 2.5) / ITEM_HEIGHT);
    const validIndex = Math.max(0, Math.min(selectedIndex, containers[type].length - 1));
    
    setters[type](containers[type][validIndex]);
    
    const targetScrollTop = validIndex * ITEM_HEIGHT - centerOffset + ITEM_HEIGHT * 2.5;

    isScrollingRef.current[type] = true;
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrollingRef.current[type] = false;
    }, 300);
  };

  // 선택하기 버튼 클릭 시 날짜 선택
  const handleConfirmSelect = () => {
    const dateStr = `${tempYear}-${String(tempMonth).padStart(2, '0')}-${String(tempDay).padStart(2, '0')}`;
    onSelect(dateStr);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className={`${styles.bottomSheet} ${isOpen ? styles.bottomSheetOpen : ''}`}>
        <div className={styles.bottomSheetHeader}>
          <div className={styles.bottomSheetDrag} />
        </div>

        <div className={styles.bottomSheetTitle}>
          <h2 className="text-subhead-1 text-text-primary">{title}</h2>
        </div>

        <div className={styles.pickerContainer}>
          {/* 선택 영역 표시 */}
          <div className={styles.selectionIndicator} />
          
          {/* 년도, 월, 일 컬럼 */}
          <div className={styles.dateColumns}>
            {/* 년도 컬럼 */}
            <div className={styles.column}>
              <div
                ref={yearScrollRef}
                className={styles.scrollContainer}
                onTouchEnd={() => handleScrollEnd('year')}
                onWheel={() => handleScrollEnd('year')}
              >
                <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
                <ul className={styles.dateList}>
                  {years.map((year, index) => {
                    const isSelected = year === tempYear;
                    return (
                      <li
                        key={year}
                        className={styles.dateItem}
                        style={{ height: `${ITEM_HEIGHT}px` }}
                      >
                        <div className={styles.dateButton}>
                          <span className={isSelected ? 'text-subhead-1 text-primary' : 'text-body-2 text-primary opacity-60'}>
                            {year}년
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
              </div>
            </div>

            {/* 월 컬럼 */}
            <div className={styles.column}>
              <div
                ref={monthScrollRef}
                className={styles.scrollContainer}
                onTouchEnd={() => handleScrollEnd('month')}
                onWheel={() => handleScrollEnd('month')}
              >
                <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
                <ul className={styles.dateList}>
                  {months.map((month, index) => {
                    const isSelected = month === tempMonth;
                    return (
                      <li
                        key={month}
                        className={styles.dateItem}
                        style={{ height: `${ITEM_HEIGHT}px` }}
                      >
                        <div className={styles.dateButton}>
                          <span className={isSelected ? 'text-subhead-1 text-primary' : 'text-body-2 text-primary opacity-60'}>
                            {month}월
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
              </div>
            </div>

            {/* 일 컬럼 */}
            <div className={styles.column}>
              <div
                ref={dayScrollRef}
                className={styles.scrollContainer}
                onTouchEnd={() => handleScrollEnd('day')}
                onWheel={() => handleScrollEnd('day')}
              >
                <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
                <ul className={styles.dateList}>
                  {tempDays.map((day, index) => {
                    const isSelected = day === tempDay;
                    return (
                      <li
                        key={day}
                        className={styles.dateItem}
                        style={{ height: `${ITEM_HEIGHT}px` }}
                      >
                        <div className={styles.dateButton}>
                          <span className={isSelected ? 'text-subhead-1 text-primary' : 'text-body-2 text-primary opacity-60'}>
                            {day}일
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomSheetFooter}>
          <Button
            type="button"
            onClick={handleConfirmSelect}
          >
            선택하기
          </Button>
        </div>
      </div>
    </>
  );
}

