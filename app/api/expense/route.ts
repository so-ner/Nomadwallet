import {supabase} from "@/lib/supabaseClient"
import { NextResponse } from 'next/server'
import {withAuth} from "@/lib/auth";
import {supabaseAdmin} from "@/lib/supabaseAdmin";
import {
  ApiCreateExpenseResponse,
  ApiGetExpensesResponse,
  GetExpensesRequest,
  InsertExpense
} from "@/types/expense";

/**
 * [GET] /api/expense?year=2025&month=1
 * 특정 연월의 지출 목록 조회
 */
export const GET = withAuth(async (user, req) => {
  const url = new URL(req.url)
  const year = Number(url.searchParams.get('year'))
  const month = Number(url.searchParams.get('month'))

  const query: GetExpensesRequest = { year, month }
  if (!query.year || !query.month) {
    return NextResponse.json({ error: 'year, month are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('expense')
    .select('*')
    .eq('user_id', user.id)
    .gte('expense_date', `${year}-${String(month).padStart(2, '0')}-01`)
    .lt('expense_date', `${year}-${String(month + 1).padStart(2, '0')}-01`)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const response: ApiGetExpensesResponse = { expenses: data ?? [] }
  return NextResponse.json(response, { status: 200 })
})

/**
 * [POST] /api/expense
 * 지출 생성
 */
export const POST = withAuth(async (user, req): Promise<Response> => {
  const body: InsertExpense = await req.json()
  console.log(body);
  console.log(user);

  const { data, error } = await supabaseAdmin
      .from('expense')
      .insert([{ ...body, user_id: user.id }])
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const response: ApiCreateExpenseResponse = {
      success: true,
      expense_id: data.expense_id,
    }
    return NextResponse.json(response, { status: 201 })
  }
)