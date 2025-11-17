'use client';

import {useState} from 'react';
import Link from 'next/link';
import InputField from '@/component/InputField';
import Button from '@/component/Button';
import {useToast} from '@/context/ToastContext';
import {requestPasswordReset} from '@/lib/api/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const {showToast} = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage('');
    setEmailError('');

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string | null)?.trim() ?? '';

    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset({email});
      setStatusMessage(response.message ?? '입력하신 이메일로 비밀번호 재설정 안내를 발송했습니다.');
      showToast(response.message ?? '비밀번호 재설정 메일을 발송했어요.');
      e.currentTarget.reset();
    } catch (err: any) {
      const message = err?.message ?? '비밀번호 재설정 메일 발송에 실패했습니다.';
      setEmailError(message);
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-5 py-8">
      <div className="w-full max-w-[600px] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Link href="/" style={{fontSize: '20px', color: '#212121'}}>
            ←
          </Link>
          <span style={{fontSize: '16px', color: '#212121'}}>로그인으로 돌아가기</span>
        </div>

        <div style={{padding: '0 2rem', marginTop: '2.4rem', display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
          <div>
            <h1 style={{fontSize: '24px', fontWeight: 700, marginBottom: '0.8rem'}}>비밀번호 찾기</h1>
            <p style={{fontSize: '14px', lineHeight: '22px', color: '#616161'}}>
              기존에 가입하신 이메일을 입력하시면,
              <br/>
              비밀번호 변경 메일을 발송해드립니다.
            </p>
            {statusMessage && (
              <p style={{marginTop: '1rem', fontSize: '14px', lineHeight: '20px', color: '#60BA63'}}>{statusMessage}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <InputField
              label="이메일 주소"
              type="email"
              name="email"
              placeholder="이메일 주소를 입력해주세요."
              description={emailError}
              descriptionType={emailError ? 'error' : undefined}
              onChange={() => setEmailError('')}
              required
            />

            <Button type="submit" variant="default" disabled={loading}>
              {loading ? '전송 중...' : '다음'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

