'use client';

import Button from '@/component/Button';
import InputField from '@/component/InputField';
import StepIndicator from './StepIndicator';

interface ProfileStepProps {
  nickname: string;
  nicknameError: string;
  profilePreview: string | null;
  profileLoading: boolean;
  onNicknameChange: (value: string) => void;
  onNicknameErrorChange: (error: string) => void;
  onProfileFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProfileStep({
  nickname,
  nicknameError,
  profilePreview,
  profileLoading,
  onNicknameChange,
  onNicknameErrorChange,
  onProfileFileChange,
  onSubmit,
}: ProfileStepProps) {
  return (
    <>
      <div style={{ padding: '0 2rem', marginTop: '2rem' }}>
        <StepIndicator current={3} />
        <h1 className="text-[24px] font-bold text-[#111827] leading-[32px] mt-4">프로필과 닉네임을 설정해주세요</h1>
      </div>
      <div className="mt-4 px-5">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-40 h-40 rounded-3xl bg-[#EEF2F7] flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePreview} alt="profile preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm text-[#6B7280]">디폴트 이미지</span>
                )}
              </div>
              <label className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#424242] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#616161] transition-colors">
                <span className="text-lg">✎</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onProfileFileChange(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <InputField
            label="닉네임"
            name="nickname"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            description={nicknameError || '* 앞으로 보여질 닉네임이에요.'}
            descriptionType={nicknameError ? 'error' : 'default'}
            onChange={(e) => {
              onNicknameChange(e.target.value);
              onNicknameErrorChange('');
            }}
            required
          />

          <Button type="submit" variant="default" disabled={profileLoading}>
            {profileLoading ? '저장 중...' : '다음'}
          </Button>
        </form>
      </div>
    </>
  );
}

