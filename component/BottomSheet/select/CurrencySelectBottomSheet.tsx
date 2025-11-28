'use client';

import React, { useEffect, useState } from 'react';
import { CurrencyData } from '@/lib/currency';
import Button from '@/component/Button';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';
import ScrollablePicker from '@/component/BottomSheet/core/ScrollablePicker';

interface CurrencySelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currencies: CurrencyData[];
  selectedCurrencyNumber: number;
  onSelect: (currencyNumber: number) => void;
}

export default function CurrencySelectBottomSheet({
  isOpen,
  onClose,
  currencies,
  selectedCurrencyNumber,
  onSelect,
}: CurrencySelectBottomSheetProps) {
  const selectedCurrency = currencies.find(
    (c) => c.currency_number === selectedCurrencyNumber
  );
  
  const [tempSelectedCurrency, setTempSelectedCurrency] = useState<CurrencyData | null>(
    selectedCurrency || null
  );

  // 바텀시트가 열릴 때 선택된 통화로 초기화
  useEffect(() => {
    if (isOpen && selectedCurrency) {
      setTempSelectedCurrency(selectedCurrency);
    }
  }, [isOpen, selectedCurrency]);

  // 선택하기 버튼 클릭 시 통화 선택
  const handleConfirmSelect = () => {
    if (tempSelectedCurrency) {
      onSelect(tempSelectedCurrency.currency_number);
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        <div className="flex items-center justify-center mb-[2.4rem]">
          <h2 className="text-subhead-1 text-text-primary">통화 선택</h2>
        </div>

        <div className="relative h-[200px] overflow-hidden flex-shrink-0">
          <ScrollablePicker
            items={currencies}
            selectedValue={tempSelectedCurrency || currencies[0]}
            onSelect={(currency) => setTempSelectedCurrency(currency)}
            formatItem={(currency) => currency.currency_name}
            isOpen={isOpen}
          />
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

