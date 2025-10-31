import {
  PostTravelRequest,
  PutTravelRequest,
  ApiGetTravelsResponse,
  ApiCreateTravelResponse,
  ApiGetTravelResponse,
  ApiUpdateTravelResponse,
  ApiDeleteTravelResponse,
  Travel,
} from '@/types/travel';
import { CurrencyCode } from '@/types/travel';

function generateDummyTravels(): Travel[] {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  return [
    {
      travel_id: 1,
      travel_title: '스위스 여행',
      start_date: '2025-07-01',
      end_date: '2025-07-20',
      total_budget: 5000000,
      warn_type: 'amount',
      warn_detail_cond: '10000',
      currency: CurrencyCode.KRW,
      expense: [],
      total_spent: 0,
    },
    {
      travel_id: 2,
      travel_title: '일본 여행',
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      total_budget: 3000000,
      warn_type: 'percent',
      warn_detail_cond: '80',
      currency: CurrencyCode.JPY,
      expense: [],
      total_spent: 0,
    },
    {
      travel_id: 3,
      travel_title: '미국 여행',
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      total_budget: 4000000,
      warn_type: 'amount',
      warn_detail_cond: '50000',
      currency: CurrencyCode.USD,
      expense: [],
      total_spent: 0,
    },
  ];
}

export async function getTravels(): Promise<ApiGetTravelsResponse> {
  const res = await fetch('/api/travel', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('예산 목록 조회에 실패했습니다.');
  }
  return res.json();
}

export async function getTravelsForExpense(): Promise<ApiGetTravelsResponse> {
  const dummyTravels = generateDummyTravels();
  return { travels: dummyTravels };
}

export async function createTravel(data: PostTravelRequest): Promise<ApiCreateTravelResponse> {
  const res = await fetch('/api/travel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '예산 추가에 실패했습니다.' }));
    throw new Error(error.error || '예산 추가에 실패했습니다.');
  }

  return res.json();
}

export async function getTravel(travelId: number): Promise<ApiGetTravelResponse> {
  const res = await fetch(`/api/travel/${travelId}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('예산 상세 조회에 실패했습니다.');
  }
  return res.json();
}

export async function updateTravel(travelId: number, data: PutTravelRequest): Promise<ApiUpdateTravelResponse> {
  const res = await fetch(`/api/travel/${travelId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '예산 수정에 실패했습니다.' }));
    throw new Error(error.error || '예산 수정에 실패했습니다.');
  }

  return res.json();
}

export async function deleteTravel(travelId: number): Promise<ApiDeleteTravelResponse> {
  const res = await fetch(`/api/travel/${travelId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '예산 삭제에 실패했습니다.' }));
    throw new Error(error.error || '예산 삭제에 실패했습니다.');
  }

  return res.json();
}
