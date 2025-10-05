'use client';

import {useState} from 'react';
import SubmitButton from '@/component/SubmitButton';
import {signIn} from 'next-auth/react';
import TextField from "@/component/inputs/TextField";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await signIn('credentials', {
      redirect: false, // NextAuth 기본 리다이렉트 비활성화
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      console.error('Login failed:', res.error);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else {
      console.log('Login success!');
      window.location.href = '/home'; // 로그인 성공 시 홈으로 이동
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-center">로그인</h1>
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <TextField id="email" label="이메일" type="email" required/>
          <TextField id="password" label="비밀번호" type="password" required/>
          
          <SubmitButton
            name={loading ? '로그인 중...' : '로그인'}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
