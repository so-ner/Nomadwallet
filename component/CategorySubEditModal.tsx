'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CategorySub, CategoryMajor } from '@/types/expense';
import { getCategorySubs, deleteCategorySub, isDefaultCategorySub } from '@/lib/api/category';
import { categoryOptions } from '@/types/expense';
import { useConfirm } from '@/context/ConfirmContext';
import TopAreaSub from '@/component/top_area/TopAreaSub';

interface CategorySubEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  major: CategoryMajor;
  onAdd: () => void;
  onEdit: (sub: CategorySub) => void;
  onSelect: (subId: number, subName: string) => void;
  onRefresh?: () => void; // 리스트 새로고침 콜백 (외부 바텀시트용)
  onInputSuccess?: number; // 입력 바텀시트 성공 시 트리거 (변경될 때마다 리스트 새로고침)
  onBack?: () => void; // 뒤로가기 시 세부카테고리 바텀시트로 돌아가기
  selectedSubId?: number | null; // 현재 선택된 카테고리 ID
  onClearSelection?: () => void; // 선택된 카테고리 초기화 콜백
}

export default function CategorySubEditModal({
  isOpen,
  onClose,
  major,
  onAdd,
  onEdit,
  onSelect,
  onRefresh,
  onInputSuccess,
  onBack,
  selectedSubId,
  onClearSelection,
}: CategorySubEditModalProps) {
  const [subs, setSubs] = useState<CategorySub[]>([]);
  const [loading, setLoading] = useState(false);
  const { showConfirm } = useConfirm();

  useEffect(() => {
    if (isOpen) {
      loadSubs();
    }
  }, [isOpen, major]);

  // 입력 바텀시트 성공 시 리스트 새로고침
  useEffect(() => {
    if (onInputSuccess && isOpen) {
      // onInputSuccess가 변경되면 리스트 새로고침 (입력 바텀시트 성공 시 호출됨)
      loadSubs();
    }
  }, [onInputSuccess, isOpen]);

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

  const handleDelete = (sub: CategorySub) => {
    const majorLabel = categoryOptions.find(opt => opt.value === major)?.label || '';
    showConfirm({
      title: `${sub.sub_name} 카테고리를 삭제할까요?`,
      message: `카테고리에 포함된 내역은 모두 '${majorLabel}'로 구분됩니다.`,
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await deleteCategorySub(sub.sub_id);
          // 삭제된 카테고리가 현재 선택된 카테고리인지 확인
          if (selectedSubId === sub.sub_id && onClearSelection) {
            onClearSelection();
          }
          await loadSubs();
          if (onRefresh) {
            onRefresh();
          }
          // 삭제 후 세부카테고리 바텀시트로 돌아가기
          if (onBack) {
            onBack();
          }
        } catch (error) {
          alert(error instanceof Error ? error.message : '삭제에 실패했습니다.');
        }
      },
    });
  };

  const handleSelect = (sub: CategorySub) => {
    if (sub.sub_name) {
      onSelect(sub.sub_id, sub.sub_name);
      onClose();
    }
  };

  const majorLabel = categoryOptions.find(opt => opt.value === major)?.label || '';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-[110]"
        onClick={() => {
          if (onBack) {
            onBack();
          } else {
            onClose();
          }
        }}
      />
      
      {/* Full Modal */}
      <div className="fixed inset-0 z-[111] flex flex-col bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
        {/* Header */}
        <TopAreaSub
          text={majorLabel}
          onBack={() => {
            if (onBack) {
              onBack();
            } else {
              onClose();
            }
          }}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-[2rem] pb-[3.2rem] pt-[16px]">
            {/* Add Button */}
            <button
              onClick={onAdd}
              className="w-full flex items-center gap-[8px] py-[16px] mb-[8px]"
            >
              <div className="w-[20px] h-[20px] rounded-full bg-status-success flex items-center justify-center flex-shrink-0">
                <span className="text-white text-headline-5">+</span>
              </div>
              <span className="text-body-4 font-medium text-text-primary">세부 카테고리 추가</span>
            </button>

            {/* Divider */}
            <div className="h-[1px] bg-grayscale-300 my-[8px]" />

            {/* Subcategory List */}
            {loading ? (
              <div className="flex items-center justify-center py-[40px]">
                <p className="text-body-2 text-grayscale-500">로딩 중...</p>
              </div>
            ) : subs.length === 0 ? (
              <div className="flex items-center justify-center py-[40px]">
                <p className="text-body-2 text-grayscale-500">등록된 세부 카테고리가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {subs.map((sub, index) => {
                  const isDefault = isDefaultCategorySub(sub);
                  return (
                    <div key={sub.sub_id}>
                      <div className="flex items-center gap-[8px] py-[16px]">
                        {/* 삭제 버튼 영역은 항상 유지하되, 기본 카테고리는 보이지 않게 처리 */}
                        <button
                          onClick={() => !isDefault && handleDelete(sub)}
                          className={`w-[24px] h-[24px] rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 ${
                            isDefault ? 'invisible' : ''
                          }`}
                          aria-label="삭제"
                          disabled={isDefault}
                        >
                          <span className="text-white text-body-2">−</span>
                        </button>
                        {/* 기본 카테고리는 편집 불가, 유저 카테고리만 편집 가능 */}
                        <button
                          onClick={() => !isDefault && onEdit(sub)}
                          className={`flex-1 text-left ${isDefault ? 'cursor-default' : ''}`}
                          disabled={isDefault}
                        >
                          <span className="text-body-4 font-medium text-text-primary">{sub.sub_name || ''}</span>
                        </button>
                      </div>
                      {/* 모든 항목 아래에 라인 표시 */}
                      <div className="h-[1px] bg-grayscale-300 my-[0.8rem]" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

