'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import { PutTravelRequest, WarnType, Travel } from '@/types/travel';
import { getTravel, updateTravel, deleteTravel } from '@/lib/api/travel';
import dayjs from '@/lib/dayjs';
import CurrencySelectBottomSheet from '@/component/CurrencySelectBottomSheet';
import DateSelectBottomSheet from '@/component/DateSelectBottomSheet';
import Button from '@/component/Button';
import ConfirmModal from '@/component/ConfirmModal';
import { processCurrencyData, getUniqueCurrencies, CurrencyData } from '@/lib/currency';
import rawCurrencyData from '@/lib/currency-data.json';

type TravelType = 'domestic' | 'international';

interface TravelFormState {
  travelType: TravelType;
  travelTitle: string;
  startDate: string;
  endDate: string;
  totalBudget: string;
  currencyCode: number;
  warnType: WarnType | '';
  warnDetailCond: string;
  content: string;
}

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const travelId = Number(params?.id);

  const [formState, setFormState] = useState<TravelFormState>({
    travelType: 'international',
    travelTitle: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    currencyCode: 756,
    warnType: '',
    warnDetailCond: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCurrencySheetOpen, setIsCurrencySheetOpen] = useState(false);
  const [isStartDateSheetOpen, setIsStartDateSheetOpen] = useState(false);
  const [isEndDateSheetOpen, setIsEndDateSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 통화 데이터 가공
  const availableCurrencies = useMemo(() => {
    const processed = processCurrencyData(rawCurrencyData);
    return getUniqueCurrencies(processed);
  }, []);

  // 선택된 통화 정보 찾기
  const selectedCurrency = useMemo(() => {
    return availableCurrencies.find(c => c.currency_number === formState.currencyCode);
  }, [availableCurrencies, formState.currencyCode]);

  // 데이터 로드
  useEffect(() => {
    if (!travelId || isNaN(travelId)) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        const response = await getTravel(travelId);
        if (mounted && response.travel) {
          const travel = response.travel;
          setFormState({
            travelType: travel.currency === 410 ? 'domestic' : 'international',
            travelTitle: travel.travel_title || '',
            startDate: travel.start_date || '',
            endDate: travel.end_date || '',
            totalBudget: String(travel.total_budget || ''),
            currencyCode: travel.currency || 756,
            warnType: (travel.warn_type as WarnType) || '',
            warnDetailCond: travel.warn_detail_cond || '',
            content: '', // content 필드가 없을 수 있음
          });
        }
      } catch (error) {
        console.error('예산 상세 조회 실패:', error);
        alert('예산 정보를 불러오는데 실패했습니다.');
        router.push('/budget');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [travelId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setFormState((prev) => ({ ...prev, totalBudget: numericValue }));
  };

  const handleTypeChange = (type: TravelType) => {
    const defaultCurrencyNumber = type === 'domestic' 
      ? 410 // KRW
      : 756; // CHF
    setFormState((prev) => ({
      ...prev,
      travelType: type,
      currencyCode: defaultCurrencyNumber,
    }));
  };

  const handleCurrencyChange = (currencyNumber: number) => {
    setFormState((prev) => ({ ...prev, currencyCode: currencyNumber }));
  };

  const handleStartDateSelect = (date: string) => {
    setFormState((prev) => ({
      ...prev,
      startDate: date,
    }));
    setIsStartDateSheetOpen(false);
    setTimeout(() => {
      setIsEndDateSheetOpen(true);
    }, 300);
  };

  const handleEndDateSelect = (date: string) => {
    setFormState((prev) => ({
      ...prev,
      endDate: date,
    }));
    setIsEndDateSheetOpen(false);
  };

  const handleWarnTypeChange = (type: WarnType) => {
    const currentWarnType = formState.warnType;
    if (currentWarnType === type) {
      setFormState((prev) => ({
        ...prev,
        warnType: '',
        warnDetailCond: '',
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        warnType: type,
        warnDetailCond: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formState.travelTitle.trim()) {
      alert('예산명을 입력해주세요.');
      return;
    }
    
    if (!formState.startDate || !formState.endDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    
    if (new Date(formState.startDate) > new Date(formState.endDate)) {
      alert('시작 날짜가 종료 날짜보다 늦을 수 없습니다.');
      return;
    }
    
    if (!formState.totalBudget || parseFloat(formState.totalBudget) <= 0) {
      alert('예산 금액을 입력해주세요.');
      return;
    }
    
    // 경고 알림 설정 검증
    if (formState.warnType && !formState.warnDetailCond.trim()) {
      alert('경고 알림 설정값을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend: PutTravelRequest = {
        travel_title: formState.travelTitle.trim(),
        start_date: formState.startDate,
        end_date: formState.endDate,
        total_budget: parseFloat(formState.totalBudget),
        currency: formState.currencyCode,
      };

      // 경고 알림 설정이 있으면 추가
      if (formState.warnType && formState.warnDetailCond.trim()) {
        dataToSend.warn_type = formState.warnType;
        dataToSend.warn_detail_cond = formState.warnDetailCond.trim();
      } else {
        // warnType이 없으면 warn_detail_cond를 '0'으로 설정 (DB NOT NULL 제약조건 대응)
        dataToSend.warn_detail_cond = '0';
      }

      await updateTravel(travelId, dataToSend);
      router.push('/budget');
    } catch (error) {
      alert(error instanceof Error ? error.message : '예산 수정에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTravel(travelId);
      router.push('/budget');
    } catch (error) {
      alert(error instanceof Error ? error.message : '예산 삭제에 실패했습니다.');
    }
  };

  const isDomestic = formState.travelType === 'domestic';
  const isWarningEnabled = formState.warnType !== '';
  const formattedBudget = formState.totalBudget ? parseInt(formState.totalBudget).toLocaleString('ko-KR') : '';
  const formattedStartDate = formState.startDate ? dayjs(formState.startDate).format('YY.MM.DD') : '';
  const formattedEndDate = formState.endDate ? dayjs(formState.endDate).format('YY.MM.DD') : '';

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <TopAreaSub 
          leftIcon={<Image src="/icons/icon-arrow_left-24.svg" alt="뒤로가기" width={24} height={24} />}
          text="예산 상세" 
          onLeftClick={() => router.back()} 
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
        leftIcon={<Image src="/icons/icon-arrow_left-24.svg" alt="뒤로가기" width={24} height={24} />}
        text={formState.travelTitle || '예산 상세'}
        rightElement="삭제"
        onLeftClick={() => router.back()}
        onRightClick={() => setIsDeleteModalOpen(true)}
      />
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col pb-32">
        {/* 예산 금액 */}
        <div className="p-[20px]">
          <input
            name="totalBudget"
            type="text"
            inputMode="numeric"
            className="w-full text-body-1 text-text-primary border-none outline-none bg-transparent placeholder:text-grayscale-400"
            placeholder="예산 금액"
            value={formattedBudget}
            onChange={handleBudgetChange}
            required
          />
        </div>

        {/* 예산명 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">예산명</label>
          <input
            name="travelTitle"
            type="text"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none placeholder:text-grayscale-500"
            placeholder="ex. 스위스 여행"
            value={formState.travelTitle}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 국가 */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
          <label className="text-headline-5 text-button-primary whitespace-nowrap">국가</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('international')}
              className={`px-4 py-3 rounded-full text-body-2 font-medium transition-colors whitespace-nowrap ${
                !isDomestic
                  ? 'bg-[#4A6B87] text-white'
                  : 'bg-[#E0F2F7] text-grayscale-600'
              }`}
            >
              해외
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('domestic')}
              className={`px-4 py-3 rounded-full text-body-2 font-medium transition-colors whitespace-nowrap ${
                isDomestic
                  ? 'bg-[#4A6B87] text-white'
                  : 'bg-[#E0F2F7] text-grayscale-600'
              }`}
            >
              국내
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
            <span className={selectedCurrency ? 'text-body-2 text-text-primary' : 'text-body-2 text-grayscale-500'}>
              {selectedCurrency?.currency_name || '선택해주세요'}
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
            type="button"
            onClick={() => setIsStartDateSheetOpen(true)}
            className="w-full px-4 py-3 border-none rounded-lg flex items-center justify-between bg-white"
          >
            <span className={formattedStartDate && formattedEndDate ? 'text-body-2 text-text-primary' : 'text-body-2 text-grayscale-500'}>
              {formattedStartDate && formattedEndDate
                ? `${formattedStartDate} ~ ${formattedEndDate}`
                : '시작일 ~ 종료일'}
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
            name="content"
            type="text"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none placeholder:text-grayscale-500"
            placeholder="입력해주세요"
            value={formState.content}
            onChange={handleInputChange}
          />
        </div>

        {/* 경고 알림 설정 */}
        <div >
          <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
            <h3 className="text-headline-5 text-button-primary">경고 알림</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleWarnTypeChange('amount')}
                className={`px-4 py-3 rounded-full text-body-2 font-medium transition-colors whitespace-nowrap ${
                  formState.warnType === 'amount'
                    ? 'bg-[#4A6B87] text-white'
                    : 'bg-[#E0F2F7] text-grayscale-600'
                }`}
              >
                금액 기준
              </button>
              <button
                type="button"
                onClick={() => handleWarnTypeChange('percent')}
                className={`px-4 py-3 rounded-full text-body-2 font-medium transition-colors whitespace-nowrap ${
                  formState.warnType === 'percent'
                    ? 'bg-[#4A6B87] text-white'
                    : 'bg-[#E0F2F7] text-grayscale-600'
                }`}
              >
                비율 기준
              </button>
            </div>
          </div>

          {isWarningEnabled && (
            <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-[20px] py-[21px]">
              <label className="text-headline-5 text-button-primary whitespace-nowrap">
                알림 {formState.warnType === 'amount' ? '금액' : '비율'}
              </label>
              <input
                name="warnDetailCond"
                type="text"
                className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none placeholder:text-grayscale-500"
                placeholder={formState.warnType === 'amount' ? '경고 금액을 입력하세요 (예: 10000)' : '경고 비율을 입력하세요 (예: 80)'}
                value={formState.warnDetailCond}
                onChange={handleInputChange}
                required={isWarningEnabled}
              />
            </div>
          )}
        </div>

        {/* 통화 선택 바텀시트 */}
        <CurrencySelectBottomSheet
          isOpen={isCurrencySheetOpen}
          onClose={() => setIsCurrencySheetOpen(false)}
          currencies={availableCurrencies}
          selectedCurrencyNumber={formState.currencyCode}
          onSelect={handleCurrencyChange}
        />

        {/* 시작일 선택 바텀시트 */}
        <DateSelectBottomSheet
          isOpen={isStartDateSheetOpen}
          onClose={() => setIsStartDateSheetOpen(false)}
          selectedDate={formState.startDate}
          onSelect={handleStartDateSelect}
          title="시작일 선택"
        />

        {/* 종료일 선택 바텀시트 */}
        <DateSelectBottomSheet
          isOpen={isEndDateSheetOpen}
          onClose={() => setIsEndDateSheetOpen(false)}
          selectedDate={formState.endDate || formState.startDate}
          onSelect={handleEndDateSelect}
          title="종료일 선택"
        />

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 flex gap-[8px] p-[20px] border-t border-grayscale-300 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
          <Link
            href="/budget"
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
        title="예산 내역 삭제"
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
