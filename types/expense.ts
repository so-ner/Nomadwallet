import { CurrencyCode } from './travel';

export enum ExpenseCategory {
  TRANSPORT = '교통',
  ACCOMMODATION = '숙박',
  FOOD = '식사',
  SHOPPING = '쇼핑',
  CAFE = '카페/간식',
  ENTERTAINMENT = '문화/여가',
  ETC = '기타',
}

export interface Expense {
  expense_id: number;
  user_id: number;
  travel_id: number | null;
  amount: number;
  currency: number; // CurrencyCode
  exchange_rate: number | null;
  category: string; // ExpenseCategory
  expense_date: string; // YYYY-MM-DD
}

export interface DayExpenseSummary {
  date: string; // YYYY-MM-DD
  total: number; // 해당 일의 총 지출 (음수로 표시)
  items: Expense[];
}

export interface MonthlyExpenseSummary {
  year: number;
  month: number; // 1-12 (1=1월, 12=12월)
  total: number; // 해당 월의 총 지출
  count: number; // 지출 건수
}

// =========================
// API Request Types
// =========================

export interface GetExpensesRequest {
  year: number;
  month: number; // 1-12 (1=1월, 12=12월)
}

export interface PostExpenseRequest {
  travel_id?: number | null;
  amount: number;
  currency: number; // CurrencyCode
  exchange_rate?: number | null;
  category: string; // ExpenseCategory
  expense_date: string; // YYYY-MM-DD
}

export interface PutExpenseRequest {
  amount: number;
  currency: number; // CurrencyCode
  exchange_rate?: number | null;
  category: string; // ExpenseCategory
  expense_date: string; // YYYY-MM-DD
}

// =========================
// API Response Types
// =========================

export interface ApiGetExpensesResponse {
  expenses: Expense[];
}

export interface ApiGetExpenseResponse {
  expense: Expense;
}

export interface ApiCreateExpenseResponse {
  success: boolean;
  expense_id: number;
}

export interface ApiUpdateExpenseResponse {
  expense: Expense;
}

export interface ApiDeleteExpenseResponse {
  success: boolean;
}
