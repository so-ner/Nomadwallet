import {supabase} from "@/lib/supabaseClient";
import {withAuth} from "@/lib/auth";
import {GetExpensesRequest} from "@/types/expense";
import {NextResponse} from "next/server";
import dayjs from "@/lib/dayjs";

/**
 * [GET] /api/statistics?year=2025&month=10
 * 특정 연월의 주간 지출 목록 조회(통계)
 */
export const GET = withAuth(async (user, req) => {
  try {
    const url = new URL(req.url)
    const year = Number(url.searchParams.get('year'))
    const month = Number(url.searchParams.get('month'))

    const query: GetExpensesRequest = {year, month}
    if (!query.year || !query.month) {
      return NextResponse.json({error: 'year, month are required'}, {status: 400})
    }

    const startOfMonth = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
    const endOfMonth = startOfMonth.endOf("month");

    const {data, error} = await supabase
      .from('expense')
      .select('*')
      .eq('user_id', user.id)
      .gte('expense_date', `${year}-${String(month).padStart(2, '0')}-01`)
      .lt('expense_date', `${year}-${String(month + 1).padStart(2, '0')}-01`)

    if (error) return NextResponse.json({error: error.message}, {status: 500})
    
    const expenses = data || []

    // 이번 달의 첫 번째 주 계산
    const firstDayOfWeek = startOfMonth.day(); // 0(일)~6(토)
    const firstWeekEnd = firstDayOfWeek === 0 ? startOfMonth : startOfMonth.add(7 - firstDayOfWeek, "day");

    const weeks: {
      week: number;
      start: dayjs.Dayjs;
      end: dayjs.Dayjs;
      income: number;
      expense: number;
    }[] = [];

    // 모든 주 생성
    let currentStart = startOfMonth;
    let weekIndex = 1;
    const maxWeeks = 6; // 최대 6주까지만 (안전장치)

    while ((currentStart.isBefore(endOfMonth) || currentStart.isSame(endOfMonth, "day")) && weekIndex <= maxWeeks) {
      const currentEnd = currentStart.add(6 - currentStart.day(), "day"); // 일요일로 맞추기
      const weekEnd = currentEnd.isAfter(endOfMonth) ? endOfMonth : currentEnd;

      weeks.push({
        week: weekIndex,
        start: currentStart,
        end: weekEnd,
        income: 0,
        expense: 0,
      });

      const nextStart = weekEnd.add(1, "day"); // 다음 주 시작
      
      // 다음 시작일이 이번 달을 넘어가면 종료
      if (nextStart.isAfter(endOfMonth)) {
        break;
      }
      
      currentStart = nextStart;
      weekIndex++;
    }

    // 데이터 합산
    expenses.forEach((item) => {
      const date = dayjs(item.expense_date);
      const week = weeks.find((w) => date.isBetween(w.start, w.end, "day", "[]"));
      if (!week) return;

      if (item.type === "INCOME") week.income += item.amount;
      else week.expense += item.amount;
    });

    // 반환 데이터 구성
    const formatted = weeks.map((w) => ({
      week: w.week,
      period: `${w.start.format("MM.DD")}~${w.end.format("MM.DD")}`,
      income: w.income,
      expense: w.expense,
    }));

    const totalExpense = formatted.reduce((sum, w) => sum + w.expense, 0);

    return NextResponse.json({totalExpense, weeks: formatted}, {status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
})