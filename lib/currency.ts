// 통화 데이터 타입 정의
export interface CurrencyData {
  country_name: string;
  currency_name: string;
  currency_code: string;
  currency_number: number;
}

// 원본 JSON 데이터 타입 (객체 형태)
export interface RawCurrencyDataObject {
  [countryCode: string]: {
    country_name: string;
    country_iso3?: string;
    country_iso_numeric?: string;
    currency_name: string;
    currency_code: string;
    currency_number: string;
  };
}

// 통화 한글명 매핑 (currency_code -> 한글명, 대소문자 모두 지원)
const CURRENCY_KOREAN_NAMES: Record<string, string> = {
  // 주요 통화
  'USD': '미국 달러',
  'usd': '미국 달러',
  'EUR': '유로',
  'eur': '유로',
  'JPY': '일본 엔',
  'jpy': '일본 엔',
  'KRW': '대한민국 원',
  'krw': '대한민국 원',
  'GBP': '영국 파운드',
  'gbp': '영국 파운드',
  'CHF': '스위스 프랑',
  'chf': '스위스 프랑',
  'CNY': '중국 위안',
  'cny': '중국 위안',
  'AUD': '호주 달러',
  'aud': '호주 달러',
  'CAD': '캐나다 달러',
  'cad': '캐나다 달러',
  'NZD': '뉴질랜드 달러',
  'nzd': '뉴질랜드 달러',
  'SGD': '싱가포르 달러',
  'sgd': '싱가포르 달러',
  'HKD': '홍콩 달러',
  'hkd': '홍콩 달러',
  'THB': '태국 바트',
  'thb': '태국 바트',
  'MYR': '말레이시아 링깃',
  'myr': '말레이시아 링깃',
  'IDR': '인도네시아 루피아',
  'idr': '인도네시아 루피아',
  'PHP': '필리핀 페소',
  'php': '필리핀 페소',
  'VND': '베트남 동',
  'vnd': '베트남 동',
  'INR': '인도 루피',
  'inr': '인도 루피',
  'BRL': '브라질 레알',
  'brl': '브라질 레알',
  'MXN': '멕시코 페소',
  'mxn': '멕시코 페소',
  'ZAR': '남아프리카 공화국 랜드',
  'zar': '남아프리카 공화국 랜드',
  'RUB': '러시아 루블',
  'rub': '러시아 루블',
  'TRY': '터키 리라',
  'try': '터키 리라',
  'SEK': '스웨덴 크로나',
  'sek': '스웨덴 크로나',
  'NOK': '노르웨이 크로네',
  'nok': '노르웨이 크로네',
  'DKK': '덴마크 크로네',
  'dkk': '덴마크 크로네',
  'PLN': '폴란드 즐로티',
  'pln': '폴란드 즐로티',
  'CZK': '체코 코루나',
  'czk': '체코 코루나',
  'HUF': '헝가리 포린트',
  'huf': '헝가리 포린트',
  'ILS': '이스라엘 세켈',
  'ils': '이스라엘 세켈',
  'AED': '아랍에미리트 디르함',
  'aed': '아랍에미리트 디르함',
  'SAR': '사우디아라비아 리얄',
  'sar': '사우디아라비아 리얄',
  'EGP': '이집트 파운드',
  'egp': '이집트 파운드',
  'TWD': '신대만 달러',
  'twd': '신대만 달러',
  'XCD': '동카리브 달러',
  'xcd': '동카리브 달러',
  'XOF': '서아프리카 프랑',
  'xof': '서아프리카 프랑',
  'XAF': '중앙아프리카 프랑',
  'xaf': '중앙아프리카 프랑',
  'XPF': 'CFP 프랑',
  'xpf': 'CFP 프랑',
};

/**
 * 통화 코드를 대문자로 변환
 */
function normalizeCurrencyCode(code: string): string {
  return code.toUpperCase();
}

/**
 * 통화 데이터 객체를 배열로 변환하고 필요한 필드만 추출하여 currency_name을 한글로 변환
 * @param rawData 원본 JSON 데이터 객체 (국가 코드를 키로 하는 객체)
 * @returns 가공된 통화 데이터 배열
 */
export function processCurrencyData(rawData: RawCurrencyDataObject): CurrencyData[] {
  return Object.values(rawData)
    .filter((item) => {
      // currency_code가 비어있거나 "no universal currency"인 경우 제외
      const code = (item.currency_code || '').trim();
      return code !== '' && code.toLowerCase() !== 'no universal currency';
    })
    .map((item) => {
      const currencyCode = normalizeCurrencyCode(item.currency_code || '');
      const koreanName = CURRENCY_KOREAN_NAMES[currencyCode] || CURRENCY_KOREAN_NAMES[item.currency_code] || '';
      
      // currency_name을 "한글명 (통화코드)" 형식으로 변환
      // 한글명이 있으면 사용하고, 없으면 원래 currency_name 사용
      const formattedCurrencyName = koreanName 
        ? `${koreanName} (${currencyCode})`
        : `${item.currency_name} (${currencyCode})`;

      return {
        country_name: item.country_name || '',
        currency_name: formattedCurrencyName,
        currency_code: currencyCode,
        currency_number: parseInt(item.currency_number || '0', 10),
      };
    });
}

/**
 * 통화 코드로 한글명 찾기
 */
export function getCurrencyKoreanName(currencyCode: string): string {
  const normalized = normalizeCurrencyCode(currencyCode);
  return CURRENCY_KOREAN_NAMES[normalized] || CURRENCY_KOREAN_NAMES[currencyCode] || currencyCode;
}

/**
 * 통화 데이터에서 중복을 제거하여 고유한 통화 목록 반환
 * currency_number를 기준으로 중복 제거
 */
export function getUniqueCurrencies(currencies: CurrencyData[]): CurrencyData[] {
  const currencyMap = new Map<number, CurrencyData>();
  
  currencies.forEach((currency) => {
    if (!currencyMap.has(currency.currency_number)) {
      currencyMap.set(currency.currency_number, currency);
    }
  });
  
  return Array.from(currencyMap.values()).sort((a, b) => {
    // 주요 통화를 먼저 보여주기 위한 정렬
    const priorityOrder = ['KRW', 'USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CNY', 'AUD', 'CAD'];
    const aIndex = priorityOrder.indexOf(a.currency_code);
    const bIndex = priorityOrder.indexOf(b.currency_code);
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    return a.currency_name.localeCompare(b.currency_name, 'ko');
  });
}

