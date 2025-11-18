'use client';

import React, { useEffect, useRef } from 'react';
import { CurrencyData } from '@/lib/currency';
import Button from '@/component/Button';
import styles from './CurrencySelectBottomSheet.module.css';

interface CurrencySelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currencies: CurrencyData[];
  selectedCurrencyNumber: number;
  onSelect: (currencyNumber: number) => void;
}

const ITEM_HEIGHT = 56; // 각 항목의 높이 (padding 포함)

export default function CurrencySelectBottomSheet({
  isOpen,
  onClose,
  currencies,
  selectedCurrencyNumber,
  onSelect,
}: CurrencySelectBottomSheetProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const [tempSelectedIndex, setTempSelectedIndex] = React.useState<number | null>(null);

  const CONTAINER_HEIGHT = 200; // 스크롤 컨테이너 고정 높이

  // 바텀시트가 열릴 때 선택된 항목으로 스크롤
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      const selectedIndex = currencies.findIndex(
        (c) => c.currency_number === selectedCurrencyNumber
      );
      if (selectedIndex !== -1) {
        setTempSelectedIndex(selectedIndex);
        // 가운데 위치로 스크롤 (컨테이너 높이 200px 고정)
        const centerOffset = CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2;
        const scrollPosition = selectedIndex * ITEM_HEIGHT - centerOffset + ITEM_HEIGHT * 2.5;
        
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollPosition;
          }
        }, 100);
      }
    }
  }, [isOpen, currencies, selectedCurrencyNumber]);

  // 스크롤 종료 시 스냅 (선택은 하지 않음)
  const handleScrollEnd = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    
    // 가운데 위치 계산 (컨테이너 높이 200px 고정)
    const centerOffset = CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2;
    const centerPosition = scrollTop + centerOffset;
    const selectedIndex = Math.round((centerPosition - ITEM_HEIGHT * 2.5) / ITEM_HEIGHT);
    
    // 유효한 인덱스 범위 확인
    const validIndex = Math.max(0, Math.min(selectedIndex, currencies.length - 1));
    setTempSelectedIndex(validIndex);
    const targetScrollTop = validIndex * ITEM_HEIGHT - centerOffset + ITEM_HEIGHT * 2.5;

    isScrollingRef.current = true;
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 300);
  };

  // 선택하기 버튼 클릭 시 현재 가운데 항목 선택
  const handleConfirmSelect = () => {
    if (tempSelectedIndex !== null && tempSelectedIndex >= 0 && tempSelectedIndex < currencies.length) {
      const selectedCurrency = currencies[tempSelectedIndex];
      onSelect(selectedCurrency.currency_number);
      onClose();
    } else {
      // tempSelectedIndex가 없으면 현재 선택된 항목 유지
      onClose();
    }
  };

  const handleSelect = (currencyNumber: number) => {
    onSelect(currencyNumber);
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
          <h2 className="text-subhead-1 text-text-primary">통화 선택</h2>
        </div>

        <div className={styles.pickerContainer}>
          {/* 선택 영역 표시 */}
          <div className={styles.selectionIndicator} />
          
          <div
            ref={scrollContainerRef}
            className={styles.scrollContainer}
            onTouchEnd={handleScrollEnd}
            onWheel={handleScrollEnd}
          >
            {/* 상단 패딩 */}
            <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
            
            <ul className={styles.currencyList}>
              {currencies.map((currency, index) => {
                const isSelected = currency.currency_number === selectedCurrencyNumber;
                const isTempSelected = tempSelectedIndex === index;
                return (
                  <li
                    key={currency.currency_number}
                    className={styles.currencyItem}
                    style={{ height: `${ITEM_HEIGHT}px` }}
                  >
                    <div className={`${styles.currencyButton} ${isSelected || isTempSelected ? styles.currencyButtonSelected : ''}`}>
                      <span className={isSelected || isTempSelected ? 'text-subhead-1 text-primary' : 'text-body-2 text-primary opacity-60'}>
                        {currency.currency_name}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            
            {/* 하단 패딩 */}
            <div style={{ height: `${ITEM_HEIGHT * 2.5}px` }} />
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

