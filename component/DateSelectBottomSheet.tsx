'use client';

import React, { useEffect, useRef } from 'react';
import Button from '@/component/Button';
import styles from './DateSelectBottomSheet.module.css';

type DateSelectMode = 'year' | 'year-month' | 'year-month-day';

interface DateSelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD 또는 YYYY-MM 또는 YYYY 형식
  onSelect: (date: string) => void;
  title: string;
  mode?: DateSelectMode; // 기본값: 'year-month-day'
}

const ITEM_HEIGHT = 56; // 각 항목의 높이
const CONTAINER_HEIGHT = 200; // 스크롤 컨테이너 고정 높이
const VISIBLE_ITEMS = 5; // 한 번에 보여지는 항목 수 (가운데 1개 + 위아래 각 2개)

export default function DateSelectBottomSheet({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
  title,
  mode = 'year-month-day',
}: DateSelectBottomSheetProps) {
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef({ year: false, month: false, day: false });
  const scrollEndTimeoutRef = useRef<{ year: NodeJS.Timeout | null; month: NodeJS.Timeout | null; day: NodeJS.Timeout | null }>({
    year: null,
    month: null,
    day: null,
  });
  const prevIsOpenRef = useRef(false);

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
  // TODO: 깜박거리는 이슈 해결 필요 - 바텀시트가 열릴 때 선택된 날짜로 스크롤할 때 깜박거림이 발생함
  useEffect(() => {
    // isOpen이 false에서 true로 변경될 때만 실행 (깜박거림 방지)
    if (isOpen && !prevIsOpenRef.current) {
      setTempYear(selectedYear);
      setTempMonth(selectedMonth);
      setTempDay(selectedDay);

      // 스크롤은 한 번만 실행되도록 isOpen이 true가 될 때만 실행
      const timeoutId = setTimeout(() => {
        const paddingItems = (VISIBLE_ITEMS - 1) / 2;
        scrollToIndex(yearScrollRef.current, years.indexOf(selectedYear));
        if (mode === 'year-month' || mode === 'year-month-day') {
          scrollToIndex(monthScrollRef.current, months.indexOf(selectedMonth));
        }
        if (mode === 'year-month-day') {
          const currentDays = new Date(selectedYear, selectedMonth, 0).getDate();
          const dayArray = Array.from({ length: currentDays }, (_, i) => i + 1);
          scrollToIndex(dayScrollRef.current, dayArray.indexOf(selectedDay));
        }
      }, 100);

      prevIsOpenRef.current = isOpen;
      return () => clearTimeout(timeoutId);
    } else if (!isOpen) {
      prevIsOpenRef.current = false;
    }
  }, [isOpen, selectedYear, selectedMonth, selectedDay, mode]);

  // 특정 인덱스로 스크롤
  const scrollToIndex = (container: HTMLDivElement | null, index: number) => {
    if (!container || index === -1) return;
    const centerOffset = CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2;
    const paddingItems = (VISIBLE_ITEMS - 1) / 2; // 위아래 각 2개씩
    const scrollPosition = index * ITEM_HEIGHT - centerOffset + ITEM_HEIGHT * paddingItems;
    container.scrollTop = scrollPosition;
  };

  // 거리 기반 스타일 클래스와 패딩 반환
  const getItemStyle = (currentIndex: number, selectedIndex: number) => {
    const distance = Math.abs(currentIndex - selectedIndex);
    const ITEM_HEIGHT_PX = 56; // 모든 항목의 고정 높이
    
    if (distance === 0) {
      // 선택된 항목: subhead-1 / 20px / text-primary / line-height: 17px / 상하 8px
      return {
        className: 'text-subhead-1 text-primary',
        style: { 
          lineHeight: '17px', 
          padding: '8px 8px', 
          height: `${ITEM_HEIGHT_PX}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    } else if (distance === 1) {
      // 한 단계 낮은 것: body-2 / 18px / opacity: 0.6 / line-height: 17px / 상하 7px
      return {
        className: 'text-body-2 text-primary opacity-60',
        style: { 
          lineHeight: '17px', 
          padding: '7px 8px', 
          height: `${ITEM_HEIGHT_PX}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    } else if (distance === 2) {
      // 두 단계 낮은 것: body-5 / 14px / opacity: 0.3 / line-height: 17px / 상하 3px
      return {
        className: 'text-body-5 text-primary opacity-30',
        style: { 
          lineHeight: '17px', 
          padding: '3px 8px', 
          height: `${ITEM_HEIGHT_PX}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    } else {
      // 더 먼 항목은 숨김 (5개만 보이도록)
      return {
        className: 'text-body-5 text-primary opacity-0',
        style: { 
          lineHeight: '17px', 
          padding: '3px 8px', 
          height: `${ITEM_HEIGHT_PX}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    }
  };

  // 스크롤하는 동안 실시간으로 값 업데이트
  const handleScroll = (type: 'year' | 'month' | 'day') => {
    // 스냅 중이면 무시
    if (isScrollingRef.current[type]) return;

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
    const paddingItems = (VISIBLE_ITEMS - 1) / 2;
    const centerPosition = scrollTop + centerOffset;
    const selectedIndex = Math.round((centerPosition - ITEM_HEIGHT * paddingItems) / ITEM_HEIGHT);
    const validIndex = Math.max(0, Math.min(selectedIndex, containers[type].length - 1));
    
    // 값만 업데이트 (스냅하지 않음)
    setters[type](containers[type][validIndex]);
  };

  // 스크롤 종료 시 스냅
  const handleScrollEnd = (type: 'year' | 'month' | 'day') => {
    // 기존 타이머 취소
    if (scrollEndTimeoutRef.current[type]) {
      clearTimeout(scrollEndTimeoutRef.current[type]!);
    }

    // 스크롤이 끝난 후 스냅 (150ms 후)
    scrollEndTimeoutRef.current[type] = setTimeout(() => {
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
      
      const paddingItems = (VISIBLE_ITEMS - 1) / 2;
      const targetScrollTop = validIndex * ITEM_HEIGHT - centerOffset + ITEM_HEIGHT * paddingItems;

      isScrollingRef.current[type] = true;
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isScrollingRef.current[type] = false;
      }, 300);
    }, 150);
  };

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
        <div className={styles.content}>
          <div className={styles.title}>
            <h2 className="text-subhead-1 text-text-primary">{title}</h2>
          </div>

          <div className={styles.body}>
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
                    onScroll={() => {
                      handleScroll('year');
                      handleScrollEnd('year');
                    }}
                    onTouchEnd={() => handleScrollEnd('year')}
                  >
                    <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                    <ul className={styles.dateList}>
                      {years.map((year, index) => {
                        const selectedIndex = years.indexOf(tempYear);
                        const itemStyle = getItemStyle(index, selectedIndex);
                        return (
                          <li
                            key={year}
                            className={styles.dateItem}
                            style={{ height: itemStyle.style.height }}
                          >
                            <div className={styles.dateButton}>
                              <span className={itemStyle.className} style={itemStyle.style}>
                                {year}년
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                  </div>
                </div>

                {/* 월 컬럼 - year-month, year-month-day 모드에서만 표시 */}
                {(mode === 'year-month' || mode === 'year-month-day') && (
                  <div className={styles.column}>
                    <div
                      ref={monthScrollRef}
                      className={styles.scrollContainer}
                      onScroll={() => {
                        handleScroll('month');
                        handleScrollEnd('month');
                      }}
                      onTouchEnd={() => handleScrollEnd('month')}
                    >
                      <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                      <ul className={styles.dateList}>
                        {months.map((month, index) => {
                          const selectedIndex = months.indexOf(tempMonth);
                          const itemStyle = getItemStyle(index, selectedIndex);
                          return (
                            <li
                              key={month}
                              className={styles.dateItem}
                              style={{ height: itemStyle.style.height }}
                            >
                              <div className={styles.dateButton}>
                                <span className={itemStyle.className} style={itemStyle.style}>
                                  {month}월
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                    </div>
                  </div>
                )}

                {/* 일 컬럼 - year-month-day 모드에서만 표시 */}
                {mode === 'year-month-day' && (
                  <div className={styles.column}>
                    <div
                      ref={dayScrollRef}
                      className={styles.scrollContainer}
                      onScroll={() => {
                        handleScroll('day');
                        handleScrollEnd('day');
                      }}
                      onTouchEnd={() => handleScrollEnd('day')}
                    >
                      <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                      <ul className={styles.dateList}>
                        {tempDays.map((day, index) => {
                          const selectedIndex = tempDays.indexOf(tempDay);
                          const itemStyle = getItemStyle(index, selectedIndex);
                          return (
                            <li
                              key={day}
                              className={styles.dateItem}
                              style={{ height: itemStyle.style.height }}
                            >
                              <div className={styles.dateButton}>
                                <span className={itemStyle.className} style={itemStyle.style}>
                                  {day}일
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cta}>
              <Button
                type="button"
                onClick={handleConfirmSelect}
              >
                선택하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

