import {NextResponse} from 'next/server'
import {supabase} from "@/lib/supabaseClient";
import {hashToken} from "@/lib/token";
import {hashPassword} from "@/lib/password";

/**
 * [POST] /api/user/reset-password
 * 비밀번호 재설정
 */
export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()
    if (!token || !newPassword)
      return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 })

    // 토큰 검증
    const tokenHash = await hashToken(token)
    const { data: record } = await supabase
      .from('password_reset_token')
      .select('user_id, expires_at')
      .eq('token', tokenHash)
      .maybeSingle();

    if (!record)
      return NextResponse.json({ message: '토큰이 유효하지 않습니다.' }, { status: 400 })
    if (new Date(record.expires_at) < new Date()) {
      await supabase.from('password_reset_token').delete().eq('token_hash', tokenHash)
      return NextResponse.json({ message: '토큰이 만료되었습니다.' }, { status: 400 })
    }

    // 비밀번호 해시 후 저장
    const hashed = await hashPassword(newPassword)
    const { error: updateErr } = await supabase
      .from('users')
      .update({ password: hashed })
      .eq('user_id', record.user_id)

    if (updateErr)
      return NextResponse.json({ message: '비밀번호 변경 실패' }, { status: 500 })

    // 사용 완료된 토큰 삭제
    await supabase.from('password_reset_token').delete().eq('user_id', record.user_id)

    return NextResponse.json({ message: '비밀번호가 변경되었습니다.' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: '비밀번호 변경에 실패했습니다.' }, { status: 500 })
  }
}
