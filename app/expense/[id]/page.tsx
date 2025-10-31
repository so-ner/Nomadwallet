'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import styles from '../new/page.module.css';
import { getExpense, deleteExpense } from '@/lib/api/expense';
import { getTravelsForExpense } from '@/lib/api/travel';
import { Expense } from '@/types/expense';
import { CurrencyCode } from '@/types/travel';

const CURRENCY_MAP: Record<number, string> = {
  [CurrencyCode.KRW]: 'KRW',
  [CurrencyCode.JPY]: 'JPY',
  [CurrencyCode.USD]: 'USD',
};

export default function ExpenseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const expenseId = Number(params?.id);

  const [expense, setExpense] = useState<Expense | null>(null);
  const [travelTitle, setTravelTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [{ expense: data }, { travels }] = await Promise.all([
          getExpense(expenseId),
          getTravelsForExpense(),
        ]);
        if (mounted) {
          setExpense(data);
          if (data.travel_id) {
            const travel = travels.find((t) => t.travel_id === data.travel_id);
            setTravelTitle(travel?.travel_title || null);
          }
        }
      } catch (error) {
        console.error('지출 상세 조회 실패:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [expenseId]);

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await deleteExpense(expenseId);
      router.push('/expense');
    } catch (error) {
      alert(error instanceof Error ? error.message : '지출 삭제에 실패했습니다.');
    }
  };

  if (loading || !expense) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>지출 상세</span>
        <div className={styles.headerActions}>
          <Link href={`/expense/${expenseId}/edit`} className={styles.editButton}>
            수정
          </Link>
          <button onClick={handleDelete} className={styles.deleteButton}>
            삭제
          </button>
        </div>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.formHeader}>지출 상세</h2>

        <button type="button" className={styles.uploadButton} disabled>
          영수증 사진 업로드
        </button>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>날짜</label>
          <div className={styles.displayValue}>{expense.expense_date}</div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>카테고리</label>
          <div className={styles.displayValue}>{expense.category}</div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>금액</label>
          <div className={styles.displayValue}>
            {expense.amount.toLocaleString('ko-KR')} {CURRENCY_MAP[expense.currency] || ''}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>예산</label>
          <div className={styles.displayValue}>
            {travelTitle || (expense.travel_id ? `예산 ID: ${expense.travel_id}` : '없음')}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>통화</label>
          <div className={styles.displayValue}>
            {CURRENCY_MAP[expense.currency] || expense.currency}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>환율</label>
          <div className={styles.displayValue}>
            {expense.exchange_rate ? expense.exchange_rate.toLocaleString('ko-KR') : '없음'}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>메모</label>
          <div className={styles.displayValue}>없음</div>
        </div>
      </div>
    </div>
  );
}

