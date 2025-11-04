import { NextResponse } from 'next/server'
import {supabase} from "@/lib/supabaseClient"
import {withAuth} from "@/lib/auth";
import {supabaseAdmin} from "@/lib/supabaseAdmin";
import type {
  UpdateExpense,
  ApiGetExpenseResponse,
  ApiUpdateExpenseResponse,
  ApiDeleteExpenseResponse,
} from '@/types/expense'

/**
 * [GET] /api/expense/:expense_id
 * 지출 상세 조회
 */
export const GET = withAuth(
  async (user, req, context): Promise<Response> => {
    const { params } = await context;
    const expenseId = Number(params.expense_id);

    const { data, error } = await supabase
      .from('expense')
      .select('*')
      .eq('expense_id', expenseId)
      .eq('user_id', user.id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const response: ApiGetExpenseResponse = { expense: data }
    return NextResponse.json(response, { status: 200 })
  }
)

/**
 * [PUT] /api/expense/:expense_id
 * 지출 수정
 */
export const PUT = withAuth(
  async (user, req, context): Promise<Response> => {
    const { params } = await context;
    const expenseId = Number(params.expense_id);
    const body: UpdateExpense = await req.json()

    const { data, error } = await supabaseAdmin
      .from('expense')
      .update({ ...body, updated_at: new Date().toISOString()})
      .eq('expense_id', expenseId)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const response: ApiUpdateExpenseResponse = { expense: data }
    return NextResponse.json(response, { status: 200 })
  }
)

/**
 * [DELETE] /api/expense/:expense_id
 * 지출 삭제
 */
export const DELETE = withAuth(
  async (user, req, context): Promise<Response> => {
    const { params } = await context;
    const expenseId = Number(params.expense_id);

    const { error } = await supabaseAdmin
      .from('expense')
      .delete()
      .eq('expense_id', expenseId)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const response: ApiDeleteExpenseResponse = { success: true }
    return NextResponse.json(response, { status: 200 })
  }
)