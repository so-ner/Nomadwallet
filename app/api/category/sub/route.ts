import {withAuth} from "@/lib/auth";
import {NextResponse} from 'next/server'
import {supabase} from "@/lib/supabaseClient";
import {supabaseAdmin} from "@/lib/supabaseAdmin";

/**
 * [GET] /api/category/sub?major=HOUSING
 * 사용자의 카테고리별 소분류 조회
 */
export const GET = withAuth(async (user, req) => {
  const url = new URL(req.url)
  const major = url.searchParams.get('major')

  if (!major) {
    return NextResponse.json({error: 'Major is required'}, {status: 400})
  }

  const {data, error} = await supabase
    .from('category_sub')
    .select('*')
    .eq('user_id', user.id)
    .eq('major', major)
  if (error) return NextResponse.json({error: error.message}, {status: 500})

  return NextResponse.json(data, {status: 200})
})

/**
 * [POST] /api/category/sub
 * 사용자의 카테고리별 소분류 생성
 */
export const POST = withAuth(async (user, req): Promise<Response> => {
  try {
    const body = await req.json()

    const {data, error} = await supabaseAdmin
      .from('category_sub')
      .insert({...body, user_id: user.id})
      .select()
    if (error) return NextResponse.json({error: error.message}, {status: 400})

    if (!data || data.length === 0) {
      return NextResponse.json({error: 'SubCategory not found'}, {status: 404});
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
})