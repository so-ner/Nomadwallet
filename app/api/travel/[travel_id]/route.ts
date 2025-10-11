import {supabaseAdmin} from "@/lib/supabaseAdmin"
import {supabase} from "@/lib/supabaseClient"
import { NextResponse } from 'next/server'
import {withAuth} from "@/lib/auth";

// 여행 예산 상세 API (Travel Detail)
// 조회
export const GET = withAuth(async (user, req, contextPromise) => {
  const { params } = await contextPromise;
  const travelId = Number(params.travel_id);

  // params의 travel_id로 여행예산 조회
  const { data, error } = await supabase
    .from('travel')
    .select('*')
    .eq('travel_id', travelId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
})

// 수정
export const PATCH = withAuth(async (user, req, contextPromise) => {
  const { params } = await contextPromise;
  const travelId = Number(params.travel_id);

  // todo 인터페이스 생성 전 임시 타입 지정
  const body: { travel_title: string; total_budget: number } = await req.json()
  const { data, error } = await supabaseAdmin
    .from('travel')
    .update({'travel_title' : body.travel_title, 'total_budget' : body.total_budget})
    .eq('travel_id', travelId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
})

// 삭제
export const DELETE = withAuth(async (user, req, contextPromise) => {
  const { params } = await contextPromise;
  const travelId = Number(params.travel_id);

  const { data, error } = await supabaseAdmin
    .from('travel')
    .delete()
    .eq('user_id', user.id)
    .eq('travel_id', travelId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
})