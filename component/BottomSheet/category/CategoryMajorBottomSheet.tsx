'use client';

import React from 'react';
import Image from 'next/image';
import { CategoryMajor, categoryOptions } from '@/types/expense';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';

// 카테고리 타입을 아이콘 경로로 매핑
const getCategoryIconPath = (categoryMajor: CategoryMajor): string => {
  const iconMap: Record<string, string> = {
    FOOD: '/category-icon/type=food.svg',
    HOUSING: '/category-icon/type=house.svg',
    FIXED: '/category-icon/type=fixed-cost.svg',
    SAVINGS_INVESTMENT: '/category-icon/type=saving.svg',
    TRANSPORTATION: '/category-icon/type=transportation.svg',
    LIVING_SHOPPING: '/category-icon/type=shopping.svg',
    ENTERTAINMENT: '/category-icon/type=cultural-life.svg',
    OTHERS: '/category-icon/type=etc.svg',
  };
  
  return iconMap[categoryMajor] || '/category-icon/type=etc.svg'; // 기본값
};

interface CategoryMajorBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMajor: CategoryMajor | null;
  onSelect: (major: CategoryMajor) => void;
}

export default function CategoryMajorBottomSheet({
  isOpen,
  onClose,
  selectedMajor,
  onSelect,
}: CategoryMajorBottomSheetProps) {
  const handleSelect = (major: CategoryMajor) => {
    onSelect(major);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-5 px-[2rem] pb-[3.2rem]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-subhead-1 text-text-primary">카테고리</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-grayscale-600 text-headline-5"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-grayscale-300" />

        {/* Category List */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-[26px]">
            {categoryOptions.map((option) => {
              const isSelected = option.value === selectedMajor;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-3 hover:bg-grayscale-50 transition-colors ${
                    isSelected ? 'bg-grayscale-50' : ''
                  }`}
                >
                  {/* Icon Circle */}
                  <div className="w-[4rem] h-[4rem] rounded-full bg-button-primary flex items-center justify-center flex-shrink-0">
                    <Image
                      src={getCategoryIconPath(option.value)}
                      alt={option.label}
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className="text-body-4 font-medium text-text-primary">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

