'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import { getWeeklyStatistics, getCategoryStatistics, WeeklyStatistics, CategoryStatistics } from '@/lib/api/statistics';
import dayjs from '@/lib/dayjs';
import { categoryOptions } from '@/types/expense';

export default function StatisticsPage() {
  const router = useRouter();
  const [statistics, setStatistics] = useState<{ totalExpense: number; weeks: WeeklyStatistics[] } | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(dayjs());

  const year = currentDate.year();
  const month = currentDate.month() + 1;

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const stats = await getWeeklyStatistics(year, month);
        
        // 해당 월의 첫날과 마지막날 계산
        const startOfMonth = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
        const endOfMonth = startOfMonth.endOf('month');
        
        // 카테고리 통계 조회
        try {
          const catStats = await getCategoryStatistics(
            startOfMonth.format('YYYY-MM-DD'),
            endOfMonth.format('YYYY-MM-DD')
          );
          setCategoryStats(catStats.categories || []);
        } catch (error) {
          console.error('카테고리 통계 조회 실패:', error);
          setCategoryStats([]);
        }
        
        setStatistics(stats);
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error);
        setStatistics(null);
        setCategoryStats([]);
      } finally {
        setLoading(false);
      }
    };
    loadStatistics();
  }, [year, month]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/expense');
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'));
  };

  // 바 차트의 최대값 계산
  const maxBarValue = useMemo(() => {
    if (!statistics) return 0;
    return Math.max(
      ...statistics.weeks.map(w => Math.max(w.income, w.expense)),
      1
    );
  }, [statistics]);

  // 카테고리 이름 정규화 (세부 카테고리명을 주 카테고리명으로 변환)
  const normalizeCategoryName = useCallback((category: string): string => {
    // 세부 카테고리명이면 주 카테고리명 찾기
    const majorOption = categoryOptions.find(opt => 
      category.includes(opt.label) || opt.label.includes(category)
    );
    if (majorOption) return majorOption.label;
    
    // 이미 주 카테고리명이면 그대로 반환
    const isMajorCategory = categoryOptions.some(opt => opt.label === category);
    if (isMajorCategory) return category;
    
    // 매핑되지 않으면 원본 반환
    return category;
  }, []);

  // 카테고리 통계 정렬 및 비율 계산
  const sortedCategoryStats = useMemo(() => {
    if (!statistics || categoryStats.length === 0) return [];
    
    // 카테고리별로 그룹화 (주 카테고리명으로)
    const grouped: Record<string, number> = {};
    categoryStats.forEach(cat => {
      const normalizedName = normalizeCategoryName(cat.category);
      grouped[normalizedName] = (grouped[normalizedName] || 0) + cat.amount;
    });
    
    const total = Object.values(grouped).reduce((sum, amount) => sum + amount, 0);
    if (total === 0) return [];
    
    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / total) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4); // 상위 4개만 표시
  }, [categoryStats, statistics, normalizeCategoryName]);

  // 카테고리 색상 매핑
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      '식비': '#4A6B87',
      '주거비': '#6B9BD1',
      '고정비': '#8FA8C4',
      '문화생활': '#B8C9D9',
      '교통비': '#4A6B87',
      '생활/쇼핑': '#6B9BD1',
      '기타': '#B8C9D9',
    };
    return categoryMap[category] || '#B8C9D9';
  };

  const hasData = statistics !== null && statistics.weeks && statistics.weeks.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        text="주간 소비 리포트"
        onBack={handleBack}
      />
      
      <main className="flex-1 overflow-y-auto">
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
          <div className="px-[20px] pb-[32px]">
            {/* 월 선택 */}
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                onClick={handlePrevMonth}
                className="p-2"
                aria-label="이전 달"
              >
                <Image
                  src="/icons/icon-arrow_left-24.svg"
                  alt="이전 달"
                  width={24}
                  height={24}
                />
              </button>
              <span className="text-body-2 text-text-primary">{month}월</span>
              <button
                onClick={handleNextMonth}
                className="p-2"
                aria-label="다음 달"
              >
                <Image
                  src="/icons/icon-arrow_right-24.svg"
                  alt="다음 달"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* 총 소비 금액 */}
            {statistics && (
              <div className="text-center py-6">
                <p className="text-body-2 text-grayscale-600 mb-1">총</p>
                <p className="text-headline-1 text-text-primary">
                  <span className="text-[#4A6B87]">{(statistics.totalExpense || 0).toLocaleString('ko-KR')}</span>
                  <span className="text-grayscale-600">원을 소비했어요</span>
                </p>
              </div>
            )}

            {/* 주간 소비 분석 */}
            {statistics && statistics.weeks && (
              <div className="mt-8">
                <h3 className="text-subhead-1 text-text-primary mb-4">주간 소비 분석</h3>
                <div className="bg-grayscale-50 rounded-lg p-4">
                  {/* 바 차트 */}
                  <div className="flex items-end justify-between gap-2 h-[200px] mb-4">
                    {statistics.weeks.map((week) => {
                      const expenseHeight = maxBarValue > 0 ? (week.expense / maxBarValue) * 100 : 0;
                      const incomeHeight = maxBarValue > 0 ? (week.income / maxBarValue) * 100 : 0;
                      const hasData = week.expense > 0 || week.income > 0;
                      
                      return (
                        <div key={week.week} className="flex-1 flex flex-col items-center gap-1 h-full">
                          <div className="flex-1 flex items-end justify-center gap-[2px] w-full relative">
                            {/* 지출 바 (왼쪽) */}
                            {week.expense > 0 ? (
                              <div
                                className="flex-1 bg-[#4A6B87] rounded-t"
                                style={{ height: `${expenseHeight}%`, minHeight: expenseHeight > 0 ? '4px' : '0' }}
                              />
                            ) : hasData ? (
                              <div className="flex-1 h-1 bg-grayscale-300 rounded" />
                            ) : null}
                            
                            {/* 수입 바 (오른쪽) */}
                            {week.income > 0 ? (
                              <div
                                className="flex-1 bg-[#4CAF50] rounded-t"
                                style={{ height: `${incomeHeight}%`, minHeight: incomeHeight > 0 ? '4px' : '0' }}
                              />
                            ) : hasData ? (
                              <div className="flex-1 h-1 bg-grayscale-300 rounded" />
                            ) : null}
                            
                            {/* 데이터가 없을 때 */}
                            {!hasData && (
                              <div className="w-full h-1 bg-grayscale-300 rounded" />
                            )}
                          </div>
                          <span className="text-caption-2 text-grayscale-600 mt-1">{week.week}주</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* 범례 */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#4A6B87] rounded" />
                      <span className="text-caption-2 text-grayscale-600">지출</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#4CAF50] rounded" />
                      <span className="text-caption-2 text-grayscale-600">수입</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 주간 내역 */}
            {statistics && statistics.weeks && (
              <div className="mt-8">
                <h3 className="text-subhead-1 text-text-primary mb-4">주간 내역</h3>
                <div className="space-y-0">
                  {[...statistics.weeks].reverse().map((week) => {
                    // 주간 기간 파싱 (MM.DD~MM.DD 형식)
                    const [startStr, endStr] = week.period.split('~');
                    const [startMonth, startDay] = startStr.split('.');
                    const [endMonth, endDay] = endStr.split('.');
                    
                    const weekStart = dayjs(`${year}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`);
                    const weekEnd = dayjs(`${year}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`);
                    const today = dayjs();
                    const isFuture = today.isBefore(weekStart);
                    
                    return (
                      <div
                        key={week.week}
                        className="flex items-center justify-between py-4 border-b border-grayscale-200 last:border-b-0"
                      >
                        <div className="flex flex-col gap-[2px]">
                          <span className="text-caption-2 text-grayscale-600">{week.period}</span>
                          <span className="text-body-4 font-medium text-text-primary">{week.week}주</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isFuture ? (
                            <span className="text-body-4 text-grayscale-500">예정</span>
                          ) : (
                            <>
                              {week.income > 0 && (
                                <span className="text-body-4 text-[#4CAF50]">
                                  +{week.income.toLocaleString('ko-KR')}원
                                </span>
                              )}
                              {week.expense > 0 && (
                                <span className="text-body-4 text-text-primary">
                                  -{week.expense.toLocaleString('ko-KR')}원
                                </span>
                              )}
                              {week.income === 0 && week.expense === 0 && (
                                <span className="text-body-4 text-grayscale-400">0원</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 주간 소비 카테고리 */}
            {sortedCategoryStats.length > 0 && (
              <div className="mt-8">
                <h3 className="text-subhead-1 text-text-primary mb-4">주간 소비 카테고리</h3>
                <div className="bg-grayscale-50 rounded-lg p-4">
                  {/* 가로 바 차트 */}
                  <div className="flex h-4 bg-grayscale-200 rounded-full overflow-hidden mb-6">
                    {sortedCategoryStats.map((cat, index) => (
                      <div
                        key={cat.category}
                        className="h-full"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: getCategoryColor(cat.category),
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* 카테고리 목록 */}
                  <div className="space-y-3">
                    {sortedCategoryStats.map((cat) => (
                      <div key={cat.category} className="flex items-start gap-3">
                        <div
                          className="w-1 h-4 rounded mt-0.5"
                          style={{ backgroundColor: getCategoryColor(cat.category) }}
                        />
                        <div className="flex-1 flex flex-col gap-[2px]">
                          <span className="text-body-4 font-medium text-text-primary">
                            {cat.category}
                          </span>
                          <span className="text-caption-2 text-grayscale-600">
                            {Math.round(cat.percentage)}%
                          </span>
                        </div>
                        <span className="text-body-4 text-text-primary mt-0.5">
                          -{cat.amount.toLocaleString('ko-KR')}원
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
