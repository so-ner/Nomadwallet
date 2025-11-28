import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getExpensesServer } from '@/lib/api/expense';
import ExpensePageClient from './_component/ExpensePageClient';

export default async function ExpensePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/');
  }

  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  const initialExpenses = await getExpensesServer({ year, month }, cookieHeader);

  return (
    <ExpensePageClient 
      initialExpenses={initialExpenses}
      initialYear={year}
      initialMonth={month}
    />
  );
}
