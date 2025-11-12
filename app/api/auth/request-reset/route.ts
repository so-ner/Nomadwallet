import {NextResponse} from 'next/server'
import {sendPasswordResetMail} from '@/lib/mail'
import {supabase} from "@/lib/supabaseClient";
import {generateRawToken, hashToken} from "@/lib/token";
import {supabaseAdmin} from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const {email} = await req.json()
    if (!email)
      return NextResponse.json({message: '이메일을 입력하세요.'}, {status: 400})

    // SNS 유저 확인
    const {data: user, error} = await supabase
      .from('users')
      .select(`
        user_id,
        email,
        user_map: user_map(public_user_id)
      `)
      .eq('email', email)
      .maybeSingle();
    if (error) return NextResponse.json({error: error.message}, {status: 500})
    if (!user) return NextResponse.json(
      {message: '해당 이메일로 가입된 정보가 없습니다.'},
      {status: 404}
    );

    // user_map이 없을 수 있으므로 안전하게 확인
    const hasMapping = Array.isArray(user?.user_map) && user.user_map.length > 0;
    if (hasMapping) return NextResponse.json(
      {message: 'SNS 로그인 계정은 비밀번호를 재설정할 수 없습니다.'},
      {status: 500}
    );

    // 토큰 생성 및 해시 저장
    const rawToken = await generateRawToken()
    const tokenHash = await hashToken(rawToken)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString() // 30분 유효

    // 기존 토큰 제거 후 새 토큰 저장
    await supabaseAdmin
      .from('password_reset_token')
      .delete()
      .eq('user_id', user.user_id);

    const { error: insertErr } = await supabaseAdmin
      .from('password_reset_token')
      .insert({
        user_id: user.user_id,
        token: tokenHash,
        expires_at: expiresAt,
      });
    if (insertErr) return NextResponse.json({ insertErr }, { status: 500 })

    // 이메일 발송
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${rawToken}`
    await sendPasswordResetMail(email, resetUrl)

    return NextResponse.json({message: '비밀번호 재설정 메일이 발송되었습니다.'}, {status: 200})
  } catch (e) {
    console.error(e)
    return NextResponse.json({message: '메일 발송에 실패했습니다.'}, {status: 500})
  }
}