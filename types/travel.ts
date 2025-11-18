import {Database} from '@/types/database.types'

// Supabase에서 가져온 테이블 타입
export type Travel = Database['public']['Tables']['travel']['Row']
export type InsertTravel = Database['public']['Tables']['travel']['Insert']
export type UpdateTravel = Database['public']['Tables']['travel']['Update']

// Supabase Enums
/**
 * 경고 타입의 열거형 (DB의 warn_type_enum)
 * - 'amount': 특정 금액을 초과했을 때 경고
 * - 'percent': 총 예산 대비 특정 비율을 초과했을 때 경고
 */
export type WarnType = Database['public']['Enums']['warn_type_enum']

// React Select에서 사용할 옵션 형식
export const warnTypeOptions: { label: string; value: WarnType }[] = [
  {label: '금액', value: 'amount'},
  {label: '퍼센트', value: 'percent'}
]

// 국제 통화 코드 (DB의 currency 정수 코드와 매핑)
export enum CurrencyCode {
  KRW = 1,
  JPY = 2,
  USD = 3,
}

export interface GetTravelsResponse {
  travels: Travel[];
}

// API 응답 스키마 (서버 응답 형태를 그대로 반영)
export interface ApiGetTravelsResponse {
  travels: Travel[]
}

export interface ApiGetTravelResponse {
  travel: Travel
}

export interface ApiCreateTravelResponse {
  travel: Travel
}

export interface ApiUpdateTravelResponse {
  travel: Travel
}

export interface ApiDeleteTravelResponse {
  success: boolean;
}

// API 요청 스키마
export interface PostTravelRequest {
  travel_title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: number;
  warn_type?: WarnType;
  warn_detail_cond?: string;
}

export interface PutTravelRequest {
  travel_title?: string;
  start_date?: string;
  end_date?: string;
  total_budget?: number;
  currency?: number;
  warn_type?: WarnType;
  warn_detail_cond?: string;
}