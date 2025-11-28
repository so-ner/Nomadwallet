'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ScrollablePickerProps<T> {
  items: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  formatItem: (item: T) => string; // 항목을 문자열로 변환하는 함수
  isOpen?: boolean; // 바텀시트가 열릴 때 초기 스크롤을 위한 prop
}

const ITEM_HEIGHT = 40; // 모든 항목의 고정 높이
const CONTAINER_HEIGHT = 200; // 스크롤 컨테이너 고정 높이
const TOP_PADDING = ITEM_HEIGHT * 2; // 상단 패딩 (가운데 정렬을 위해)

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
  const isInitialScrollRef = useRef(true); // 초기 스크롤인지 추적
  const hasUserScrolledRef = useRef(false); // 사용자가 스크롤했는지 추적
  const [tempSelectedValue, setTempSelectedValue] = useState<T>(selectedValue);

  // 선택된 인덱스 찾기
  const selectedIndex = items.findIndex((item) => item === selectedValue);

  // 바텀시트가 열릴 때만 선택된 항목으로 스크롤
  useEffect(() => {
    if (isOpen && scrollContainerRef.current && selectedIndex !== -1) {
      // 즉시 상태 업데이트
      setTempSelectedValue(selectedValue);
      isInitialScrollRef.current = true;
      hasUserScrolledRef.current = false;
      
      // 즉시 스크롤 (바텀시트가 열리는 동안 스크롤 시작)
      const immediateTimer = setTimeout(() => {
        if (scrollContainerRef.current && selectedIndex !== -1) {
          isScrollingRef.current = true;
          scrollToIndex(selectedIndex);
          // 초기 스크롤 완료 후 플래그 리셋
          setTimeout(() => {
            isScrollingRef.current = false;
            isInitialScrollRef.current = false;
          }, 200);
        }
      }, 50); // 300ms에서 50ms로 단축
      
      return () => clearTimeout(immediateTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedValue]); // isOpen과 selectedValue가 변경될 때 실행

  // selectedValue가 외부에서 변경되면 업데이트
  useEffect(() => {
    setTempSelectedValue(selectedValue);
  }, [selectedValue]);

  // 특정 인덱스로 스크롤
  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || index === -1) return;
    
    // 고정 높이 방식: 타겟 항목의 중심을 컨테이너 중심에 맞추기
    // 타겟 항목의 중심 위치 = TOP_PADDING + index * ITEM_HEIGHT + ITEM_HEIGHT / 2
    // 컨테이너 중심 위치 = scrollTop + CONTAINER_HEIGHT / 2
    // 따라서: scrollTop = 타겟 항목 중심 위치 - CONTAINER_HEIGHT / 2
    const targetItemCenter = TOP_PADDING + index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const scrollPosition = targetItemCenter - CONTAINER_HEIGHT / 2;
    
    scrollContainerRef.current.scrollTop = Math.max(0, scrollPosition);
  };

  // 항목 스타일 반환 (거리 기반으로 폰트 크기와 투명도만 변경)
  const getItemStyle = (currentIndex: number, selectedIdx: number) => {
    const distance = Math.abs(currentIndex - selectedIdx);
    
    if (distance === 0) {
      // 선택된 항목: 큰 폰트, 불투명
      return {
        className: 'text-subhead-1 text-primary',
      };
    } else if (distance === 1) {
      // 한 단계 낮은 것: 중간 폰트, 약간 투명
      return {
        className: 'text-body-2 text-primary opacity-60',
      };
    } else if (distance === 2) {
      // 두 단계 낮은 것: 작은 폰트, 더 투명
      return {
        className: 'text-body-5 text-primary opacity-30',
      };
    } else {
      // 더 먼 항목: 매우 투명
      return {
        className: 'text-body-5 text-primary opacity-20',
      };
    }
  };

  // 스크롤 위치를 기반으로 컨테이너 정중앙에 가장 가까운 항목 찾기
  const findClosestIndex = (scrollTop: number): number => {
    // 컨테이너의 정확한 중앙 위치 (절대 좌표)
    const containerCenter = scrollTop + CONTAINER_HEIGHT / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    // 각 항목의 중심 위치를 계산하여 컨테이너 중앙에 가장 가까운 항목 찾기
    for (let i = 0; i < items.length; i++) {
      // 각 항목의 중심 위치 (절대 좌표)
      const itemCenter = TOP_PADDING + i * ITEM_HEIGHT + ITEM_HEIGHT / 2;
      // 컨테이너 중앙과 항목 중심 사이의 거리
      const distance = Math.abs(containerCenter - itemCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return Math.max(0, Math.min(closestIndex, items.length - 1));
  };

  // 스크롤하는 동안 실시간으로 값 업데이트
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    // 초기 스크롤 중이 아니면 사용자가 스크롤한 것으로 표시
    if (!isInitialScrollRef.current && !isScrollingRef.current) {
      hasUserScrolledRef.current = true;
    }

    if (isScrollingRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    
    const closestIndex = findClosestIndex(scrollTop);
    const validIndex = Math.max(0, Math.min(closestIndex, items.length - 1));
    if (items[validIndex] !== tempSelectedValue) {
      setTempSelectedValue(items[validIndex]);
    }
  };

  // 스크롤 종료 시 현재 위치에서 선택 (스냅 없이)
  const handleScrollEnd = () => {
    if (!scrollContainerRef.current) return;
    
    // 초기 스크롤 중이거나 사용자가 스크롤하지 않았으면 onSelect 호출하지 않음
    if (isInitialScrollRef.current || !hasUserScrolledRef.current) {
      return;
    }

    // 기존 타이머 취소
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current);
    }

    // 스크롤이 끝난 후 현재 위치의 항목 선택 (200ms 후)
    scrollEndTimeoutRef.current = setTimeout(() => {
      if (!scrollContainerRef.current || isScrollingRef.current) return;

      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;
      
      // 현재 스크롤 위치에서 가장 가까운 항목 찾기
      const validIndex = findClosestIndex(scrollTop);
      const selectedItem = items[validIndex];
      setTempSelectedValue(selectedItem);
      onSelect(selectedItem); // 부모 컴포넌트의 상태 업데이트
      // 스냅하지 않고 현재 위치에서 멈춤
    }, 200);
  };

  const currentSelectedIndex = useMemo(
    () => items.findIndex((item) => item === tempSelectedValue),
    [items, tempSelectedValue]
  );

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* 선택 영역 표시 */}
      <div 
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-b border-grayscale-300 bg-transparent pointer-events-none z-[1]"
        style={{ height: `${ITEM_HEIGHT}px` }}
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
        {/* 상단 패딩 */}
        <div style={{ height: `${TOP_PADDING}px` }} />
        
        <ul className="list-none p-0 m-0 flex flex-col">
          {items.map((item, index) => {
            const itemStyle = getItemStyle(index, currentSelectedIndex);
            return (
              <li
                key={index}
                className="snap-center snap-always flex items-center justify-center"
                style={{ height: `${ITEM_HEIGHT}px`, minHeight: `${ITEM_HEIGHT}px` }}
              >
                <span className={itemStyle.className}>
                  {formatItem(item)}
                </span>
              </li>
            );
          })}
        </ul>
        
        {/* 하단 패딩 */}
        <div style={{ height: `${TOP_PADDING}px` }} />
      </div>
    </div>
  );
}

