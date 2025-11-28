'use client';

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
  return (
    <>
      <div style={{ padding: '0 2rem', marginTop: '2rem' }}>
        <StepIndicator current={1} />
        <h1 className="text-[24px] font-bold text-[#111827] leading-[32px] mt-4">이름을 입력해주세요</h1>
      </div>
      <div className="mt-4 px-5">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <InputField
            label="이름"
            name="fullName"
            placeholder="이름을 입력해주세요"
            description={nameError || '* 실명을 입력해주세요.'}
            descriptionType={nameError ? 'error' : 'default'}
            onChange={(event) => {
              onNameErrorChange('');
              onNameChange((event.target as HTMLInputElement).value);
            }}
            required
          />
          <Button type="submit" variant={nameValue ? 'default' : 'disabled'} disabled={!nameValue}>
            다음
          </Button>
        </form>
      </div>
    </>
  );
}

