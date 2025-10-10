import {supabaseAdmin} from "@/lib/supabaseAdmin"
import {supabase} from "@/lib/supabaseClient"
import { NextResponse } from 'next/server'
import {withAuth} from "@/lib/auth";

// 여행 예산 상세 API (Travel Detail)
// 조회
export const GET = withAuth(async (user, req, contextPromise) => {
  const { params } = await contextPromise;
  // TODO param properties 확인 필요
  const travelId = params.travel_id;

  // params의 travel_id로 여행예산 조회
  const { data, error } = await supabase
    .from('travel')
    .select('*')
    .eq('travel_id', travelId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
})

// 수정(PATCH, admin으로 진행할 것)


// 삭제(DELETE, admin으로 진행할 것)
