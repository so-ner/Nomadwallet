"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import styles from '../new/page.module.css';
import { deleteTravel, getTravel } from '@/lib/api/travel';
import { WarnType } from '@/types/travel';

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const travelId = Number(params?.id);

  const [detail, setDetail] = useState<{
    travel_title: string;
    start_date: string;
    end_date: string;
    total_budget: number;
    currency: number;
    warn_type?: WarnType;
    warn_detail_cond?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await getTravel(travelId);
        if (mounted && data) {
          setDetail({
            travel_title: data.travel_title,
            start_date: data.start_date,
            end_date: data.end_date,
            total_budget: Number(data.total_budget),
            currency: Number((data as any).currency ?? 1),
            warn_type: (data as any).warn_type as WarnType,
            warn_detail_cond: (data as any).warn_detail_cond,
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [travelId]);

  const onDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      // 실제 삭제 API 호출
      await deleteTravel(travelId);
      router.push('/budget');
    } catch (e) {
      router.push('/budget');
    }
  };

  if (loading || !detail) return <div className={styles.container}>로딩중...</div>;

  const currencyText = detail.currency === 1 ? '원화' : detail.currency === 2 ? '엔화' : detail.currency === 3 ? '달러' : '통화';

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <span style={{ padding: '0.5rem 0.75rem' }}>상세</span>
          <Link href={`/budget/${travelId}/edit`} style={{ background: '#eef', padding: '0.5rem 0.75rem', borderRadius: 12 }}>수정</Link>
          <button onClick={onDelete} style={{ background: '#ef4444', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: 12 }}>삭제</button>
        </div>

        <h2 className={styles.formHeader}>기본 정보</h2>
        <div style={{ color: '#6b7280', lineHeight: 1.9 }}>
          <div>제목 : {detail.travel_title}</div>
          <div>{detail.start_date} ~ {detail.end_date}</div>
          <div>통화 : {currencyText}</div>
          <div>예산 금액 : {detail.total_budget.toLocaleString('ko-KR')}원</div>
          <div>경고 알림 설정 : {detail.warn_type ? (detail.warn_type === 'amount' ? '금액 기준' : '비율 기준') : '설정 안 함'}</div>
          {detail.warn_type && (
            <div>경고 알림 금액 : {String(detail.warn_detail_cond ?? '').toLocaleString('ko-KR')}원</div>
          )}
        </div>
      </div>
      <Link href="#" className={styles.bottomPrimaryButton}>지출 입력 바로가기 버튼</Link>
    </div>
  );
}


