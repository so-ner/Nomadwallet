'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// TODO: 비밀번호 변경 API 구현 후 import 활성화
// import { changePassword } from '@/lib/api/user';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import InputField from '@/component/InputField';
import Button from '@/component/Button';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",.<>/?]).{8,20}$/;

export default function PasswordChangePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/mypage/account');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    // 기존 비밀번호 검증
    if (!currentPassword.trim()) {
      setCurrentPasswordError('기존 비밀번호를 입력해주세요.');
      hasError = true;
    }

    // 새 비밀번호 검증
    if (!newPassword.trim()) {
      setNewPasswordError('새 비밀번호를 입력해주세요.');
      hasError = true;
    } else if (!passwordRegex.test(newPassword)) {
      setNewPasswordError('영문, 숫자, 특수문자를 포함한 8~20자로 입력해주세요.');
      hasError = true;
    }

    // 비밀번호 확인 검증
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }

    if (hasError) return;

    // TODO: 비밀번호 변경 API 구현 필요
    // API 엔드포인트: PATCH /api/user/password
    // 요청 본문: { currentPassword: string, newPassword: string }
    // 
    // 구현 예시:
    // setLoading(true);
    // try {
    //   await changePassword(currentPassword, newPassword);
    //   
    //   // 변경 완료 모달 표시
    //   showConfirm({
    //     title: '비밀번호 변경 완료',
    //     message: '비밀번호 변경이 완료되었습니다.',
    //     confirmText: '확인',
    //     onConfirm: () => {
    //       router.push('/mypage/account');
    //     },
    //   });
    // } catch (err: any) {
    //   const message = err?.message ?? '비밀번호 변경에 실패했습니다.';
    //   
    //   // 기존 비밀번호 오류인지 확인
    //   if (message.includes('기존 비밀번호')) {
    //     setCurrentPasswordError(message);
    //   } else if (message.includes('영문') || message.includes('8~20자')) {
    //     setNewPasswordError(message);
    //   } else {
    //     showToast(message);
    //   }
    // } finally {
    //   setLoading(false);
    // }
    
    // 임시: API 미구현 상태
    showToast('비밀번호 변경 API가 아직 구현되지 않았습니다.');
  };

  // 비밀번호 일치 여부 확인
  const getConfirmDescription = () => {
    if (confirmPasswordError) {
      return confirmPasswordError;
    }
    if (confirmPassword && newPassword && confirmPassword === newPassword) {
      return '* 비밀번호가 일치합니다.';
    }
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      return '* 비밀번호가 일치하지 않습니다.';
    }
    return '* 영문, 숫자, 특수 문자 포함 8자 이상 입력해주세요.';
  };

  const getConfirmDescriptionType = (): 'default' | 'success' | 'error' => {
    if (confirmPasswordError) {
      return 'error';
    }
    if (confirmPassword && newPassword && confirmPassword === newPassword) {
      return 'success';
    }
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      return 'error';
    }
    return 'default';
  };

  // 버튼 비활성화 조건: 비밀번호가 일치하지 않거나 필수 필드가 비어있거나 로딩 중
  const isFormValid = 
    currentPassword.trim() !== '' &&
    newPassword.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    passwordRegex.test(newPassword) &&
    newPassword === confirmPassword &&
    !loading;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        leftIcon={<Image src="/icons/icon-arrow_left-24.svg" alt="뒤로가기" width={24} height={24} />}
        text="비밀번호 재설정"
        onLeftClick={handleBack}
      />
      
      <main className="flex-1 px-8 py-8 pb-[calc(5.6rem+4rem)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <InputField
            label="기존 비밀번호"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setCurrentPasswordError('');
            }}
            placeholder="기존 비밀번호를 입력해주세요"
            showPasswordToggle
            description={currentPasswordError || undefined}
            descriptionType={currentPasswordError ? 'error' : 'default'}
            required
          />

          <InputField
            label="새 비밀번호"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setNewPasswordError('');
              // 새 비밀번호가 변경되면 확인 비밀번호도 다시 검증
              if (confirmPassword && e.target.value !== confirmPassword) {
                setConfirmPasswordError('');
              }
            }}
            placeholder="새 비밀번호를 입력해주세요"
            showPasswordToggle
            description={newPasswordError || '* 영문, 숫자, 특수 문자 포함 8자 이상 입력해주세요.'}
            descriptionType={newPasswordError ? 'error' : 'default'}
            required
          />

          <InputField
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError('');
            }}
            placeholder="새 비밀번호를 다시 입력해주세요"
            showPasswordToggle
            description={getConfirmDescription()}
            descriptionType={getConfirmDescriptionType()}
            required
          />
        </form>
      </main>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white md:left-1/2 md:-translate-x-1/2 md:max-w-[600px]">
        <div className="px-[2rem] py-[2rem]">
          <Button type="submit" variant="default" disabled={!isFormValid} onClick={handleSubmit as any}>
            {loading ? '변경 중...' : '변경하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}

