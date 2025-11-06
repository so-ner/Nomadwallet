import {supabaseAdmin} from "@/lib/supabaseAdmin"
import {supabase} from "@/lib/supabaseClient"
import { NextResponse } from 'next/server'
import {withAuth} from "@/lib/auth";
import type { UpdateExpense } from '@/types/expense';
import { UpdateTravel } from '@/types/travel';


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
  const body: UpdateTravel = await req.json()


  const { data, error } = await supabaseAdmin
    .from('travel_id')
    .update({ ...body, updated_at: new Date().toISOString()})
    .eq('travelId', travelId)
    .eq('user_id', user.id)
    .select('*')
    .single()

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