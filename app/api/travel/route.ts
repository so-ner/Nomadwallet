import {supabase} from "@/lib/supabaseClient"
import { NextResponse } from 'next/server'
import {withAuth} from "@/lib/auth";

// 여행 예산 목록 조회
export const GET = withAuth(async (user, _req) => {
  console.log(user);
  // 세션의 user_id로 travel 존재 여부 확인
  const { data: travels, error } = await supabase
    .from('travel')
    .select(`
      travel_id,
      travel_title,
      start_date,
      end_date,
      total_budget,
      currency,
      expense(amount)
    `)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // join된 expense(지출) 배열에서 합계 계산
  const result = travels.map((t) => {
    const total_spent = (t.expense || []).reduce((sum, e) => sum + Number(e.amount), 0)
    return { ...t, total_spent }
  })

  return NextResponse.json({ travels: result })
})