import {withAuth} from "@/lib/auth";
import {supabase} from "@/lib/supabaseClient";
import {NextResponse} from "next/server";

/**
 * [GET] /api/category?travel_id=1&start_date=2025-03-03&end_date=2025-03-09
 * 카테고리별 지출 통계
 * - travel_id가 있으면 해당 여행만
 * - start_date, end_date가 있으면 해당 기간만(주차별에서 상세 보기 시)
 */
export const GET = withAuth(async (user, req) => {
  try {
    const {searchParams} = new URL(req.url);
    const travelId = searchParams.get('travel_id');
    const startDate = searchParams.get('start_date'); // 주차 시작일
    const endDate = searchParams.get('end_date');     // 주차 종료일

    // 기본 쿼리
    const query = supabase
      .from('expense')
      .select('category, amount')
      .eq('user_id', user.id);
    // 파라미터 값에 따른 조건 쿼리 추가
    if (travelId) query.eq('travel_id', travelId);
    if (startDate && endDate) {
      query.gte('expense_date', startDate).lte('expense_date', endDate);
    }

    const {data, error} = await query;
    if (error) return NextResponse.json({error: error.message}, {status: 500});

    const expenses = data || [];

    // 카테고리별 합산
    const grouped = expenses.reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const categories = Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount
    }));

    const total = categories.reduce((sum, c) => sum + c.amount, 0);

    return NextResponse.json({categories, total}, {status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
})