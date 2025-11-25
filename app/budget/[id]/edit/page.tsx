'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../new/page.module.css';
import { PutTravelRequest, WarnType } from '@/types/travel';
import { getTravel, updateTravel } from '@/lib/api/travel';

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
}

const CURRENCY_OPTIONS = [
  { code: 1, name: '원화' },
  { code: 2, name: '엔화' },
  { code: 3, name: '달러' },
];

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const travelId = Number(params?.id);

  const [formState, setFormState] = useState<TravelFormState>({
    travelType: 'domestic',
    travelTitle: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    currencyCode: 1,
    warnType: '',
    warnDetailCond: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setFormState((prev) => ({ ...prev, startDate: start, endDate: end }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setFormState((prev) => ({ ...prev, totalBudget: numericValue }));
  };

  const handleTypeChange = (type: TravelType) => {
    setFormState((prev) => ({
      ...prev,
      travelType: type,
      currencyCode: type === 'domestic' ? 1 : prev.currencyCode === 1 ? 2 : prev.currencyCode,
    }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    setFormState((prev) => ({ ...prev, currencyCode: code }));
  };

  const handleWarnTypeChange = (type: WarnType) => {
    setFormState((prev) => ({
      ...prev,
      warnType: prev.warnType === type ? '' : type,
      warnDetailCond: prev.warnType === type ? '' : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: PutTravelRequest = {
        travel_title: formState.travelTitle,
        start_date: formState.startDate,
        end_date: formState.endDate,
        total_budget: parseFloat(formState.totalBudget) || 0,
        currency: formState.currencyCode,
      };
      if (formState.warnType) {
        payload.warn_type = formState.warnType;
        if (formState.warnDetailCond) payload.warn_detail_cond = formState.warnDetailCond;
      }
      await updateTravel(travelId, payload);
      router.push('/budget');
    } catch {
      setIsSubmitting(false);
    }
  };

  // 상세 조회로 초기값 로드
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { travel } = await getTravel(travelId);
        if (mounted && travel) {
          setFormState({
            travelType: travel.currency === 1 ? 'domestic' : 'international',
            travelTitle: travel.travel_title,
            startDate: travel.start_date,
            endDate: travel.end_date,
            totalBudget: String(travel.total_budget ?? ''),
            currencyCode: travel.currency ?? 1,
            warnType: (travel as any).warn_type ?? '',
            warnDetailCond: (travel as any).warn_detail_cond ?? '',
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [travelId]);

  const isDomestic = formState.travelType === 'domestic';
  const isWarningEnabled = formState.warnType !== '';

  if (loading) return <div className={styles.container}>로딩중...</div>;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2 className={styles.formHeader}>예산 수정 {isDomestic ? '[국내]' : '[해외]'}</h2>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="travelTitle">여행명</label>
          <input id="travelTitle" name="travelTitle" type="text" className={styles.input} value={formState.travelTitle} onChange={handleInputChange} required />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>여행 날짜</label>
          <div className={styles.dateRangeContainer}>
            <input type="date" className={styles.dateInput} value={formState.startDate} onChange={(e) => handleDateRangeChange(e.target.value, formState.endDate)} required />
            <span className={styles.dateSeparator}>~</span>
            <input type="date" className={styles.dateInput} value={formState.endDate} min={formState.startDate} onChange={(e) => handleDateRangeChange(formState.startDate, e.target.value)} required />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="totalBudget">예산 금액</label>
          <input id="totalBudget" name="totalBudget" type="text" inputMode="numeric" className={styles.input} value={formState.totalBudget ? parseInt(formState.totalBudget).toLocaleString('ko-KR') : ''} onChange={handleBudgetChange} required />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>국내/해외</label>
          <div className={styles.radioGroup}>
            <input id="domestic" name="travelType" type="radio" className={styles.radioInput} checked={isDomestic} onChange={() => handleTypeChange('domestic')} />
            <label htmlFor="domestic" className={`${styles.radioLabel} ${isDomestic ? 'checked' : ''}`}>국내</label>
            <input id="international" name="travelType" type="radio" className={styles.radioInput} checked={!isDomestic} onChange={() => handleTypeChange('international')} />
            <label htmlFor="international" className={`${styles.radioLabel} ${!isDomestic ? 'checked' : ''}`}>해외</label>
          </div>
        </div>

        <div className={`${styles.fieldGroup} ${styles.currencyGroup}`}>
          <label className={styles.label} htmlFor="currency">통화</label>
          <select id="currency" name="currency" className={`${styles.input} ${styles.currencySelect}`} value={formState.currencyCode} onChange={handleCurrencyChange} disabled={isDomestic}>
            {isDomestic ? (
              <option value={1}>원화</option>
            ) : (
              CURRENCY_OPTIONS.map((o) => <option key={o.code} value={o.code}>{`${o.code} (${o.name})`}</option>)
            )}
          </select>
        </div>

        <div className={styles.warningSetting}>
          <h3 className={styles.warningHeader}>경고 알림 설정 [선택]</h3>
          <div className={styles.warningTypeGroup}>
            <input id="warnAmount" name="warnType" type="radio" className={styles.radioInput} checked={formState.warnType === 'amount'} onChange={() => handleWarnTypeChange('amount')} />
            <label htmlFor="warnAmount" className={`${styles.radioLabel} ${formState.warnType === 'amount' ? 'checked' : ''}`}>금액 기준</label>
            <input id="warnPercent" name="warnType" type="radio" className={styles.radioInput} checked={formState.warnType === 'percent'} onChange={() => handleWarnTypeChange('percent')} />
            <label htmlFor="warnPercent" className={`${styles.radioLabel} ${formState.warnType === 'percent' ? 'checked' : ''}`}>비율 기준</label>
          </div>
          {formState.warnType !== '' && (
            <div className={`${styles.fieldGroup} ${styles.warningInput}`}>
              <label className={styles.label} htmlFor="warnDetailCond">경고 알림 {formState.warnType === 'amount' ? '금액' : '비율'}</label>
              <input id="warnDetailCond" name="warnDetailCond" type="text" className={styles.input} value={formState.warnDetailCond} onChange={handleInputChange} required />
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? '처리 중...' : '예산 수정하기'}</button>
      </form>
    </div>
  );
}


