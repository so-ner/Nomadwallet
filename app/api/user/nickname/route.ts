import {NextResponse} from 'next/server'
import {supabaseAdmin} from "@/lib/supabaseAdmin";
import {withAuth} from "@/lib/auth";

/**
 * [GET] /api/user/nickname
 * 사용자 닉네임 조회
 */
export const GET = withAuth(async (user, req) => {
  const {data, error} = await supabaseAdmin
    .from('users')
    .select('nick_name')
    .eq('user_id', user.id)
  if (error) return NextResponse.json({error: error.message}, {status: 500})

  return NextResponse.json(data, {status: 200})
})

/**
 * [PATCH] /api/user/nickname
 * 닉네임 수정
 */
export const PATCH = withAuth(async (user, req): Promise<Response> => {
  try {
    const body = await req.json()
    const {nickname} = body

    if (!nickname || nickname.trim() === '') {
      return NextResponse.json({error: '닉네임을 입력해주세요.'}, {status: 400})
    }

    // profiles 테이블 기준으로 닉네임 업데이트
    const {error} = await supabaseAdmin
      .from('users')
      .update({nick_name: nickname})
      .eq('id', user.id)

    if (error)
      return NextResponse.json({error: error.message}, {status: 500})

    return NextResponse.json({message: '닉네임이 변경되었습니다.'}, {status: 200})
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
})