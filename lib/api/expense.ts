import {
  GetExpensesRequest,
  PostExpenseRequest,
  PutExpenseRequest,
  ApiGetExpensesResponse,
  ApiGetExpenseResponse,
  ApiCreateExpenseResponse,
  ApiUpdateExpenseResponse,
  ApiDeleteExpenseResponse,
  Expense,
  InsertExpense,
} from '@/types/expense';
import { ExpenseCategory } from '@/types/expense';
import { CurrencyCode } from '@/types/travel';

function generateDummyExpenses(): Expense[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  
  const categories = [
    ExpenseCategory.TRANSPORT,
    ExpenseCategory.FOOD,
    ExpenseCategory.CAFE,
    ExpenseCategory.SHOPPING,
    ExpenseCategory.ACCOMMODATION,
    ExpenseCategory.ENTERTAINMENT,
    ExpenseCategory.ETC,
  ];
  
  const expenses: Expense[] = [];
  let expenseId = 1;
  
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.max(1, day - i);
    const expenseDate = new Date(year, month, daysAgo);
    
    const countPerDay = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < countPerDay; j++) {
      const amounts = [1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000, 30000, 50000];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      expenses.push({
        expense_id: expenseId++,
        user_id: 1,
        travel_id: null as any,
        amount,
        currency: CurrencyCode.KRW,
        exchange_rate: null,
        category,
        expense_date: formatDate(expenseDate),
        type: 'EXPENSE' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        memo: null,
      } as Expense);
    }
  }
  
  return expenses;
}

/**
 * 클라이언트/서버 공통 사용 지출 목록 조회 함수
 */
export async function getExpenses(params: GetExpensesRequest): Promise<ApiGetExpensesResponse> {
  const response = await fetch(`/api/expense?year=${params.year}&month=${params.month}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '지출 목록 조회에 실패했습니다.');
  }

  return await response.json();
}

/**
 * 서버 사이드에서 사용하는 지출 목록 조회 함수 (Expense[] 반환)
 */
export async function getExpensesServer(
  params: GetExpensesRequest,
  cookieHeader?: string
): Promise<Expense[]> {
  // 서버 사이드에서는 절대 URL 필요
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/expense?year=${params.year}&month=${params.month}`;
  
  const headers: HeadersInit = {};
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('지출 데이터 로드 실패:', error);
    return [];
  }

  const data: ApiGetExpensesResponse = await response.json();
  return data.expenses ?? [];
}

export async function getExpense(expenseId: number): Promise<ApiGetExpenseResponse> {
  const response = await fetch(`/api/expense/${expenseId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '지출 조회에 실패했습니다.');
  }

  return await response.json();
}

export async function createExpense(data: Omit<InsertExpense, 'user_id' | 'created_at' | 'updated_at' | 'expense_id'>): Promise<ApiCreateExpenseResponse> {
  const response = await fetch('/api/expense', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '지출 생성에 실패했습니다.');
  }

  return await response.json();
}

export async function updateExpense(expenseId: number, data: PutExpenseRequest): Promise<ApiUpdateExpenseResponse> {
  const response = await fetch(`/api/expense/${expenseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '지출 수정에 실패했습니다.');
  }

  return await response.json();
}

export async function deleteExpense(expenseId: number): Promise<ApiDeleteExpenseResponse> {
  const response = await fetch(`/api/expense/${expenseId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '지출 삭제에 실패했습니다.');
  }

  return await response.json();
}
