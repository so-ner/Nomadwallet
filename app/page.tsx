'use client';

import styles from './page.module.css';
import Link from 'next/link';
import {useState} from 'react';
import {signIn} from 'next-auth/react';

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signIn('google', {callbackUrl: '/home'}); // NextAuth가 알아서 Google OAuth 페이지로 이동
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/signin">
          <button type="button">이메일로 로그인</button>
        </Link>
        <Link href="/signup">
          <button type="button">이메일로 회원가입</button>
        </Link>
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
      </main>
    </div>
  );
}
