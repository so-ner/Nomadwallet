'use client'

import { createContext, useContext } from 'react'
import { SessionProvider as NextAuthProvider, useSession as useNextSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

// 세션 Context 타입 정의
type ExtendedSession = Session & {
  handleLogout?: () => Promise<void>
}

// 전역 세션 Context
const SessionContext = createContext<ExtendedSession | null>(null)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthProvider>
      <InnerSessionProvider>{children}</InnerSessionProvider>
    </NextAuthProvider>
  )
}

// 내부 Provider — 실제 세션값과 handleLogout 연결
const InnerSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useNextSession()

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/', redirect: true })
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <SessionContext.Provider value={{ ...(session as Session), handleLogout }}>
      {children}
    </SessionContext.Provider>
  )
}

// 커스텀 훅
export const useSession = () => useContext(SessionContext)