/**
 * 경고 타입의 열거형 (DB의 warn_type_enum)
 * - 'amount': 특정 금액을 초과했을 때 경고
 * - 'percent': 총 예산 대비 특정 비율을 초과했을 때 경고
 */
export type WarnType = 'amount' | 'percent';

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

export interface PostTravelRequest {
  travel_title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  warn_type?: WarnType;
  warn_detail_cond?: string;
  currency: number;
}

export interface PutTravelRequest {
  travel_title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  warn_type?: WarnType;
  warn_detail_cond?: string;
  currency: number;
}