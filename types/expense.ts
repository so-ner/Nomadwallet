import {Database} from "@/types/database.types";

export enum ExpenseCategory {
  TRANSPORT = '교통',
  ACCOMMODATION = '숙박',
  FOOD = '식사',
  SHOPPING = '쇼핑',
  CAFE = '카페/간식',
  ENTERTAINMENT = '문화/여가',
  ETC = '기타',
}

// Supabase에서 가져온 테이블 타입
export type Expense = Database['public']['Tables']['expense']['Row']
export type InsertExpense = Database['public']['Tables']['expense']['Insert']
export type UpdateExpense = Database['public']['Tables']['expense']['Update']

// Supabase Enums
export type CategoryMajor = Database['public']['Enums']['category_major']
export type TransactionType = Database['public']['Enums']['transaction_type']

// React Select에서 사용할 옵션 형식
export const categoryOptions: { label: string; value: CategoryMajor }[] = [
  {label: '주거비', value: 'HOUSING'},
  {label: '고정비', value: 'FIXED'},
  {label: '저축/투자비', value: 'SAVINGS_INVESTMENT'},
  {label: '교통비', value: 'TRANSPORTATION'},
  {label: '식사비', value: 'FOOD'},
  {label: '생활/쇼핑', value: 'LIVING_SHOPPING'},
  {label: '문화생활', value: 'ENTERTAINMENT'},
  {label: '기타', value: 'OTHERS'},
]
export const transactionOptions: { label: string; value: TransactionType }[] = [
  {label: '지출', value: 'EXPENSE'},
  {label: '수입', value: 'INCOME'}
]

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
  category_major?: CategoryMajor
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
