'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ScrollablePickerProps<T> {
  items: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  formatItem: (item: T) => string; // 항목을 문자열로 변환하는 함수
  isOpen?: boolean; // 바텀시트가 열릴 때 초기 스크롤을 위한 prop
}

const SELECTED_HEIGHT = 38; // 선택된 항목 높이
const NEAR_HEIGHT = 22; // 한 단계 낮은 항목 높이
const FAR_HEIGHT = 17; // 두 단계 낮은 항목 높이
const CONTAINER_HEIGHT = 200; // 스크롤 컨테이너 고정 높이
const VISIBLE_ITEMS = 5; // 한 번에 보여지는 항목 수 (가운데 1개 + 위아래 각 2개)

export default function ScrollablePicker<T>({
  items,
  selectedValue,
  onSelect,
  formatItem,
  isOpen = false,
}: ScrollablePickerProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tempSelectedValue, setTempSelectedValue] = useState<T>(selectedValue);

  // 선택된 인덱스 찾기
  const selectedIndex = items.findIndex((item) => item === selectedValue);

  // 바텀시트가 열릴 때 선택된 항목으로 스크롤
  useEffect(() => {
    if (isOpen && scrollContainerRef.current && selectedIndex !== -1) {
      setTempSelectedValue(selectedValue);
      setTimeout(() => {
        scrollToIndex(selectedIndex);
      }, 100);
    }
  }, [isOpen, selectedValue, selectedIndex]);

  // selectedValue가 외부에서 변경되면 업데이트
  useEffect(() => {
    setTempSelectedValue(selectedValue);
  }, [selectedValue]);

  // 특정 인덱스의 높이 계산 (거리 기반)
  const getItemHeight = (index: number, selectedIdx: number) => {
    const distance = Math.abs(index - selectedIdx);
    if (distance === 0) return SELECTED_HEIGHT;
    if (distance === 1) return NEAR_HEIGHT;
    if (distance === 2) return FAR_HEIGHT;
    return FAR_HEIGHT;
  };

  // 특정 인덱스까지의 누적 높이 계산
  const getCumulativeHeight = (targetIndex: number, selectedIdx: number) => {
    let totalHeight = 0;
    for (let i = 0; i < targetIndex; i++) {
      totalHeight += getItemHeight(i, selectedIdx);
      if (i < targetIndex - 1) totalHeight += 8; // gap-2 (8px)
    }
    return totalHeight;
  };

  // 특정 인덱스로 스크롤
  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || index === -1) return;
    const selectedIdx = index;
    const cumulativeHeight = getCumulativeHeight(index, selectedIdx);
    const selectedItemHeight = SELECTED_HEIGHT;
    const centerOffset = CONTAINER_HEIGHT / 2 - selectedItemHeight / 2;
    const scrollPosition = cumulativeHeight - centerOffset + selectedItemHeight;
    scrollContainerRef.current.scrollTop = scrollPosition;
  };

  // 거리 기반 스타일 클래스와 패딩 반환
  const getItemStyle = (currentIndex: number, selectedIdx: number) => {
    const distance = Math.abs(currentIndex - selectedIdx);
    
    if (distance === 0) {
      // 선택된 항목: subhead-1 / 20px / text-primary / line-height: 17px / height: 38px
      return {
        className: 'text-subhead-1 text-primary',
        style: { 
          lineHeight: '17px', 
          padding: '10.5px 8px', 
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    } else if (distance === 1) {
      // 한 단계 낮은 것: body-2 / 18px / opacity: 0.6 / line-height: 17px / height: 22px
      return {
        className: 'text-body-2 text-primary opacity-60',
        style: { 
          lineHeight: '17px', 
          padding: '2.5px 8px', 
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    } else if (distance === 2) {
      // 두 단계 낮은 것: body-5 / 14px / opacity: 0.3 / line-height: 17px / height: 17px
      return {
        className: 'text-body-5 text-primary opacity-30',
        style: { 
          lineHeight: '17px', 
          padding: '0px 8px', 
          height: '17px',
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
          padding: '0px 8px', 
          height: '17px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    }
  };

  // 스크롤 위치를 기반으로 가장 가까운 항목 찾기 (반복 계산)
  const findClosestIndex = (centerPosition: number, initialGuess?: number): number => {
    let guess = initialGuess ?? Math.floor((centerPosition - SELECTED_HEIGHT * 2) / (SELECTED_HEIGHT + 8));
    guess = Math.max(0, Math.min(guess, items.length - 1));
    
    // 반복적으로 정확한 인덱스 찾기
    for (let iteration = 0; iteration < 5; iteration++) {
      let cumulativeHeight = 0;
      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < items.length; i++) {
        const itemHeight = getItemHeight(i, guess);
        const itemCenter = cumulativeHeight + itemHeight / 2;
        const distance = Math.abs(itemCenter - centerPosition);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
        
        cumulativeHeight += itemHeight;
        if (i < items.length - 1) cumulativeHeight += 8; // gap
      }
      
      if (closestIndex === guess) {
        return closestIndex;
      }
      guess = closestIndex;
    }
    
    return guess;
  };

  // 스크롤하는 동안 실시간으로 값 업데이트
  const handleScroll = () => {
    if (isScrollingRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const centerPosition = scrollTop + CONTAINER_HEIGHT / 2;
    
    // 현재 선택된 인덱스를 초기 추정값으로 사용
    const currentSelectedIdx = items.findIndex((item) => item === tempSelectedValue);
    const closestIndex = findClosestIndex(centerPosition, currentSelectedIdx >= 0 ? currentSelectedIdx : undefined);
    
    const validIndex = Math.max(0, Math.min(closestIndex, items.length - 1));
    if (items[validIndex] !== tempSelectedValue) {
      setTempSelectedValue(items[validIndex]);
    }
  };

  // 스크롤 종료 시 스냅
  const handleScrollEnd = () => {
    if (!scrollContainerRef.current) return;

    // 기존 타이머 취소
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current);
    }

    // 스크롤이 끝난 후 스냅 (150ms 후)
    scrollEndTimeoutRef.current = setTimeout(() => {
      if (!scrollContainerRef.current || isScrollingRef.current) return;

      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;
      const centerPosition = scrollTop + CONTAINER_HEIGHT / 2;
      
      // 현재 선택된 인덱스를 초기 추정값으로 사용하여 가장 가까운 항목 찾기
      const currentSelectedIdx = items.findIndex((item) => item === tempSelectedValue);
      const validIndex = findClosestIndex(centerPosition, currentSelectedIdx >= 0 ? currentSelectedIdx : undefined);
      
      const selectedItem = items[validIndex];
      setTempSelectedValue(selectedItem);
      onSelect(selectedItem);
      
      // 선택된 항목을 가운데로 스크롤
      const targetCumulativeHeight = getCumulativeHeight(validIndex, validIndex);
      const selectedItemHeight = SELECTED_HEIGHT;
      const centerOffset = CONTAINER_HEIGHT / 2 - selectedItemHeight / 2;
      const targetScrollTop = targetCumulativeHeight - centerOffset + selectedItemHeight;

      // 현재 스크롤 위치와 목표 위치가 충분히 가까우면 스냅하지 않음
      if (Math.abs(scrollTop - targetScrollTop) < 5) {
        return;
      }

      isScrollingRef.current = true;
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 300);
    }, 150);
  };

  const currentSelectedIndex = useMemo(
    () => items.findIndex((item) => item === tempSelectedValue),
    [items, tempSelectedValue]
  );

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* 선택 영역 표시 - 선택된 항목 높이에 맞춰 표시 */}
      <div 
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-b border-grayscale-300 bg-transparent pointer-events-none z-[1]"
        style={{ height: `${SELECTED_HEIGHT}px` }}
      />
      
      <div
        ref={scrollContainerRef}
        className="h-[200px] overflow-y-auto snap-y snap-mandatory [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-y"
        onScroll={() => {
          handleScroll();
          handleScrollEnd();
        }}
        onTouchEnd={handleScrollEnd}
      >
        <div style={{ height: `${SELECTED_HEIGHT * 2}px` }} />
        <ul className="list-none p-0 m-0 flex flex-col gap-2">
          {items.map((item, index) => {
            const itemStyle = getItemStyle(index, currentSelectedIndex);
            const itemHeight = getItemHeight(index, currentSelectedIndex);
            return (
              <li
                key={index}
                className="snap-center snap-always flex items-center"
                style={{ height: `${itemHeight}px`, minHeight: `${itemHeight}px` }}
              >
                <div className="w-full h-full flex items-center justify-center bg-transparent border-0 text-center">
                  <span className={itemStyle.className} style={itemStyle.style}>
                    {formatItem(item)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <div style={{ height: `${SELECTED_HEIGHT * 2}px` }} />
      </div>
    </div>
  );
}

