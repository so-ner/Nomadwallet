'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TopAreaSub from '@/component/top_area/TopAreaSub';

export default function StatisticsPage() {
  const router = useRouter();
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        // TODO: API 호출하여 통계 데이터 불러오기
        // const currentDate = new Date();
        // const year = currentDate.getFullYear();
        // const month = currentDate.getMonth() + 1;
        // const response = await fetch(`/api/statistics?year=${year}&month=${month}`);
        // const data = await response.json();
        // setStatistics(data);
        setStatistics(null); // 임시로 null
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error);
        setStatistics(null);
      } finally {
        setLoading(false);
      }
    };
    loadStatistics();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/expense');
    }
  };

  const hasData = statistics !== null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        text="주간 소비 리포트"
        onBack={handleBack}
      />
      
      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-body-2 text-grayscale-600">로딩 중...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center pt-40 px-4 pb-12 text-center">
            <div className="mb-8 flex items-center justify-center">
              <Image
                src="/empty-alirm.png"
                alt="소비 내역 없음"
                width={200}
                height={200}
                priority
                className="grayscale"
              />
            </div>
            <h2 className="text-headline-1 text-grayscale-600 mt-[32px] mb-2">소비 내역이 없어요</h2>
            <p className="text-body-3 text-grayscale-600 mt-[12px]">소비 내역을 추가해 지출을 스마트하게 관리해볼까요?</p>
          </div>
        ) : (
          <div className="p-4">
            {/* TODO: 통계 데이터 렌더링 */}
            <div className="p-4">
              {/* 통계 내용 */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

