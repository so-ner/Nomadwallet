'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { PostTravelRequest, WarnType } from '@/types/travel';
import { createTravel } from '@/lib/api/travel';
// 목록 페이지에서만 탭바를 보여주기 위해 추가 페이지에서는 탭바를 사용하지 않습니다.

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
  { code: 1, name: '원화', display: '원화 (KRW)', symbol: 'KRW' },
  { code: 2, name: '엔화', display: '엔화 (JPY)', symbol: 'JPY' },
  { code: 3, name: '달러', display: '달러 (USD)', symbol: 'USD' },
];

export default function AddBudgetPage() {
  const router = useRouter();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setFormState((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 추출 (콤마 제거 후 숫자만)
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setFormState((prev) => ({ ...prev, totalBudget: numericValue }));
  };

  const handleTypeChange = (type: TravelType) => {
    setFormState((prev) => ({
      ...prev,
      travelType: type,
      currencyCode: type === 'domestic' ? 1 : 2,
    }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    setFormState((prev) => ({ ...prev, currencyCode: code }));
  };

  const handleWarnTypeChange = (type: WarnType) => {
    const currentWarnType = formState.warnType;
    if (currentWarnType === type) {
      // 같은 버튼 클릭 시 선택 해제
      setFormState((prev) => ({
        ...prev,
        warnType: '',
        warnDetailCond: '',
      }));
    } else {
      // 다른 버튼 클릭 시 해당 타입 선택
      setFormState((prev) => ({
        ...prev,
        warnType: type,
        warnDetailCond: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend: PostTravelRequest = {
        travel_title: formState.travelTitle,
        start_date: formState.startDate,
        end_date: formState.endDate,
        total_budget: parseFloat(formState.totalBudget) || 0,
        currency: formState.currencyCode,
      };

      if (formState.warnType !== '') {
        dataToSend.warn_type = formState.warnType;
        if (formState.warnDetailCond) {
          dataToSend.warn_detail_cond = formState.warnDetailCond;
        }
      }

      await createTravel(dataToSend);
      router.push('/budget');
    } catch (error) {
      alert(error instanceof Error ? error.message : '예산 추가에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  const isDomestic = formState.travelType === 'domestic';
  const isWarningEnabled = formState.warnType !== '';

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2 className={styles.formHeader}>예산 추가 {isDomestic ? '[국내]' : '[해외]'}</h2>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="travelTitle">
            여행명
          </label>
          <input
            id="travelTitle"
            name="travelTitle"
            type="text"
            className={styles.input}
            placeholder="Ex. 스위스여행"
            value={formState.travelTitle}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>여행 날짜</label>
          <div className={styles.dateRangeContainer}>
            <input
              type="date"
              className={styles.dateInput}
              value={formState.startDate}
              onChange={(e) => handleDateRangeChange(e.target.value, formState.endDate)}
              required
            />
            <span className={styles.dateSeparator}>~</span>
            <input
              type="date"
              className={styles.dateInput}
              value={formState.endDate}
              onChange={(e) => handleDateRangeChange(formState.startDate, e.target.value)}
              min={formState.startDate}
              required
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="totalBudget">
            예산 금액
          </label>
          <input
            id="totalBudget"
            name="totalBudget"
            type="text"
            inputMode="numeric"
            className={styles.input}
            value={formState.totalBudget ? parseInt(formState.totalBudget).toLocaleString('ko-KR') : ''}
            onChange={handleBudgetChange}
            placeholder="총 예산 금액을 입력하세요"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>국내/해외</label>
          <div className={styles.radioGroup}>
            <input
              id="domestic"
              name="travelType"
              type="radio"
              className={styles.radioInput}
              checked={isDomestic}
              onChange={() => handleTypeChange('domestic')}
            />
            <label htmlFor="domestic" className={`${styles.radioLabel} ${isDomestic ? styles.checked : ''}`}>
              국내
            </label>

            <input
              id="international"
              name="travelType"
              type="radio"
              className={styles.radioInput}
              checked={!isDomestic}
              onChange={() => handleTypeChange('international')}
            />
            <label htmlFor="international" className={`${styles.radioLabel} ${!isDomestic ? styles.checked : ''}`}>
              해외
            </label>
          </div>
        </div>

        <div className={`${styles.fieldGroup} ${styles.currencyGroup}`}>
          <label className={styles.label} htmlFor="currency">
            통화
          </label>
          <select
            id="currency"
            name="currency"
            className={`${styles.input} ${styles.currencySelect}`}
            value={formState.currencyCode}
            onChange={handleCurrencyChange}
            disabled={isDomestic}
          >
            {isDomestic ? (
              <option value={1}>원화</option>
            ) : (
              CURRENCY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {`${option.code} (${option.name})`}
                </option>
              ))
            )}
          </select>
        </div>

        <div className={styles.warningSetting}>
          <h3 className={styles.warningHeader}>경고 알림 설정 [선택]</h3>
          <div className={styles.warningTypeGroup}>
            <input
              id="warnAmount"
              name="warnType"
              type="radio"
              className={styles.radioInput}
              checked={formState.warnType === 'amount'}
              onChange={() => handleWarnTypeChange('amount')}
            />
            <label htmlFor="warnAmount" className={`${styles.radioLabel} ${formState.warnType === 'amount' ? styles.checked : ''}`}>
              금액 기준
            </label>

            <input
              id="warnPercent"
              name="warnType"
              type="radio"
              className={styles.radioInput}
              checked={formState.warnType === 'percent'}
              onChange={() => handleWarnTypeChange('percent')}
            />
            <label htmlFor="warnPercent" className={`${styles.radioLabel} ${formState.warnType === 'percent' ? styles.checked : ''}`}>
              비율 기준
            </label>
          </div>

          <ul className={styles.warningDescription}>
            <li>• 금액 기준 (Ex. 1만원 이하 남았을 때)</li>
            <li>• 비율 기준 (Ex. 80% 이상 사용 시)</li>
          </ul>

          {isWarningEnabled && (
            <div className={`${styles.fieldGroup} ${styles.warningInput}`}>
              <label className={styles.label} htmlFor="warnDetailCond">
                경고 알림 {formState.warnType === 'amount' ? '금액' : '비율'}
              </label>
              <input
                id="warnDetailCond"
                name="warnDetailCond"
                type="text"
                className={styles.input}
                placeholder={formState.warnType === 'amount' ? '경고 금액을 입력하세요 (예: 10000)' : '경고 비율을 입력하세요 (예: 80)'}
                value={formState.warnDetailCond}
                onChange={handleInputChange}
                required={isWarningEnabled}
              />
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? '처리 중...' : '예산 추가하기'}
        </button>
      </form>
      {/* 추가 페이지에서는 하단 탭바를 표시하지 않음 */}
    </div>
  );
}
