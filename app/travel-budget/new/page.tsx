"use client";

import React, {useState} from 'react';
import styles from './page.module.css';
import {PostTravelRequest, WarnType} from "@/types/travel";

type TravelType = 'domestic' | 'international';

interface TravelFormState {
  travelType: TravelType;
  travelTitle: string;
  startDate: string;
  endDate: string;
  totalBudget: string;
  currencyCode: number;
  warnType: WarnType | '';
  warnDetailCond?: string | '';
}

const CURRENCY_MAP: { [key: number]: string } = {
  1: '원화 (KRW)',
  2: '엔 (JPY)',
  3: '달러 (USD)',
  4: '유로 (EUR)',
};
const INTERNATIONAL_CODES: number[] = [2, 3, 4];


export default function AddBudgetForm() {
  const [formState, setFormState] = useState<TravelFormState>({
    travelType: 'domestic',
    travelTitle: '',
    startDate: '2025-07-01',
    endDate: '2025-07-20',
    totalBudget: '',
    currencyCode: 1,
    warnType: '',
    warnDetailCond: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormState(prev => ({...prev, [name]: value}));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    setFormState(prev => ({...prev, currencyCode: code}));
  };

  const handleTypeChange = (type: TravelType) => {
    const newCurrencyCode = (type === 'domestic' ? 1 : 2);

    setFormState(prev => ({
      ...prev,
      travelType: type,
      currencyCode: newCurrencyCode,
    }));
  };

  const handleWarnTypeChange = (type: WarnType) => {
    const currentWarnType = formState.warnType;

    if (currentWarnType === type) {
      setFormState(prev => ({
        ...prev,
        warnType: '',
        warnDetailCond: '',
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        warnType: type,
        warnDetailCond: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let dataToSend: PostTravelRequest = {
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

    console.log(dataToSend);
    alert('예산 추가 요청이 전송되었습니다. 콘솔을 확인하세요.');
  };

  const isDomestic = formState.travelType === 'domestic';

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2 className={styles.formHeader}>예산 추가 {isDomestic ? '[국내]' : '[해외]'}</h2>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="travelTitle">여행명</label>
          <input
            id="travelTitle"
            name="travelTitle"
            type="text"
            className={styles.input}
            placeholder="Ex. 스위스여행"
            value={formState.travelTitle}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="startDate">여행 시작 날짜</label>
          <input
            id="startDate"
            name="startDate"
            type="text"
            className={styles.input}
            value={formState.startDate}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="endDate">여행 종료 날짜</label>
          <input
            id="endDate"
            name="endDate"
            type="text"
            className={styles.input}
            value={formState.endDate}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="totalBudget">예산 금액</label>
          <input
            id="totalBudget"
            name="totalBudget"
            type="number"
            className={styles.input}
            value={formState.totalBudget}
            onChange={handleInputChange}
            placeholder="총 예산 금액을 입력하세요"
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
            <label htmlFor="domestic" className={`${styles.radioLabel} ${isDomestic ? styles.checked : ''}`}>국내</label>

            <input
              id="international"
              name="travelType"
              type="radio"
              className={styles.radioInput}
              checked={!isDomestic}
              onChange={() => handleTypeChange('international')}
            />
            <label htmlFor="international"
                   className={`${styles.radioLabel} ${!isDomestic ? styles.checked : ''}`}>해외</label>
          </div>
        </div>

        <div className={`${styles.fieldGroup} ${styles.currencyGroup}`}>
          <label className={styles.label} htmlFor="currency">통화</label>
          <select
            id="currency"
            name="currency"
            className={`${styles.input} ${styles.currencySelect}`}
            value={formState.currencyCode}
            onChange={handleCurrencyChange}
            disabled={isDomestic} // 국내 선택 시 비활성화
          >
            {isDomestic ? (
              <option value={1}>1 ({CURRENCY_MAP[1]})</option>
            ) : (
              INTERNATIONAL_CODES.map(code => (
                <option key={code} value={code}>
                  {code}
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
            <label htmlFor="warnAmount"
                   className={`${styles.radioLabel} ${formState.warnType === 'amount' ? styles.checked : ''}`}>금액
              기준</label>

            <input
              id="warnPercent"
              name="warnType"
              type="radio"
              className={styles.radioInput}
              checked={formState.warnType === 'percent'}
              onChange={() => handleWarnTypeChange('percent')}
            />
            <label htmlFor="warnPercent"
                   className={`${styles.radioLabel} ${formState.warnType === 'percent' ? styles.checked : ''}`}>비율
              기준</label>
          </div>

          <ul className={styles.warningDescription}>
            {formState.warnType === 'amount' && (
              <li>금액 기준 (Ex. 1만원 이하 남았을 때)</li>
            )}
            {formState.warnType === 'percent' && (
              <li>비율 기준 (Ex. 80% 이상 사용 시)</li>
            )}
            {formState.warnType === '' && (
              <li>경고 알림을 설정하지 않습니다.</li>
            )}
          </ul>

          <div className={`${styles.fieldGroup} ${styles.warningInput}`}>
            <label className={styles.label} htmlFor="warnDetailCond">경고
              알림 {formState.warnType === 'amount' ? '금액' : '비율'}</label>
            <input
              id="warnDetailCond"
              name="warnDetailCond"
              type="text"
              className={styles.input}
              placeholder={formState.warnType === 'amount' ? '경고 금액을 입력하세요 (예: 10000)' : '경고 비율을 입력하세요 (예: 80)'}
              value={formState.warnDetailCond}
              onChange={handleInputChange}
              disabled={formState.warnType === ''}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          예산 추가하기
        </button>
      </form>
    </div>
  );
}
