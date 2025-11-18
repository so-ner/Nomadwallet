'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { withdraw } from '@/lib/api/user';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import MenuItem from '../_component/MenuItem';
import AccountActionItem from '../_component/AccountActionItem';

export default function AccountPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/mypage');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/', redirect: true });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      showToast('로그아웃에 실패했습니다.');
    }
  };

  const handleWithdraw = () => {
    showConfirm({
      title: '회원 탈퇴',
      message: '탈퇴 시 모든 계정 정보와 이용 내역이\n삭제되며, 복구할 수 없습니다.\n정말 탈퇴를 진행하시겠습니까?',
      confirmText: '탈퇴하기',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          setLoading(true);
          await withdraw();
          
          // 로그아웃 (리다이렉트 없이)
          await signOut({ redirect: false });
          
          // 토스트 메시지 표시 후 첫 페이지로 이동
          showToast('탈퇴가 정상적으로 완료되었습니다.');
          router.push('/');
        } catch (err: any) {
          const message = err?.message ?? '회원탈퇴에 실패했습니다.';
          showToast(message);
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        leftIcon={<span>←</span>}
        text="계정관리"
        onLeftClick={handleBack}
      />
      
      <main className="mt-[12px] flex-1">
        <MenuItem title="닉네임 변경" href="/mypage/account/nickname" />
        <MenuItem title="비밀번호 재설정" href="/mypage/account/password" />
        <div className="w-full h-[8px] bg-secondary-100" />
        <AccountActionItem
            title="로그아웃"
            onClick={handleLogout}
          />
          <AccountActionItem
            title="회원탈퇴"
            onClick={handleWithdraw}
          />
      </main>
    </div>
  );
}
