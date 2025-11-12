import {NextResponse} from 'next/server'
import {withAuth} from "@/lib/auth";
import {supabaseAdmin} from "@/lib/supabaseAdmin";

/**
 * [DELETE] /api/user/withdraw
 * 회원탈퇴
 */
export const DELETE = withAuth(async (user, req): Promise<Response> => {
  try {
    // 내부 트랜잭션 함수 호출
    const {error: rpcError} = await supabaseAdmin.rpc('delete_user_all_data', {
      target_user_id: user.id,
    })

    if (rpcError)
      return NextResponse.json({error: rpcError.message}, {status: 500})

    return NextResponse.json({message: '회원탈퇴가 완료되었습니다.'}, {status: 200})
  } catch (err: any) {
    console.error('회원탈퇴 실패:', err)
    return NextResponse.json({error: err.message}, {status: 500})
  }
})
