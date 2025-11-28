'use client';

import React, { useState, useEffect } from 'react';
import { CategorySub, CategoryMajor } from '@/types/expense';
import { createCategorySub, updateCategorySub } from '@/lib/api/category';
import { categoryOptions } from '@/types/expense';
import Button from '@/component/Button';
import InputField from '@/component/InputField';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';

interface CategorySubInputBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  major: CategoryMajor;
  editingSub: CategorySub | null; // null이면 추가, 있으면 수정
  onSuccess: () => void;
  onRefresh?: () => void; // 리스트 새로고침 콜백
  onBack?: () => void; // 뒤로가기 시 이전 화면으로 돌아가기 (편집 모달 또는 세부카테고리 바텀시트)
}

export default function CategorySubInputBottomSheet({
  isOpen,
  onClose,
  major,
  editingSub,
  onSuccess,
  onBack,
}: CategorySubInputBottomSheetProps) {
  const [subName, setSubName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingSub) {
        setSubName(editingSub.sub_name || '');
      } else {
        setSubName('');
      }
    }
  }, [isOpen, editingSub]);

  const handleSubmit = async () => {
    if (!subName.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSub) {
        // 수정
        await updateCategorySub(editingSub.sub_id, subName.trim());
      } else {
        // 추가
        await createCategorySub({
          major,
          sub_name: subName.trim(),
        });
      }
      onSuccess();
      onClose();
      setSubName('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const majorLabel = categoryOptions.find(opt => opt.value === major)?.label || '';

  return (
    <BottomSheet isOpen={isOpen} onClose={onBack || onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <button
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              onClose();
            }
          }}
          className="p-2 -ml-2 text-grayscale-600"
          aria-label="닫기"
        >
          ✕
        </button>
        <h2 className="text-subhead-1 text-text-primary">
          카테고리 이름을 입력하세요
        </h2>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="text-body-2 text-button-primary disabled:text-grayscale-400"
        >
          확인
        </button>
      </div>

      {/* Content */}
      <div className="px-5 pb-6">
        <InputField
          label={`${majorLabel} 카테고리`}
          type="text"
          value={subName}
          onChange={(e) => setSubName(e.target.value)}
          placeholder="카테고리 입력"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          autoFocus
        />
      </div>
    </BottomSheet>
  );
}

