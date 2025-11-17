'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import InputField from '@/component/InputField';
import Button from '@/component/Button';
import {useToast} from '@/context/ToastContext';
import {resetPassword as resetPasswordApi} from '@/lib/api/auth';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",.<>/?]).{8,20}$/;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const {showToast} = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    setConfirmError('');
    setStatusMessage('');

    const formData = new FormData(e.currentTarget);
    const password = (formData.get('password') as string | null)?.trim() ?? '';
    const confirmPassword = (formData.get('confirmPassword') as string | null)?.trim() ?? '';

    let hasError = false;
    if (!passwordRegex.test(password)) {
      setPasswordError('영문, 숫자, 특수문자를 포함한 8~20자로 입력해주세요.');
      hasError = true;
    }

    if (confirmPassword !== password) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }

    if (!token) {
      showToast('유효하지 않은 링크입니다.');
      return;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await resetPasswordApi({token, newPassword: password});
      setStatusMessage(response.message ?? '비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      showToast(response.message ?? '비밀번호가 변경되었습니다.');
      setTimeout(() => router.push('/'), 1500);
    } catch (err: any) {
      const message = err?.message ?? '비밀번호 변경에 실패했습니다.';
      showToast(message);
      setPasswordError(message);
    } finally {
      setLoading(false);
    }
  };

  const isTokenMissing = !token;
  const confirmDescription = confirmError
    ? confirmError
    : confirmValue && passwordValue && confirmValue === passwordValue
      ? '* 비밀번호가 일치합니다.'
      : '* 영문, 숫자, 특수 문자 포함 8자 이상 입력해주세요.';
  const confirmDescriptionType = confirmError
    ? 'error'
    : confirmValue && passwordValue && confirmValue === passwordValue
      ? 'success'
      : 'default';

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
            <h1 style={{fontSize: '24px', fontWeight: 700, marginBottom: '0.8rem'}}>비밀번호 재설정</h1>
            <p style={{fontSize: '14px', lineHeight: '22px', color: '#616161'}}>
              비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.
            </p>
            {statusMessage && (
              <p style={{marginTop: '1rem', fontSize: '14px', lineHeight: '20px', color: '#60BA63'}}>{statusMessage}</p>
            )}
          </div>

          {isTokenMissing ? (
            <p style={{color: '#EB4F49', fontSize: '14px'}}>유효하지 않은 접근입니다. 다시 메일을 요청해주세요.</p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <InputField
                label="비밀번호"
                type="password"
                name="password"
                placeholder="비밀번호 입력"
                showPasswordToggle
                description={passwordError || '* 영문, 숫자, 특수 문자 포함 8자 이상 입력해주세요.'}
                descriptionType={passwordError ? 'error' : 'default'}
                onChange={(e) => {
                  setPasswordError('');
                  setPasswordValue((e.target as HTMLInputElement).value);
                }}
                required
              />

              <InputField
                label="비밀번호 확인"
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 입력"
                showPasswordToggle
                description={confirmDescription}
                descriptionType={confirmDescriptionType}
                onChange={(e) => {
                  setConfirmError('');
                  setConfirmValue((e.target as HTMLInputElement).value);
                }}
                required
              />

              <Button type="submit" variant="default" disabled={loading}>
                {loading ? '변경 중...' : '다음'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

