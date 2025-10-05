'use client'

import {createContext, useContext, useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {signOut} from 'next-auth/react'
import type {Session} from 'next-auth'

// 전역 세션 Context
const SessionContext = createContext<Session | null>(null)

export const SessionProvider = ({children}: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch(() => setSession(null))
  }, [pathname])

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut({redirect: false}) // 세션 쿠키 제거
      setSession(null)
      window.location.href = '/' // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <SessionContext.Provider value={{...session, handleLogout} as any}>
      {children}
    </SessionContext.Provider>
  )
}

// 클라이언트 컴포넌트에서 세션을 구독하는 Hook
export const useSession = () => useContext(SessionContext)