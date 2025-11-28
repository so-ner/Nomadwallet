'use client';

import { useRef } from 'react';
import Button from '@/component/Button';
import InputField from '@/component/InputField';
import StepIndicator from './StepIndicator';

interface NameStepProps {
  nameValue: string;
  nameError: string;
  onNameChange: (value: string) => void;
  onNameErrorChange: (error: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function NameStep({ nameValue, nameError, onNameChange, onNameErrorChange, onSubmit }: NameStepProps) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="flex flex-col min-h-screen pb-[calc(5rem+2rem)]">
      <div className="mt-[1rem] pt-[1.7rem] px-[2rem] pb-[1.6rem]">
        <StepIndicator current={1} />
      </div>
      <div className="pt-[1.4rem] px-[2rem] pb-[3.8rem]">
        <h1 className="text-headline-1 font-bold text-black">가입 정보를 입력해주세요</h1>
      </div>
      <div className="px-[2rem]">
        <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <InputField
            label="이름"
            name="fullName"
            placeholder="이름을 입력해주세요"
            value={nameValue}
            description={nameError || '* 실명을 입력해주세요.'}
            descriptionType={nameError ? 'error' : 'default'}
            onChange={(event) => {
              onNameErrorChange('');
              onNameChange((event.target as HTMLInputElement).value);
            }}
            required
          />
        </form>
      </div>
      
      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
        <Button
          type="button"
          variant={nameValue ? 'default' : 'disabled'}
          disabled={!nameValue}
          onClick={() => {
            if (formRef.current) {
              const event = new Event('submit', { cancelable: true, bubbles: true });
              formRef.current.dispatchEvent(event);
            }
          }}
          className="w-full"
        >
          다음
        </Button>
      </div>
    </div>
  );
}

