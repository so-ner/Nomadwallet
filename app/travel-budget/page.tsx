'use client';

import React, {useState} from 'react';
import styles from './page.module.css';
import {Travel} from "@/types/travel";

const initialTravels: Travel[] = [
  {
    travel_id: 1,
    travel_title: "스위스여행",
    start_date: "2025-07-01",
    end_date: "2025-07-20",
    total_budget: 5000000,
    total_spent: 2150000,
    warn_type: "amount",
    warn_detail_cond: "",
    currency: 1,
    expense: [{amount: 10000}, {amount: 20000}]
  },
  {
    travel_id: 2,
    travel_title: "새 노트북 구매",
    start_date: "2025-10-01",
    end_date: "2025-10-31",
    total_budget: 1800000,
    total_spent: 500000,
    warn_type: "percent",
    warn_detail_cond: "80%",
    currency: 1,
    expense: [{amount: 500000}]
  },
];

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR') + '원';
};

const BudgetListClient: React.FC<{ initialTravels: Travel[] }> = ({initialTravels}) => {
  const [travels, setTravels] = useState<Travel[]>(initialTravels);

  const ProgressBar: React.FC<{ percentage: number }> = ({percentage}) => {
    const colorClass = percentage > 80 ? styles.progressBarRed : percentage > 50 ? styles.progressBarYellow : styles.progressBarGreen;
    const width = Math.min(100, percentage);

    return (
      <div className={styles.progressBarContainer}>
        <div
          className={`${styles.progressBarFill} ${colorClass}`}
          style={{width: `${width}%`}}
        ></div>
      </div>
    );
  };


  const BudgetCard: React.FC<{ budget: Travel }> = ({budget}) => {
    // budget.spent_amount 대신 budget.total_spent를 사용
    const percentage = budget.total_budget > 0 ? (budget.total_spent / budget.total_budget) * 100 : 0;

    return (
      <div className={`${styles.budgetCard} ${styles.budgetCardNormal}`}>
        <h2
          className={`${styles.cardTitle} ${styles.textGray800}`}>{budget.travel_title || '제목'}</h2>

        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <span className={styles.iconText}>🗓️</span>
            <span>{`${budget.start_date} ~ ${budget.end_date}`}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.iconText}>⚡</span>
            <span
              className={`${styles.budgetAmount} ${styles.textGreen600} ${styles.fontSemibold}`}>{formatCurrency(budget.total_budget)}</span>
          </div>
        </div>

        <div className={styles.usageStatus}>
          <p className={styles.statusText}>
            {/* spent_amount 대신 total_spent 사용 */}
            {formatCurrency(budget.total_spent)} 사용됨 ({percentage.toFixed(0)}%)
          </p>
          <ProgressBar percentage={percentage}/>
        </div>

        <div className={styles.actionButtonsContainer}>
          <button className={styles.btnMain}>
            지출 입력 바로가기
          </button>
          <button className={`${styles.btnIcon} ${styles.btnGray}`}>
            수정
          </button>
          <button className={`${styles.btnIcon} ${styles.btnRed}`}>
            삭제
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <main className={styles.mainContent}>
        {travels.map((travel) => (
          <BudgetCard key={travel.travel_id} budget={travel}/>
        ))}
      </main>
      <button className={styles.floatingButton}>
        <span className={styles.floatingIconText}>➕</span>
      </button>
    </div>
  );
};


export default function Home() {
  return (
    // initialBudgets 대신 initialTravels를 prop으로 전달
    <BudgetListClient initialTravels={initialTravels}/>
  );
}