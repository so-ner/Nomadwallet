import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

/**
 * 인증이 필요한 API 핸들러
 * @param handler
 */
export function withAuth(handler: (user: any, req: Request, context?: any) => Promise<Response>) {
  return async (req: Request, context?: any) => {
    // 세션 가져오기
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 세션의 user 정보를 handler로 전달
    return handler(session.user, req, context)
  }
}