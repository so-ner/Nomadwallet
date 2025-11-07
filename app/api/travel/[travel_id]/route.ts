import {supabaseAdmin} from "@/lib/supabaseAdmin"
import {supabase} from "@/lib/supabaseClient"
import { NextResponse } from 'next/server'
import {withAuth} from "@/lib/auth";
import {ApiDeleteTravelResponse, UpdateTravel} from "@/types/travel";

/**
 * [GET] /api/travel/:travel_id
 * 여행 예산 상세 조회
 */
export const GET = withAuth(async (user, req, contextPromise) => {
  const context = await contextPromise
  const travelId = context.params.travel_id

  // params의 travel_id로 여행예산 조회
  const { data, error } = await supabase
    .from('travel')
    .select('*')
    .eq('travel_id', travelId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
})

/**
 * [PATCH] /api/travel/:travel_id
 * 여행 예산 수정
 */
export const PATCH = withAuth(async (user, req, contextPromise) => {
  const context = await contextPromise
  const travelId = context.params.travel_id

  const body: UpdateTravel = await req.json()

  const { data, error } = await supabaseAdmin
    .from('travel')
    .update({ ...body, updated_at: new Date().toISOString()})
    .eq('travel_id', travelId)
    .eq('user_id', user.id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
})

/**
 * [DELETE] /api/travel/:travel_id
 * 여행 예산 삭제
 */
export const DELETE = withAuth(async (user, req, contextPromise) => {
  const context = await contextPromise
  const travelId = context.params.travel_id

  const { error } = await supabaseAdmin
    .from('travel')
    .delete()
    .eq('user_id', user.id)
    .eq('travel_id', travelId)

  const response: ApiDeleteTravelResponse = { success: true }
  return NextResponse.json(response, { status: 200 })
})