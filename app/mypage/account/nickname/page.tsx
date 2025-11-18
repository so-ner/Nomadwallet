'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getNickname, updateNickname } from '@/lib/api/user';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import InputField from '@/component/InputField';
import Button from '@/component/Button';

export default function NicknameChangePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        setFetching(true);
        const response = await getNickname();
        const currentNickname = response.nick_name || '';
        setNickname(currentNickname);
        setOriginalNickname(currentNickname);
      } catch (err: any) {
        const message = err?.message ?? '닉네임을 가져오는데 실패했습니다.';
        showToast(message);
      } finally {
        setFetching(false);
      }
    };

    fetchNickname();
  }, [showToast, showConfirm]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/mypage/account');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNicknameError('');

    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim() === originalNickname) {
      setNicknameError('기존 닉네임과 동일합니다.');
      return;
    }

    setLoading(true);
    try {
      await updateNickname(nickname.trim());
      await update();
      
      // 변경된 닉네임으로 업데이트
      const response = await getNickname();
      const updatedNickname = response.nick_name || '';
      setNickname(updatedNickname);
      setOriginalNickname(updatedNickname);
      
      // 변경 완료 모달 표시
      showConfirm({
        title: '닉네임 변경 완료',
        message: '닉네임 변경이 완료되었습니다.',
        confirmText: '확인',
        onConfirm: () => {
          // 팝업만 닫기 (페이지 이동 없음)
        },
      });
    } catch (err: any) {
      const message = err?.message ?? '닉네임 변경에 실패했습니다.';
      setNicknameError(message);
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  const isChanged = nickname.trim() !== originalNickname && nickname.trim() !== '';
  const isDisabled = !isChanged || loading || !nickname.trim();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        leftIcon={<span>←</span>}
        text="계정 관리"
        onLeftClick={handleBack}
      />
      
      <main className="flex-1 px-8 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <InputField
            label="닉네임"
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError('');
            }}
            description={nicknameError || '* 닉네임을 입력해주세요.'}
            descriptionType={nicknameError ? 'error' : 'default'}
            placeholder="닉네임을 입력해주세요"
            maxLength={20}
            rightButton={
              <button
                type="submit"
                disabled={isDisabled}
                style={{
                  height: '5.4rem',
                  padding: '0 2.4rem',
                  borderRadius: '1.2rem',
                  backgroundColor: isDisabled ? '#B6C4CC' : '#406686',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#487290';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#406686';
                  }
                }}
                onMouseDown={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#35586E';
                  }
                }}
                onMouseUp={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#487290';
                  }
                }}
              >
                {loading ? '변경 중...' : '변경'}
              </button>
            }
          />
        </form>
      </main>
    </div>
  );
}

