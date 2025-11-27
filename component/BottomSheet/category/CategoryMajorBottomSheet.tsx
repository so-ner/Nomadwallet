'use client';

import React from 'react';
import { CategoryMajor, categoryOptions } from '@/types/expense';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';

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
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between px-5">
          <h2 className="text-subhead-1 text-text-primary">카테고리</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-grayscale-600 text-headline-5"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-[26px] px-5">
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
                  {/* Icon Circle - 임시로 동그라미만 표시, 나중에 실제 아이콘으로 교체 */}
                  <div className="w-10 h-10 rounded-full bg-button-primary flex items-center justify-center flex-shrink-0">
                    {/* TODO: 실제 카테고리 아이콘으로 교체 필요 */}
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

