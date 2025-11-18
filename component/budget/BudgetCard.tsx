'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {Travel} from '@/types/travel';
import { deleteTravel } from '@/lib/api/travel';
import dayjs from '@/lib/dayjs';
import ConfirmModal from '@/component/ConfirmModal';
import { useToast } from '@/context/ToastContext';

const formatCurrency = (amount: number): string => amount.toLocaleString('ko-KR') + '원';

const BudgetCard: React.FC<{ budget: Travel; onDelete?: () => void }> = ({ budget, onDelete }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // 날짜 포맷팅
  const formattedStartDate = dayjs(budget.start_date).format('YY.MM.DD');
  const formattedEndDate = dayjs(budget.end_date).format('YY.MM.DD');
  
  // 진행중/종료 상태 확인
  const today = dayjs();
  const endDate = dayjs(budget.end_date);
  const isCompleted = endDate.isBefore(today, 'day');
  const statusText = isCompleted ? '종료' : '진행중';
  const statusBgColor = isCompleted ? 'bg-grayscale-400' : 'bg-primary-200';
  const statusTextColor = isCompleted ? 'text-grayscale-700' : 'text-primary-600';
  
  // 남은 금액 계산
  const totalSpent = (budget as any).total_spent || 0;
  const remainingAmount = budget.total_budget - totalSpent;

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current && 
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTravel(budget.travel_id);
      setIsDeleteModalOpen(false);
      showToast('예산이 정상적으로 삭제되었습니다.');
      // 부모 컴포넌트의 목록 업데이트 콜백 호출
      if (onDelete) {
        onDelete();
      } else {
        // 콜백이 없으면 router.refresh() 사용
        router.refresh();
      }
    } catch (e) {
      setIsDeleteModalOpen(false);
      showToast('삭제에 실패했습니다.');
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative bg-white rounded-[20px] py-[26px] px-[22px] shadow-sm w-full">
      {/* 헤더: 제목, 상태 태그, 햄버거 버튼 */}
      <div className="flex items-center justify-between mb-[35px]">
        <Link 
          href={`/budget/${budget.travel_id}`} 
          className="flex items-center gap-[12px] no-underline text-inherit flex-1"
          onClick={handleMenuClose}
        >
          <h2 className="text-headline-4 text-button-primary">
            {budget.travel_title || '제목'}
          </h2>
          <span className={`px-[6px] py-[4px] rounded-[8px] text-body-4 font-medium ${statusBgColor} ${statusTextColor}`}>
            {statusText}
          </span>
        </Link>
        
        {/* 햄버거 버튼 */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleMenuToggle}
          className="relative w-[24px] h-[24px] flex items-center justify-center z-20"
          aria-label="메뉴"
        >
          <Image
            src="/icons/icon-3dot-hor-24.svg"
            alt="메뉴"
            width={24}
            height={24}
            className="w-[24px] h-[24px]"
          />
        </button>
      </div>

      {/* 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-[62px] right-[30px] bg-white rounded-[8px] shadow-lg border z-50 min-w-[150px]"
        >
          <Link
            href={`/budget/${budget.travel_id}/edit`}
            onClick={handleMenuClose}
            className="block w-full h-[50px] px-4 text-body-2 text-grayscale-900 hover:bg-grayscale-100 text-center flex items-center justify-center first:rounded-t-[8px]"
          >
            내용 수정
          </Link>
          <div className="border-t border-grayscale-200"></div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeleteClick();
            }}
            className="w-full h-[50px] px-4 text-body-2 text-grayscale-900 hover:bg-grayscale-100 text-center flex items-center justify-center last:rounded-b-[8px]"
          >
            삭제
          </button>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        title="예산 내역 삭제"
        message="작성한 내용을 삭제할까요?"
        confirmText="삭제"
        cancelText="취소"
        isVisible={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* 날짜, 예산, 남은 금액 */}
      <Link 
        href={`/budget/${budget.travel_id}`} 
        className="block no-underline text-inherit"
        onClick={handleMenuClose}
      >
        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-center">
            <span className="text-subhead-2 text-button-primary">날짜</span>
            <span className="text-body-4 text-text-primary">
              {formattedStartDate} ~ {formattedEndDate}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-subhead-2 text-button-primary">예산</span>
            <span className="text-body-4 text-text-primary">
              {formatCurrency(budget.total_budget)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-subhead-2 text-button-primary">남은 금액</span>
            <span className="text-body-4 text-text-primary">
              {formatCurrency(remainingAmount)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BudgetCard;
