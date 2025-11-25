'use client';

import React from 'react';
import { CategoryMajor, categoryOptions } from '@/types/expense';

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-[100]"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] z-[101] max-h-[80vh] flex flex-col md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2 py-[32px]">
        {/* Content Container */}
        <div className="flex flex-col gap-[20px]">
          {/* Header */}
          <div className="flex items-center justify-between px-[20px]">
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
            <div className="flex flex-col gap-[26px] px-[20px]">
              {categoryOptions.map((option) => {
                const isSelected = option.value === selectedMajor;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center gap-[12px] hover:bg-grayscale-50 transition-colors ${
                      isSelected ? 'bg-grayscale-50' : ''
                    }`}
                  >
                    {/* Icon Circle - 임시로 동그라미만 표시, 나중에 실제 아이콘으로 교체 */}
                    <div className="w-[40px] h-[40px] rounded-full bg-button-primary flex items-center justify-center flex-shrink-0">
                      {/* TODO: 실제 카테고리 아이콘으로 교체 필요 */}
                    </div>
                    <span className="text-body-4 font-medium text-text-primary">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




