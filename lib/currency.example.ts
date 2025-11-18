/**
 * 통화 데이터 처리 사용 예시
 */

import { processCurrencyData, CurrencyData } from './currency';
import rawCurrencyData from './currency-data.json';

// 예시 1: JSON 파일에서 데이터 가공
const processedData: CurrencyData[] = processCurrencyData(rawCurrencyData);

console.log('가공된 통화 데이터:', processedData);
// 결과 예시:
// [
//   {
//     country_name: "united states of america (the)",
//     currency_name: "미국 달러 (USD)",
//     currency_code: "USD",
//     currency_number: 840
//   },
//   {
//     country_name: "korea (the republic of)",
//     currency_name: "대한민국 원 (KRW)",
//     currency_code: "KRW",
//     currency_number: 410
//   },
//   ...
// ]

// 예시 2: 직접 JSON 객체 사용
const exampleJson = {
  "us": {
    "country_name": "united states of america (the)",
    "currency_name": "us dollar",
    "currency_code": "usd",
    "currency_number": "840"
  },
  "kr": {
    "country_name": "korea (the republic of)",
    "currency_name": "won",
    "currency_code": "krw",
    "currency_number": "410"
  }
};

const result = processCurrencyData(exampleJson);
console.log('결과:', result);

// 예시 3: 특정 통화 코드로 필터링
const usdCurrencies = processedData.filter(item => item.currency_code === 'USD');
console.log('USD를 사용하는 국가들:', usdCurrencies);

// 예시 4: 통화 코드로 중복 제거 (같은 통화를 사용하는 국가들)
const uniqueCurrencies = processedData.reduce((acc, item) => {
  if (!acc.find(c => c.currency_code === item.currency_code)) {
    acc.push(item);
  }
  return acc;
}, [] as CurrencyData[]);
console.log('고유 통화 목록:', uniqueCurrencies);

