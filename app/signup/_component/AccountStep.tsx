'use client';

import { useRef } from 'react';
import Button from '@/component/Button';
import InputField from '@/component/InputField';
import StepIndicator from './StepIndicator';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{\};:'",.<>/?]).{8,20}$/;

interface AccountStepProps {
  accountValues: { email: string; password: string; confirmPassword: string };
  accountErrors: { email?: string; password?: string; confirm?: string; general?: string };
  accountSuccess: { email?: boolean; confirm?: boolean };
  accountLoading: boolean;
  onAccountChange: (field: 'email' | 'password' | 'confirmPassword', value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AccountStep({
  accountValues,
  accountErrors,
  accountSuccess,
  accountLoading,
  onAccountChange,
  onSubmit,
}: AccountStepProps) {
  const formRef = useRef<HTMLFormElement>(null);
  
  const isValid =
    accountValues.email &&
    accountValues.password &&
    accountValues.confirmPassword &&
    emailRegex.test(accountValues.email) &&
    passwordRegex.test(accountValues.password) &&
    accountValues.password === accountValues.confirmPassword &&
    !accountErrors.email &&
    !accountErrors.password &&
    !accountErrors.confirm;

  return (
    <div className="flex flex-col min-h-screen pb-[calc(5rem+2rem)]">
      <div className="mt-[1rem] pt-[1.7rem] px-[2rem] pb-[1.6rem]">
        <StepIndicator current={2} />
      </div>
      <div className="pt-[1.4rem] px-[2rem] pb-[3.8rem]">
        <h1 className="text-headline-1 font-bold text-black">가입 정보를 입력해주세요</h1>
      </div>
      <div className="px-[2rem]">
        <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col">
          <InputField
            label="이메일 주소"
            type="email"
            name="email"
            placeholder="이메일 주소를 입력해주세요."
            value={accountValues.email}
            description={accountErrors.email}
            descriptionType={accountErrors.email ? 'error' : accountSuccess.email ? 'success' : undefined}
            onChange={(e) => onAccountChange('email', e.target.value)}
            required
          />
          <div className="mt-[4rem]">
            <InputField
              label="비밀번호"
              type="password"
              name="password"
              placeholder="비밀번호 입력"
              value={accountValues.password}
              showPasswordToggle
              description={accountErrors.password || '* 영문, 숫자, 특수 문자 포함 8자 이상 입력해주세요.'}
              descriptionType={accountErrors.password ? 'error' : 'default'}
              onChange={(e) => onAccountChange('password', e.target.value)}
              required
            />
          </div>
          <div className="mt-[2.6rem]">
            <InputField
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 입력"
              value={accountValues.confirmPassword}
              showPasswordToggle
              description={
                accountErrors.confirm
                  ? accountErrors.confirm
                  : accountSuccess.confirm
                    ? '* 비밀번호가 일치합니다.'
                    : undefined
              }
              descriptionType={accountErrors.confirm ? 'error' : accountSuccess.confirm ? 'success' : undefined}
              onChange={(e) => onAccountChange('confirmPassword', e.target.value)}
              required
            />
          </div>
          {accountErrors.general && <p className="text-sm text-[#EB4F49]">{accountErrors.general}</p>}
        </form>
      </div>
      
      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
        <Button
          type="button"
          variant={isValid ? 'default' : 'disabled'}
          disabled={!isValid || accountLoading}
          onClick={() => {
            if (formRef.current) {
              const event = new Event('submit', { cancelable: true, bubbles: true });
              formRef.current.dispatchEvent(event);
            }
          }}
          className="w-full"
        >
          {accountLoading ? '확인 중...' : '다음'}
        </Button>
      </div>
    </div>
  );
}

