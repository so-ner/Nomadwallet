import {NextResponse} from 'next/server'
import {supabase} from "@/lib/supabaseClient"
import {requireAuth} from "@/lib/auth";
import {supabaseAdmin} from "@/lib/supabaseAdmin";
import {
  ApiDeleteExpenseResponse,
  ApiGetExpenseResponse,
  ApiUpdateExpenseResponse,
  UpdateExpense,
} from '@/types/expense'

/**
 * [GET] /api/expense/:expense_id
 * 지출 상세 조회
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ expense_id: number }> }
) {
  const {expense_id} = await context.params;
  if (!expense_id) {
    return NextResponse.json({error: 'Invalid expense_id'}, {status: 400})
  }

  const user = await requireAuth()
  if ('status' in user) return user

  const {data, error} = await supabase
    .from('expense')
    .select('*')
    .eq('expense_id', expense_id)
    .eq('user_id', user.id)
    .single();
  if (error) return NextResponse.json({error: error.message}, {status: 500})

  if (!data || data.length === 0) {
    return NextResponse.json({error: 'Expense not found'}, {status: 404});
  }

  const response: ApiGetExpenseResponse = {expense: data}
  return NextResponse.json(response, {status: 200})
}


/**
 * [PUT] /api/expense/:expense_id
 * 지출 수정
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ expense_id: number }> }
) {
  try {
    const expenseId = (await context.params).expense_id;
    if (!expenseId) {
      return NextResponse.json({error: 'Invalid expense_id'}, {status: 400})
    }

    const user = await requireAuth()
    if ('status' in user) return user

    const body: UpdateExpense = await req.json()

    const {data, error} = await supabaseAdmin
      .from('expense')
      .update({...body, updated_at: new Date().toISOString()})
      .eq('expense_id', expenseId)
      .eq('user_id', user.id)
      .select('*')
      .single()
    if (error) return NextResponse.json({error: error.message}, {status: 500})

    if (!data || data.length === 0) {
      return NextResponse.json({error: 'Expense not found'}, {status: 404});
    }

    const response: ApiUpdateExpenseResponse = {expense: data}
    return NextResponse.json(response, {status: 200})
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}

/**
 * [DELETE] /api/expense/:expense_id
 * 지출 삭제
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ expense_id: number }> }
) {
  try {
    const expenseId = (await context.params).expense_id;
    if (!expenseId) {
      return NextResponse.json({error: 'Invalid expense_id'}, {status: 400})
    }

    const user = await requireAuth()
    if ('status' in user) return user

    const {error} = await supabaseAdmin
      .from('expense')
      .delete()
      .eq('expense_id', expenseId)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({error: error.message}, {status: 500})

    const response: ApiDeleteExpenseResponse = {success: true}
    return NextResponse.json(response, {status: 200})
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}