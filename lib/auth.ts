import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

/**
 * 인증이 필요한 API 핸들러
 * @param handler
 */
export function withAuth( handler: (user: any, req: Request, context: any) => Promise<Response>
) {
  return async (req: Request, contextPromise?: any) => {
    // contextPromise가 Promise인 경우 await으로 풀기
    const context = contextPromise && typeof contextPromise.then === 'function'
      ? await contextPromise
      : contextPromise

    // 세션 가져오기
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 세션의 user 정보를 handler로 전달
    return handler(session.user, req, context)
  }
}

/**
 * 서버 세션을 검사하여 인증된 사용자만 통과시키는 함수
 * - 세션이 없거나 유효하지 않으면 401 응답을 반환
 * - 세션이 존재하면 user 객체를 반환
 *
 * @returns 인증된 사용자 정보 또는 NextResponse (Unauthorized)
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session.user
}