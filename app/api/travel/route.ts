import {supabase} from "@/lib/supabaseClient"
import { NextResponse } from 'next/server'
import {withAuth} from "@/lib/auth";
import {supabaseAdmin} from "@/lib/supabaseAdmin";

// 여행 예산 목록 조회
export const GET = withAuth(async (user, req) => {
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

// 여행 예산 생성
export const POST = withAuth(async (user, req) => {
  // todo 인터페이스 생성 전 임시 타입 지정
  const body: {
    travel_title: string
    start_date: string
    end_date: string
    total_budget: number
    warn_type?: 'amount' | 'percent'
    warn_detail_cond?: string
    currency?: number
  } = await req.json()

  const { data, error } = await supabaseAdmin
    .from('travel')
    .insert([
      {
        user_id: user.id,
        travel_title: body.travel_title,
        start_date: body.start_date,
        end_date: body.end_date,
        total_budget: body.total_budget,
        warn_type: body.warn_type ?? 'percent',
        warn_detail_cond: body.warn_detail_cond ?? '80',
        currency: body.currency ?? 1,
      },
    ])
    .select('*')
    .single()

  if (error) {
    console.error('여행 생성 실패:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ travel: data })
})