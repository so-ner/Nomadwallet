'use client';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputField from '@/component/InputField';
import Button from '@/component/Button';
import Logo from '@/component/auth/Logo';
import SocialLoginButtons from '@/component/auth/SocialLoginButtons';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (session?.user?.is_onboarded) {
      router.replace('/expense');
    } else {
      // is_onboarded가 false인 경우 프로필 설정 페이지로 이동
      // 회원가입 플로우의 Step 4 (프로필 설정)로 이동
      router.replace('/signup?step=4');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 유효성 검사
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 에러 초기화
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    // 이메일 유효성 검사
    if (!email || email.trim() === '') {
      setEmailError('이메일을 입력해주세요.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      hasError = true;
    }

    // 비밀번호 유효성 검사
    if (!password || password.trim() === '') {
      setPasswordError('비밀번호를 입력해주세요.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {

      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password: password.trim(),
      });

      setLoading(false);

      if (res?.error) {
        console.error('Login failed:', res.error);
        // NextAuth 에러 메시지에 따라 적절한 메시지 표시
        let errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        if (res.error.includes('이메일') || res.error.includes('계정')) {
          errorMessage = '해당 이메일의 계정이 존재하지 않습니다.';
        } else if (res.error.includes('비밀번호')) {
          errorMessage = '비밀번호가 올바르지 않습니다.';
        }
        showToast(errorMessage);
      } else if (!res?.ok) {
        const errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
        showToast(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
      showToast(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      {/* 로고 영역 */}
      <Logo />

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col" style={{ maxWidth: '600px' }}>
        <div
          style={{
            padding: '1rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.8rem',
          }}
        >
          <InputField
            label="이메일"
            type="email"
            name="email"
            placeholder="이메일 주소 입력"
            description={emailError}
            descriptionType={emailError ? 'error' : undefined}
            onChange={() => setEmailError('')}
            required
          />

          <InputField
            label="비밀번호"
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            showPasswordToggle
            description={passwordError}
            descriptionType={passwordError ? 'error' : undefined}
            onChange={() => setPasswordError('')}
            required
          />
        </div>

        {/* 비밀번호 찾기 영역 */}
        <div
          style={{
            padding: '0.6rem 2rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Link
            href="/find-password"
            style={{
              fontSize: '14px',
              lineHeight: '17px',
              fontWeight: 500,
              color: '#212121',
              textDecoration: 'none',
            }}
          >
            비밀번호 찾기
          </Link>
        </div>

        {/* 로그인/회원가입 버튼 그룹 */}
        <div
          style={{
            padding: '1.6rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          <Button type="submit" disabled={loading} variant="default">
            {loading ? '로그인 중...' : '로그인하기'}
          </Button>

          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <Button type="button" variant="line">
              회원가입 하기
            </Button>
          </Link>
        </div>
      </form>

      {/* 간편 로그인 */}
      <SocialLoginButtons />
    </div>
  );
}
