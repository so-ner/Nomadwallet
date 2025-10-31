'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/budget/page.module.css';
import {Travel} from '@/types/travel';
import { deleteTravel } from '@/lib/api/travel';

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
  const colorClass = percentage > 80 ? styles.progressBarRed : percentage > 50 ? styles.progressBarYellow : styles.progressBarGreen;
  const width = Math.min(100, Math.max(0, percentage));

  return (
    <div className={styles.progressBarContainer}>
      <div className={`${styles.progressBarFill} ${colorClass}`} style={{ width: `${width}%` }}></div>
    </div>
  );
};

const formatCurrency = (amount: number): string => amount.toLocaleString('ko-KR') + '원';

const BudgetCard: React.FC<{ budget: Travel }> = ({ budget }) => {
  const percentage = budget.total_budget > 0 ? (budget.total_spent / budget.total_budget) * 100 : 0;

  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await deleteTravel(budget.travel_id);
      router.refresh();
    } catch (e) {
      router.refresh();
    }
  };

  return (
    <div className={styles.budgetCard}>
      <Link href={`/budget/${budget.travel_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <h2 className={`${styles.cardTitle} ${styles.textGray800}`}>{budget.travel_title || '제목'}</h2>

        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <span className={styles.iconText}>🗓️</span>
            <span>{`${budget.start_date} ~ ${budget.end_date}`}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.iconText}>⚡</span>
            <span className={`${styles.textGreen600} ${styles.fontSemibold}`}>{formatCurrency(budget.total_budget)}</span>
          </div>
        </div>

        <div className={styles.usageStatus}>
          <p className={styles.statusText}>{formatCurrency(budget.total_spent)} 사용됨 ({percentage.toFixed(0)}%)</p>
          <ProgressBar percentage={percentage} />
        </div>
      </Link>

      <div className={styles.actionButtonsContainer}>
        <Link className={styles.btnMain} href={`/budget/${budget.travel_id}`}>지출 입력 바로가기</Link>
        <Link className={`${styles.btnIcon} ${styles.btnGray}`} href={`/budget/${budget.travel_id}/edit`}>수정</Link>
        <button className={`${styles.btnIcon} ${styles.btnRed}`} onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
};

export default BudgetCard;


