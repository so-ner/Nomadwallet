import { useMemo } from 'react';
import { Expense, DayExpenseSummary } from '@/types/expense';

export function useMonthlySummary(year: number, month: number, expenses: Expense[]) {
  return useMemo(() => {
    let expenseTotal = 0;
    let incomeTotal = 0;
    expenses.forEach((exp) => {
      const d = new Date(exp.expense_date);
      // month는 0-11 범위 (getMonth() 반환값)
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (exp.type === 'EXPENSE') {
          expenseTotal += exp.amount;
        } else if (exp.type === 'INCOME') {
          incomeTotal += exp.amount;
        }
      }
    });
    return { expense: expenseTotal, income: incomeTotal };
  }, [year, month, expenses]);
}

export function useDayMap(expenses: Expense[]): Record<string, DayExpenseSummary & { expense: number; income: number }> {
  return useMemo(() => {
    const map: Record<string, DayExpenseSummary & { expense: number; income: number }> = {};
    expenses.forEach((exp) => {
      const dateStr = exp.expense_date;
      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, total: 0, expense: 0, income: 0, items: [] };
      }
      map[dateStr].items.push(exp);
      if (exp.type === 'EXPENSE') {
        map[dateStr].expense += exp.amount;
        map[dateStr].total -= exp.amount;
      } else if (exp.type === 'INCOME') {
        map[dateStr].income += exp.amount;
        map[dateStr].total += exp.amount;
      }
    });
    return map;
  }, [expenses]);
}

