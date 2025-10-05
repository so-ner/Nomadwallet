'use client';

import {useState} from 'react';
import {signIn} from 'next-auth/react';
import SubmitButton from '@/component/SubmitButton';
import TextField from "@/component/inputs/TextField";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      name,
      phone,
    });

    setLoading(false);

    if (res?.error) {
      console.error('회원가입 실패:', res.error);
      setError(res.error);
    } else {
      console.log('회원가입 및 로그인 성공!');
      window.location.href = '/home'; // 로그인 후 홈으로 이동
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-center">회원가입</h1>
        {error && (
          <p className="text-red-500 text-center text-sm mb-2">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <TextField id="name" label="이름" type="text" required/>
          <TextField id="email" label="이메일" type="text" required/>
          <TextField id="password" label="비밀번호" type="password" required/>
          <TextField id="phone" label="전화번호(선택)" type="text" placeholder='01012345678'/>
          <SubmitButton
            name={loading ? '회원가입 중...' : '회원가입'}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
