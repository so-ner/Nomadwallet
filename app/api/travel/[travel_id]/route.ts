import {supabaseAdmin} from "@/lib/supabaseAdmin"
import {supabase} from "@/lib/supabaseClient"
import {NextResponse} from 'next/server'
import {requireAuth} from "@/lib/auth";
import {ApiDeleteTravelResponse, ApiGetTravelResponse, ApiUpdateTravelResponse, UpdateTravel} from "@/types/travel";

/**
 * [GET] /api/travel/:travel_id
 * 여행 예산 상세 조회
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ travel_id: number }> }
) {
  const { travel_id } = await context.params;
  if (!travel_id) {
    return NextResponse.json({error: 'Invalid travel_id'}, {status: 400})
  }

  const user = await requireAuth()
  if ('status' in user) return user

  // 여행 예산 조회
  const {data, error} = await supabase
    .from('travel')
    .select('*')
    .eq('travel_id', travel_id)
    .single();

  if (error) return NextResponse.json({error: error.message}, {status: 500})

  const response: ApiGetTravelResponse = {travel: data}
  return NextResponse.json(response, {status: 200})
}

/**
 * [PATCH] /api/travel/:travel_id
 * 여행 예산 수정
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ travel_id: number }> }
) {
  const travelId = (await context.params).travel_id;
  if (!travelId) {
    return NextResponse.json({error: 'Invalid travel_id'}, {status: 400})
  }

  const user = await requireAuth()
  if ('status' in user) return user

  const body: UpdateTravel = await req.json()

  const {data, error} = await supabaseAdmin
    .from('travel')
    .update({...body, updated_at: new Date().toISOString()})
    .eq('travel_id', travelId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({error: error.message}, {status: 500})

  const response: ApiUpdateTravelResponse = {travel: data}
  return NextResponse.json(response, {status: 200})
}

/**
 * [DELETE] /api/travel/:travel_id
 * 여행 예산 삭제
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ travel_id: number }> }
) {
  const travelId = (await context.params).travel_id;
  if (!travelId) {
    return NextResponse.json({error: 'Invalid travel_id'}, {status: 400})
  }

  const user = await requireAuth()
  if ('status' in user) return user

  const {error} = await supabaseAdmin
    .from('travel')
    .delete()
    .eq('user_id', user.id)
    .eq('travel_id', travelId)

  if (error) return NextResponse.json({error: error.message}, {status: 500})

  const response: ApiDeleteTravelResponse = {success: true}
  return NextResponse.json(response, {status: 200})
}