'use client';

import React, {useMemo, useState} from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import {Travel} from '@/types/travel';
import BudgetCard from '@/component/budget/BudgetCard';
import BottomTabBar from '@/component/bottom/BottomTabBar';

const BudgetPage: React.FC = () => {
  // NOTE: 화면 UI 확인용 목데이터 (API 연동 전)
  // API 연동 버전(주석):
  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchTravels = async () => {
  //     try {
  //       const res = await fetch('/api/travel', { cache: 'no-store' });
  //       if (!res.ok) throw new Error('failed');
  //       const data: { travels: Travel[] } = await res.json();
  //       if (isMounted) setTravels(data.travels);
  //     } catch (_e) {
  //       if (isMounted) {
  //         setTravels([]);
  //       }
  //     }
  //   };
  //   fetchTravels();
  //   return () => { isMounted = false; };
  // }, []);

  const mockTravels: Travel[] = [
    {
      travel_id: 1,
      travel_title: '스위스여행',
      start_date: '2025-07-01',
      end_date: '2025-07-20',
      total_budget: 5000000,
      total_spent: 2150000,
      warn_type: 'amount',
      warn_detail_cond: '',
      currency: 1,
      expense: [{ amount: 10000 }, { amount: 20000 }],
    },
    {
      travel_id: 2,
      travel_title: '새 노트북 구매',
      start_date: '2025-10-01',
      end_date: '2025-10-31',
      total_budget: 1800000,
      total_spent: 500000,
      warn_type: 'percent',
      warn_detail_cond: '80%',
      currency: 1,
      expense: [{ amount: 500000 }],
    },
  ];

  const [travels] = useState<Travel[]>(mockTravels);
  const hasData = useMemo(() => travels.length > 0, [travels]);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        {hasData && travels!.map((t) => (
          <BudgetCard key={t.travel_id} budget={t} />
        ))}
      </main>
      <Link href="/budget/new" className={styles.floatingButton} aria-label="add-budget">
        <span className={styles.floatingIconText}>➕</span>
      </Link>
      <BottomTabBar />
    </div>
  );
};

export default BudgetPage;


