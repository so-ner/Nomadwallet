import { CurrencyCode } from '@/types/travel';

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
