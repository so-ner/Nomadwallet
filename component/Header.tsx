'use client'

import Link from 'next/link'
import {useSession} from '@/providers/session'

export default function Header() {
  const session: any = useSession()

  return (
    <header className="p-4 flex justify-between items-center border-b">
      <h1 className="text-lg font-bold">노마드 월렛</h1>
      <nav className="flex gap-4 items-center">
        {session?.user ? (
          <>
            <span>{session.user.name}</span>
            <button
              type="submit"
              onClick={session.handleLogout}
              className="border px-3 py-1 rounded-md hover:bg-gray-100"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
          </>
        )}
      </nav>
    </header>
  )
}