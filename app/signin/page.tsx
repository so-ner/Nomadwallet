'use client'

import { useState } from 'react'
import SubmitButton from '@/component/SubmitButton'
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const res = await signIn('credentials', {
      redirect: false, // NextAuth 기본 리다이렉트 비활성화
      email,
      password,
    })

    setLoading(false)

    if (res?.error) {
      console.error('Login failed:', res.error)
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      console.log('Login success!')
      window.location.href = '/' // 로그인 성공 시 홈으로 이동
    }
  }

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await signIn('google', { callbackUrl: '/' }) // NextAuth가 알아서 Google OAuth 페이지로 이동
    } catch (err) {
      console.error('Google login error:', err)
      setError('Google 로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-center">로그인</h1>
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">이메일</span>
            <input
              name="email"
              type="email"
              className="border rounded-md p-2 w-full text-sm focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">비밀번호</span>
            <input
              name="password"
              type="password"
              className="border rounded-md p-2 w-full text-sm focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </label>
          <SubmitButton name={loading ? '로그인 중...' : '로그인'} disabled={loading} />
          {/* Google 로그인 버튼 */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="text-xs text-gray-400 px-2">또는</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
            Google로 로그인
          </span>
          </button>
        </form>
      </div>
    </div>
  )
}