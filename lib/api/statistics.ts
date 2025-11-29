import { apiFetch } from './fetch';

export interface WeeklyStatistics {
  week: number;
  period: string;
  income: number;
  expense: number;
}

export interface StatisticsResponse {
  totalExpense: number;
  weeks: WeeklyStatistics[];
}

export interface CategoryStatistics {
  category: string;
  amount: number;
}

export interface CategoryStatisticsResponse {
  categories: CategoryStatistics[];
  total: number;
}

/**
 * 주간 소비 통계 조회
 */
export async function getWeeklyStatistics(
  year: number,
  month: number
): Promise<StatisticsResponse> {
  const res = await apiFetch(`/api/statistics?year=${year}&month=${month}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('주간 소비 통계 조회에 실패했습니다.');
  }
  
  return res.json();
}

/**
 * 카테고리별 지출 통계 조회
 */
export async function getCategoryStatistics(
  startDate: string,
  endDate: string,
  travelId?: number
): Promise<CategoryStatisticsResponse> {
  let url = `/api/category?start_date=${startDate}&end_date=${endDate}`;
  if (travelId) {
    url += `&travel_id=${travelId}`;
  }
  
  const res = await apiFetch(url, { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('카테고리별 지출 통계 조회에 실패했습니다.');
  }
  
  return res.json();
}

