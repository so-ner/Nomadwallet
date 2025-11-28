'use client';

import React, { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import CurrencySelectBottomSheet from '@/component/BottomSheet/select/CurrencySelectBottomSheet';
import DateSelectBottomSheet from '@/component/BottomSheet/select/DateSelectBottomSheet';
import TravelSelectBottomSheet from '@/component/BottomSheet/select/TravelSelectBottomSheet';
import CategoryMajorBottomSheet from '@/component/BottomSheet/category/CategoryMajorBottomSheet';
import CategorySubBottomSheet from '@/component/BottomSheet/category/CategorySubBottomSheet';
import CategorySubEditModal from '@/component/CategorySubEditModal';
import CategorySubInputBottomSheet from '@/component/BottomSheet/category/CategorySubInputBottomSheet';
import Button from '@/component/Button';
import ConfirmModal from '@/component/ConfirmModal';
import { processCurrencyData, getUniqueCurrencies, CurrencyData } from '@/lib/currency';
import rawCurrencyData from '@/lib/currency-data.json';
import dayjs from '@/lib/dayjs';
import { TransactionType, CategoryMajor, CategorySub } from '@/types/expense';
import { getExpense, updateExpense, deleteExpense } from '@/lib/api/expense';
import { useConfirm } from '@/context/ConfirmContext';
import { Travel } from '@/types/travel';
import { getTravels, getTravel } from '@/lib/api/travel';
import { calculateExchange } from '@/lib/api/exchangeRate';
import { CurrencyCode } from '@/types/travel';
import { PutExpenseRequest } from '@/types/expense';

interface ExpenseFormState {
  amount: string;
  expenseType: TransactionType;
  currency: number;
  travel_id: number | null;
  category: string;
  categorySubId: number | null;
  expense_date: string;
  memo: string;
}

export default function ExpenseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const expenseId = Number(params?.id);
  const { showConfirm } = useConfirm();
  
  const [formState, setFormState] = useState<ExpenseFormState>({
    amount: '',
    expenseType: 'EXPENSE',
    currency: 0,
    travel_id: null,
    category: '',
    categorySubId: null,
    expense_date: '',
    memo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCurrencySheetOpen, setIsCurrencySheetOpen] = useState(false);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [isTravelSheetOpen, setIsTravelSheetOpen] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isCalculatingExchange, setIsCalculatingExchange] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // 카테고리 관련 상태
  const [isCategoryMajorSheetOpen, setIsCategoryMajorSheetOpen] = useState(false);
  const [isCategorySubSheetOpen, setIsCategorySubSheetOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [isCategoryInputSheetOpen, setIsCategoryInputSheetOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<CategoryMajor | null>(null);
  const [editingSub, setEditingSub] = useState<CategorySub | null>(null);
  
  // 필수 필드 refs
  const amountInputRef = useRef<HTMLInputElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);

  // 통화 데이터 가공
  const availableCurrencies = useMemo(() => {
    const processed = processCurrencyData(rawCurrencyData);
    return getUniqueCurrencies(processed);
  }, []);

  // 선택된 통화 정보 찾기
  const selectedCurrency = useMemo(() => {
    return availableCurrencies.find(c => c.currency_number === formState.currency);
  }, [availableCurrencies, formState.currency]);

  // 데이터 로드
  useEffect(() => {
    if (!expenseId || isNaN(expenseId)) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        const response = await getExpense(expenseId);
        if (mounted && response.expense) {
          const expense = response.expense;
          setFormState({
            amount: String(expense.amount || ''),
            expenseType: expense.type || 'EXPENSE',
            currency: expense.currency || 0,
            travel_id: expense.travel_id || null,
            category: expense.category || '',
            categorySubId: null, // categorySubId는 별도로 관리 필요
            expense_date: expense.expense_date || '',
            memo: expense.memo || '',
          });

          // travel_id가 있으면 travel 정보 로드
          if (expense.travel_id) {
            try {
              const travelResponse = await getTravel(expense.travel_id);
              setSelectedTravel(travelResponse.travel);
            } catch (error) {
              console.error('예산 정보 조회 실패:', error);
            }
          }

          // 환율 정보 설정
          if (expense.exchange_rate) {
            setExchangeRate(expense.exchange_rate);
            if (expense.amount && expense.exchange_rate) {
              setConvertedAmount(expense.amount * expense.exchange_rate);
            }
          }
        }
      } catch (error) {
        console.error('지출 상세 조회 실패:', error);
        alert('지출 정보를 불러오는데 실패했습니다.');
        router.push('/expense');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [expenseId, router]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setFormState((prev) => ({ ...prev, amount: numericValue }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpenseTypeChange = (type: TransactionType) => {
    setFormState((prev) => ({ ...prev, expenseType: type }));
  };

  const handleCurrencyChange = async (currencyNumber: number) => {
    setFormState((prev) => ({ ...prev, currency: currencyNumber }));
    setIsCurrencySheetOpen(false);
    
    // 통화 선택 시 금액이 있으면 즉시 환율 계산
    if (formState.amount && parseFloat(formState.amount) > 0) {
      await calculateExchangeRate(parseFloat(formState.amount), currencyNumber);
    }
  };

  const handleDateSelect = (date: string) => {
    setFormState((prev) => ({ ...prev, expense_date: date }));
    setIsDateSheetOpen(false);
  };

  const handleTravelSelect = async (travelId: number) => {
    setFormState((prev) => ({ ...prev, travel_id: travelId }));
    try {
      const response = await getTravel(travelId);
      setSelectedTravel(response.travel);
    } catch (error) {
      console.error('예산 정보 조회 실패:', error);
    }
  };

  // 카테고리 선택 핸들러들
  const handleCategoryMajorSelect = (major: CategoryMajor) => {
    setSelectedMajor(major);
    setIsCategoryMajorSheetOpen(false);
    setIsCategorySubSheetOpen(true);
  };

  const handleCategorySubBack = () => {
    setIsCategorySubSheetOpen(false);
    setIsCategoryMajorSheetOpen(true);
  };

  const handleCategorySubSelect = (subId: number, subName: string) => {
    setFormState((prev) => ({
      ...prev,
      category: subName,
      categorySubId: subId,
    }));
    setIsCategorySubSheetOpen(false);
  };

  const handleCategoryEdit = () => {
    setIsCategorySubSheetOpen(false);
    setIsCategoryEditModalOpen(true);
  };

  const handleCategoryEditBack = () => {
    setIsCategoryEditModalOpen(false);
    setIsCategorySubSheetOpen(true);
  };

  const handleCategoryAdd = () => {
    setEditingSub(null);
    setIsCategoryInputSheetOpen(true);
  };

  const handleCategorySubEdit = (sub: CategorySub) => {
    setEditingSub(sub);
    setIsCategoryInputSheetOpen(true);
  };

  const handleCategoryInputBack = () => {
    setIsCategoryInputSheetOpen(false);
    setEditingSub(null);
    if (isCategoryEditModalOpen) {
      // 편집 모달은 이미 열려있으므로 그대로 유지
    } else {
      setIsCategorySubSheetOpen(true);
    }
  };

  const [categoryInputSuccessTrigger, setCategoryInputSuccessTrigger] = useState(0);
  const [categorySubRefreshTrigger, setCategorySubRefreshTrigger] = useState(0);

  const handleCategoryInputSuccess = () => {
    if (isCategoryEditModalOpen) {
      setCategoryInputSuccessTrigger(prev => prev + 1);
    } else {
      setCategorySubRefreshTrigger(prev => prev + 1);
    }
  };

  const handleCategorySubRefresh = () => {
    setCategorySubRefreshTrigger(prev => prev + 1);
  };

  const handleCategorySubSelectFromEdit = (subId: number, subName: string) => {
    handleCategorySubSelect(subId, subName);
    setIsCategoryEditModalOpen(false);
  };

  const handleClearCategorySelection = () => {
    setFormState((prev) => ({
      ...prev,
      category: '',
      categorySubId: null,
    }));
  };

  // 환율 계산 함수
  const calculateExchangeRate = async (amount: number, currencyNumber: number) => {
    if (!currencyNumber || currencyNumber === CurrencyCode.KRW) {
      setExchangeRate(null);
      setConvertedAmount(null);
      return;
    }

    if (!amount || amount <= 0) {
      setExchangeRate(null);
      setConvertedAmount(null);
      return;
    }

    const currency = availableCurrencies.find(c => c.currency_number === currencyNumber);
    const currencyCode = currency?.currency_code?.toLowerCase();
    if (!currencyCode) {
      setExchangeRate(null);
      setConvertedAmount(null);
      return;
    }

    const dateToUse = formState.expense_date || dayjs().format('YYYY-MM-DD');

    setIsCalculatingExchange(true);
    try {
      const result = await calculateExchange(
        amount,
        currencyCode,
        dateToUse
      );
      
      setExchangeRate(result.rate);
      setConvertedAmount(result.converted);
    } catch (error) {
      console.error('환율 계산 실패:', error);
      setExchangeRate(null);
      setConvertedAmount(null);
    } finally {
      setIsCalculatingExchange(false);
    }
  };

  // 금액 입력 포커스 아웃 시 환율 계산
  const handleAmountBlur = async () => {
    if (formState.amount && formState.currency && formState.currency !== CurrencyCode.KRW) {
      await calculateExchangeRate(parseFloat(formState.amount), formState.currency);
    }
  };

  const formattedAmount = formState.amount ? parseInt(formState.amount).toLocaleString('ko-KR') : '';
  const formattedDate = formState.expense_date 
    ? dayjs(formState.expense_date).format('YYYY년 MM월 DD일')
    : '';
  const isExpense = formState.expenseType === 'EXPENSE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 필수 필드 검증
      if (!formState.amount || parseFloat(formState.amount) <= 0) {
        amountInputRef.current?.focus();
        setIsSubmitting(false);
        return;
      }

      if (!formState.category) {
        categoryButtonRef.current?.focus();
        setIsSubmitting(false);
        return;
      }

      if (!formState.expense_date) {
        dateButtonRef.current?.focus();
        setIsSubmitting(false);
        return;
      }

      const finalExchangeRate = (formState.currency && formState.currency !== CurrencyCode.KRW && exchangeRate) 
        ? exchangeRate 
        : null;
      
      const dataToSend: PutExpenseRequest = {
        amount: parseFloat(formState.amount) || 0,
        category: formState.category,
        currency: formState.currency,
        expense_date: formState.expense_date,
        exchange_rate: finalExchangeRate,
      };

      await updateExpense(expenseId, dataToSend);
      router.push('/expense');
    } catch (error) {
      alert(error instanceof Error ? error.message : '지출 수정에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExpense(expenseId);
      router.push('/expense');
    } catch (error) {
      alert(error instanceof Error ? error.message : '지출 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <TopAreaSub 
          text="지출 상세" 
          onBack={() => router.back()} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-body-2 text-grayscale-600">로딩중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        text="지출 상세"
        rightElement="삭제"
        onBack={() => router.back()}
        onRightClick={() => setIsDeleteModalOpen(true)}
      />
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col pb-32">
        {/* 금액 */}
        <div className="px-[20px] pt-[20px] pb-[11px] flex gap-[18px] items-center">
          <div className="inline-flex items-center gap-[8px]">
            <input
              ref={amountInputRef}
              name="amount"
              type="text"
              inputMode="numeric"
              className="text-body-1 text-text-primary border-none outline-none bg-transparent placeholder:text-grayscale-400 w-fit min-w-[60px]"
              placeholder="금액"
              value={formattedAmount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
            />
            {selectedCurrency && (
              <span className="text-body-1 text-text-primary whitespace-nowrap">
                {selectedCurrency.currency_code}
              </span>
            )}
          </div>
          {convertedAmount !== null && exchangeRate !== null && (
            <div className="flex flex-col gap-[7px] flex-1">
              <div className="text-headline-5 font-semibold text-[18px] text-text-primary">
                {Math.round(convertedAmount).toLocaleString('ko-KR')}원
              </div>
              <div className="text-caption-2 font-medium text-[12px] text-grayscale-600">
                현재 환율을 기준으로 표시된 금액입니다.
              </div>
            </div>
          )}
        </div>

        {/* 분류 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">분류</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleExpenseTypeChange('EXPENSE')}
              className={`px-4 py-3 rounded-full text-body-2 font-medium transition-colors whitespace-nowrap ${
                isExpense
                  ? 'bg-[#4A6B87] text-white'
                  : 'bg-[#E0F2F7] text-grayscale-600'
              }`}
            >
              지출
            </button>
            <button
              type="button"
              onClick={() => handleExpenseTypeChange('INCOME')}
              className={`px-4 py-3 rounded-full text-body-2 font-medium transition-colors whitespace-nowrap ${
                !isExpense
                  ? 'bg-[#4A6B87] text-white'
                  : 'bg-[#E0F2F7] text-grayscale-600'
              }`}
            >
              수입
            </button>
          </div>
        </div>

        {/* 통화 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">통화</label>
          <button
            type="button"
            onClick={() => setIsCurrencySheetOpen(true)}
            className="w-full px-4 py-3 border-none rounded-lg flex items-center justify-between bg-white"
          >
            <span className={formState.currency && selectedCurrency ? 'text-body-2 text-text-primary' : 'text-body-2 text-grayscale-500'}>
              {formState.currency && selectedCurrency ? selectedCurrency.currency_name : '선택해주세요'}
            </span>
            <Image
              src="/icons/icon-arrow_right-24.svg"
              alt="선택"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 예산명 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">예산명</label>
          <button
            type="button"
            onClick={() => setIsTravelSheetOpen(true)}
            className="w-full px-4 py-3 border-none rounded-lg flex items-center justify-between bg-white"
          >
            <span className={selectedTravel ? 'text-body-2 text-text-primary' : 'text-body-2 text-grayscale-500'}>
              {selectedTravel?.travel_title || '선택해주세요'}
            </span>
            <Image
              src="/icons/icon-arrow_right-24.svg"
              alt="선택"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 카테고리 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">카테고리</label>
          <button
            ref={categoryButtonRef}
            type="button"
            onClick={() => setIsCategoryMajorSheetOpen(true)}
            className="w-full px-4 py-3 border-none rounded-lg flex items-center justify-between bg-white"
          >
            <span className={formState.category ? 'text-body-2 text-text-primary' : 'text-body-2 text-grayscale-500'}>
              {formState.category || '선택해주세요'}
            </span>
            <Image
              src="/icons/icon-arrow_right-24.svg"
              alt="선택"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">날짜</label>
          <button
            ref={dateButtonRef}
            type="button"
            onClick={() => setIsDateSheetOpen(true)}
            className="w-full px-4 py-3 border-none rounded-lg flex items-center justify-between bg-white"
          >
            <span className={formattedDate ? 'text-body-2 text-text-primary' : 'text-body-2 text-grayscale-500'}>
              {formattedDate || '선택해주세요'}
            </span>
            <Image
              src="/icons/icon-arrow_right-24.svg"
              alt="선택"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 내용 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">내용</label>
          <input
            name="memo"
            type="text"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none placeholder:text-grayscale-500"
            placeholder="입력해주세요"
            value={formState.memo}
            onChange={handleInputChange}
          />
        </div>

        {/* 통화 선택 바텀시트 */}
        <CurrencySelectBottomSheet
          isOpen={isCurrencySheetOpen}
          onClose={() => setIsCurrencySheetOpen(false)}
          currencies={availableCurrencies}
          selectedCurrencyNumber={formState.currency}
          onSelect={handleCurrencyChange}
        />

        {/* 날짜 선택 바텀시트 */}
        <DateSelectBottomSheet
          isOpen={isDateSheetOpen}
          onClose={() => setIsDateSheetOpen(false)}
          selectedDate={formState.expense_date || new Date().toISOString().slice(0, 10)}
          onSelect={handleDateSelect}
          title="날짜 선택"
        />

        {/* 예산명 선택 바텀시트 */}
        <TravelSelectBottomSheet
          isOpen={isTravelSheetOpen}
          onClose={() => setIsTravelSheetOpen(false)}
          selectedTravelId={formState.travel_id}
          onSelect={handleTravelSelect}
        />

        {/* 주카테고리 선택 바텀시트 */}
        <CategoryMajorBottomSheet
          isOpen={isCategoryMajorSheetOpen}
          onClose={() => setIsCategoryMajorSheetOpen(false)}
          selectedMajor={selectedMajor}
          onSelect={handleCategoryMajorSelect}
        />

        {/* 세부카테고리 선택 바텀시트 */}
        {selectedMajor && (
          <CategorySubBottomSheet
            isOpen={isCategorySubSheetOpen}
            onClose={() => {
              setIsCategorySubSheetOpen(false);
              setSelectedMajor(null);
            }}
            major={selectedMajor}
            selectedSubId={formState.categorySubId}
            onSelect={handleCategorySubSelect}
            onEdit={handleCategoryEdit}
            onRefresh={categorySubRefreshTrigger}
            onBack={handleCategorySubBack}
          />
        )}

        {/* 세부카테고리 편집 모달 */}
        {selectedMajor && (
          <CategorySubEditModal
            isOpen={isCategoryEditModalOpen}
            onClose={() => {
              setIsCategoryEditModalOpen(false);
              setSelectedMajor(null);
            }}
            major={selectedMajor}
            onAdd={handleCategoryAdd}
            onEdit={handleCategorySubEdit}
            onSelect={handleCategorySubSelectFromEdit}
            onInputSuccess={categoryInputSuccessTrigger}
            onRefresh={handleCategorySubRefresh}
            onBack={handleCategoryEditBack}
            selectedSubId={formState.categorySubId}
            onClearSelection={handleClearCategorySelection}
          />
        )}

        {/* 세부카테고리 추가/수정 바텀시트 */}
        {selectedMajor && (
          <CategorySubInputBottomSheet
            isOpen={isCategoryInputSheetOpen}
            onClose={() => {
              setIsCategoryInputSheetOpen(false);
              setEditingSub(null);
            }}
            major={selectedMajor}
            editingSub={editingSub}
            onSuccess={handleCategoryInputSuccess}
            onBack={handleCategoryInputBack}
          />
        )}

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 flex gap-[8px] p-[20px] border-t border-grayscale-300 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
          <Link
            href="/expense"
            className="flex-1"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="line">
              취소
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </form>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        title="지출 내역 삭제"
        message="작성한 내용을 삭제할까요?"
        confirmText="삭제"
        cancelText="취소"
        isVisible={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
