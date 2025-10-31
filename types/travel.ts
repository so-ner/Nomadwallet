/**
 * 경고 타입의 열거형 (DB의 warn_type_enum)
 * - 'amount': 특정 금액을 초과했을 때 경고
 * - 'percent': 총 예산 대비 특정 비율을 초과했을 때 경고
 */
export type WarnType = 'amount' | 'percent';

// 국제 통화 코드 (DB의 currency 정수 코드와 매핑)
export enum CurrencyCode {
  KRW = 1,
  JPY = 2,
  USD = 3,
}

export interface Travel {
  travel_id: number;
  travel_title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  warn_type: WarnType;
  warn_detail_cond: string;
  currency: number;
  expense: Array<{
    amount: number;
  }>;
  total_spent: number;
}

export interface GetTravelsResponse {
  travels: Travel[];
}

export interface GetTravelResponse extends Travel {
}

// API 응답 스키마 (서버 응답 형태를 그대로 반영)
export interface ApiGetTravelsResponse { travels: Travel[] }
export interface ApiCreateTravelResponse { travel: Travel }
export interface ApiGetTravelResponse { data: GetTravelResponse | null }
export interface ApiUpdateTravelResponse { data: unknown }
export interface ApiDeleteTravelResponse { data: unknown }

export interface PostTravelRequest {
  travel_title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  warn_type?: WarnType;
  warn_detail_cond?: string;
  currency: number; // CurrencyCode
}

export interface PutTravelRequest {
  travel_title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  warn_type?: WarnType;
  warn_detail_cond?: string;
  currency: number; // CurrencyCode
}