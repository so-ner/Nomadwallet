import {NextResponse} from 'next/server'
import {supabase} from "@/lib/supabaseClient";
import {withAuth} from "@/lib/auth";

/**
 * [GET] /api/notification
 * 알림 기록 조회
 */
export const GET = withAuth(async (user, req) => {
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get('limit')) || 20
  const cursor = url.searchParams.get('cursor')

  let query = supabase
    .from('noti_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  // cursor가 있을 경우 해당 시점 이전 데이터만 가져오기
  if (cursor) query = query.lt('created_at', cursor)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 마지막 데이터 created_at을 nextCursor로 전달
  const nextCursor = data.length > 0 ? data[data.length - 1].created_at : null

  return NextResponse.json({
    notifications: data,
    nextCursor,
    hasMore: data.length === limit, // 20개이면 아직 더 있을 가능성이 높다로 판단
  }, {status: 201})
})