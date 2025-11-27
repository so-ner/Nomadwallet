'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CategorySub, CategoryMajor } from '@/types/expense';
import { getCategorySubs } from '@/lib/api/category';
import { categoryOptions } from '@/types/expense';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';

interface CategorySubBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  major: CategoryMajor;
  selectedSubId: number | null;
  onSelect: (subId: number, subName: string) => void;
  onEdit: () => void;
  onRefresh?: number; // 리스트 새로고침 트리거 (변경될 때마다 리스트 새로고침)
  onBack?: () => void; // 뒤로가기 버튼 클릭 시 (주카테고리 바텀시트로 돌아가기)
}

export default function CategorySubBottomSheet({
  isOpen,
  onClose,
  major,
  selectedSubId,
  onSelect,
  onEdit,
  onRefresh,
  onBack,
}: CategorySubBottomSheetProps) {
  const [subs, setSubs] = useState<CategorySub[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSubs();
    }
  }, [isOpen, major]);

  // 외부에서 리스트 새로고침 요청 시 (onRefresh 트리거가 변경될 때마다)
  useEffect(() => {
    if (isOpen && onRefresh !== undefined) {
      loadSubs();
    }
  }, [onRefresh, isOpen]);

  const loadSubs = async () => {
    setLoading(true);
    try {
      const data = await getCategorySubs(major);
      setSubs(data || []);
    } catch (error) {
      console.error('세부 카테고리 조회 실패:', error);
      setSubs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (sub: CategorySub) => {
    if (sub.sub_name) {
      onSelect(sub.sub_id, sub.sub_name);
      onClose();
    }
  };

  const majorLabel = categoryOptions.find(opt => opt.value === major)?.label || '';

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2"
                aria-label="뒤로가기"
              >
                <Image
                  src="/icons/icon-arrow_left-24.svg"
                  alt="뒤로가기"
                  width={24}
                  height={24}
                />
              </button>
            )}
            <h2 className="text-subhead-1 text-text-primary">{majorLabel}</h2>
          </div>
          <button
            onClick={onEdit}
            className="text-body-2 text-button-primary"
            aria-label="편집"
          >
            편집
          </button>
        </div>

        {/* Summary */}
        <div className="px-5">
          <p className="text-body-4 font-medium text-grayscale-600">
            세부 카테고리 ({Math.max(0, 10 - subs.length)}개 추가 가능)
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-grayscale-300 px-5" />

        {/* Subcategory List */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-[26px] px-5">
            {/* Subcategory Items */}
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-body-2 text-grayscale-500">로딩 중...</p>
              </div>
            ) : subs.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-body-2 text-grayscale-500">등록된 세부 카테고리가 없습니다.</p>
              </div>
            ) : (
              subs.map((sub) => {
                const isSelected = sub.sub_id === selectedSubId;
                return (
                  <button
                    key={sub.sub_id}
                    onClick={() => handleSelect(sub)}
                    className={`w-full text-left hover:bg-grayscale-50 transition-colors ${
                      isSelected ? 'bg-grayscale-50' : ''
                    }`}
                  >
                    <span className="text-body-4 font-medium text-text-primary">{sub.sub_name || ''}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

