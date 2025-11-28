import { CurrencyCode } from '@/types/travel';
import { apiFetch } from './fetch';

export interface ExchangeRate {
  base_currency: number;
  target_currency: number;
  rate: number;
  retrieved_at: string;
}

export interface ApiGetExchangeRateResponse {
  exchange_rate: ExchangeRate;
}

export async function getExchangeRate(
  targetCurrency: number
): Promise<ApiGetExchangeRateResponse> {
  const rates: Record<number, number> = {
    [CurrencyCode.KRW]: 1.0,
    [CurrencyCode.JPY]: 9.27,
    [CurrencyCode.USD]: 0.00070,
  };

  const rate = rates[targetCurrency] || 1.0;

  return {
    exchange_rate: {
      base_currency: CurrencyCode.KRW,
      target_currency: targetCurrency,
      rate,
      retrieved_at: new Date().toISOString(),
    },
  };
}

// 환율 계산 API 호출
export interface ExchangeCalculationRequest {
  amount: number;
  currency: string; // 통화 코드 (예: "usd", "krw")
  date: string; // YYYY-MM-DD 형식
}

export interface ExchangeCalculationResponse {
  base_currency: string;
  target_currency: string;
  date: string;
  rate: number;
  amount: number;
  converted: number;
}

export async function calculateExchange(
  amount: number,
  currencyCode: string,
  date: string
): Promise<ExchangeCalculationResponse> {
  const res = await apiFetch('/api/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: currencyCode.toLowerCase(),
      date,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '환율 계산에 실패했습니다.' }));
    throw new Error(error.error || '환율 계산에 실패했습니다.');
  }

  return res.json();
}
