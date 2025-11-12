import {supabase} from "@/lib/supabaseClient"
import {NextResponse} from 'next/server'
import {withAuth} from "@/lib/auth";
import {supabaseAdmin} from "@/lib/supabaseAdmin";
import {InsertTravel} from "@/types/travel";
import {TransactionType} from "@/types/expense";

/**
 * [GET] /api/travel
 * 여행 예산 목록 조회
 */
export const GET = withAuth(async (user, req) => {
  try {
    // 세션의 user_id로 travel 존재 여부 확인
    const {data: travels, error} = await supabase
      .from('travel')
      .select(`
        travel_id,
        travel_title,
        start_date,
        end_date,
        total_budget,
        currency,
        expense(amount, category, memo, type)
      `)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({error: error.message}, {status: 500})

    // join된 expense(지출) 배열에서 합계 계산
    // TODO 인터페이스 지정 후 타입 비교 수정
    const result = travels.map((t) => {
      const expenses = t.expense || [];

      const total_income = expenses
        .filter((e) => e.type === 'INCOME')
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const total_expense = expenses
        .filter((e) => e.type === 'EXPENSE')
        .reduce((sum, e) => sum + Number(e.amount), 0);

      // 실제 사용 금액 = 지출 - 수입
      const total_spent = total_expense - total_income;
      const remaining_budget = t.total_budget - total_expense;

      return {
        ...t,
        total_income,
        total_expense,
        total_spent,
        remaining_budget
      };
    });

    return NextResponse.json({travels: result}, {status: 200})
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
})

/**
 * [POST] /api/travel
 * 여행 예산 생성
 */
export const POST = withAuth(async (user, req) => {
  try {
    const body: InsertTravel = await req.json()

    const {data, error} = await supabaseAdmin
      .from('travel')
      .insert([{...body, user_id: user.id}])
      .select();
    if (error)
      return NextResponse.json({error: error.message}, {status: 500})

    if (!data || data.length === 0) {
      return NextResponse.json({error: 'Travel not found'}, {status: 404});
    }

    return NextResponse.json({travel: data}, {status: 200})
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
})