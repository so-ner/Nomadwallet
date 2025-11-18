'use client';

import React from 'react';
import Image from 'next/image';

interface CurrencyOption {
  code: number;
  name: string;
  display: string;
  symbol: string;
}

interface CurrencySelectButtonProps {
  options: CurrencyOption[];
  selectedCode: number;
  onSelect: (code: number) => void;
  placeholder?: string;
}

export default function CurrencySelectButton({
  options,
  selectedCode,
  onSelect,
  placeholder = '선택해주세요',
}: CurrencySelectButtonProps) {
  const selectedCurrency = options.find(c => c.code === selectedCode);

  const handleClick = () => {
    const currentIndex = options.findIndex(c => c.code === selectedCode);
    const nextIndex = (currentIndex + 1) % options.length;
    onSelect(options[nextIndex].code);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full px-4 py-3 border border-grayscale-300 rounded-lg text-body-1 text-grayscale-900 flex items-center justify-between bg-white"
    >
      <span className={selectedCurrency ? 'text-grayscale-900' : 'text-grayscale-400'}>
        {selectedCurrency?.display || placeholder}
      </span>
      <Image
        src="/icons/icon-arrow_right-24.svg"
        alt="선택"
        width={24}
        height={24}
      />
    </button>
  );
}

