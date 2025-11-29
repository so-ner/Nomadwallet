import { CategorySub, CategoryMajor, InsertCategorySub } from '@/types/expense';
import { apiFetch } from './fetch';

// 주 카테고리별 기본 세부 카테고리 정의
const defaultCategorySubs: Record<CategoryMajor, string[]> = {
  FOOD: ['외식', '간식', '장보기'],
  HOUSING: ['월세', '관리비', '공과금'],
  FIXED: ['보험', '통신비'],
  SAVINGS_INVESTMENT: [],
  TRANSPORTATION: ['대중교통', '택시', '유류비', '자동차 정비'],
  LIVING_SHOPPING: ['생필품', '의류', '가전', '화장품'],
  ENTERTAINMENT: ['영화', '여행', '책', '강의', '모임'],
  OTHERS: ['경조사', '선물', '기타'],
};

export interface Category {
  id: string;
  name: string;
}

export interface ApiGetCategoriesResponse {
  categories: Category[];
}

export async function getCategories(): Promise<ApiGetCategoriesResponse> {
  const categories: Category[] = [
    { id: '1', name: '음식점' },
    { id: '2', name: '교통' },
    { id: '3', name: '숙박' },
    { id: '4', name: '식사' },
    { id: '5', name: '쇼핑' },
    { id: '6', name: '카페/간식' },
    { id: '7', name: '문화/여가' },
    { id: '8', name: '기타' },
  ];

  return { categories };
}

// 기본 카테고리인지 확인하는 헬퍼 함수
export function isDefaultCategorySub(sub: CategorySub): boolean {
  return sub.sub_id < 0;
}

// 소분류 카테고리 API
export async function getCategorySubs(major: CategoryMajor): Promise<CategorySub[]> {
  const res = await apiFetch(`/api/category/sub?major=${major}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('소분류 카테고리 조회에 실패했습니다.');
  }
  const userSubs = await res.json() || [];
  
  // 기본 세부 카테고리 생성
  const defaultSubs = defaultCategorySubs[major] || [];
  const defaultCategorySubsList: CategorySub[] = defaultSubs.map((subName, index) => ({
    sub_id: -(index + 1), // 음수 ID로 기본값임을 표시
    user_id: 0, // 기본 카테고리는 user_id를 0으로 설정
    major: major,
    sub_name: subName,
    created_at: '',
    updated_at: '',
  })) as CategorySub[];
  
  // 기본 카테고리 먼저, 그 다음 유저 카테고리 순서로 반환
  return [...defaultCategorySubsList, ...userSubs];
}

export async function createCategorySub(data: Omit<InsertCategorySub, 'user_id' | 'created_at' | 'updated_at' | 'sub_id'>): Promise<CategorySub> {
  const res = await apiFetch('/api/category/sub', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '소분류 카테고리 추가에 실패했습니다.' }));
    throw new Error(error.error || '소분류 카테고리 추가에 실패했습니다.');
  }

  const result = await res.json();
  // ambiguous 에러로 인해 success 메시지만 반환된 경우 처리
  if (result.success) {
    // 성공했지만 데이터는 없음, 클라이언트에서 새로고침 필요
    // 임시로 빈 객체를 반환하되, 클라이언트에서 새로고침하도록 함
    // 실제로는 insert가 성공했으므로 성공으로 처리
    return result as unknown as CategorySub;
  }
  return result;
}

export async function updateCategorySub(subId: number, subName: string): Promise<CategorySub> {
  const res = await apiFetch(`/api/category/sub/${subId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sub_name: subName }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '소분류 카테고리 수정에 실패했습니다.' }));
    throw new Error(error.error || '소분류 카테고리 수정에 실패했습니다.');
  }

  const result = await res.json();
  // ambiguous 에러로 인해 success 메시지만 반환된 경우 처리
  if (result.success) {
    // 성공했지만 데이터는 없음, 클라이언트에서 새로고침 필요
    // 임시로 빈 객체를 반환하되, 클라이언트에서 새로고침하도록 함
    // 실제로는 update가 성공했으므로 성공으로 처리
    return result as unknown as CategorySub;
  }
  return result;
}

export async function deleteCategorySub(subId: number): Promise<void> {
  const res = await apiFetch(`/api/category/sub/${subId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '소분류 카테고리 삭제에 실패했습니다.' }));
    throw new Error(error.error || '소분류 카테고리 삭제에 실패했습니다.');
  }
}
