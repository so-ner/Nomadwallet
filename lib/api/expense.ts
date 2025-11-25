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

export async function getExpenses(params: GetExpensesRequest): Promise<ApiGetExpensesResponse> {
  const dummyExpenses = generateDummyExpenses();
  
  const filtered = dummyExpenses.filter((exp) => {
    const date = new Date(exp.expense_date);
    return date.getFullYear() === params.year && date.getMonth() + 1 === params.month;
  });

  return { expenses: filtered };
}

export async function getExpense(expenseId: number): Promise<ApiGetExpenseResponse> {
  const dummyExpenses = generateDummyExpenses();
  let expense = dummyExpenses.find((e) => e.expense_id === expenseId);
  
  if (!expense) {
    expense = {
      expense_id: expenseId,
      user_id: 1,
      travel_id: null as any,
      amount: 15000,
      currency: CurrencyCode.KRW,
      exchange_rate: null,
      category: ExpenseCategory.FOOD,
      expense_date: new Date().toISOString().slice(0, 10),
      type: 'EXPENSE' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memo: null,
    } as Expense;
  }
  
  return { expense };
}

export async function createExpense(data: PostExpenseRequest): Promise<ApiCreateExpenseResponse> {
  const expenseId = Date.now();
  return { success: true, expense_id: expenseId };
}

export async function updateExpense(expenseId: number, data: PutExpenseRequest): Promise<ApiUpdateExpenseResponse> {
  const updatedExpense: Expense = {
    expense_id: expenseId,
    user_id: 1,
    travel_id: null as any,
    amount: data.amount,
    currency: data.currency,
    exchange_rate: data.exchange_rate ?? null,
    category: data.category,
    expense_date: data.expense_date,
    type: 'EXPENSE' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memo: null,
  } as Expense;
  return { expense: updatedExpense };
}

export async function deleteExpense(expenseId: number): Promise<ApiDeleteExpenseResponse> {
  return { success: true };
}
