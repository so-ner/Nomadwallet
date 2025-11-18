'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import NotificationToggle from '../_component/NotificationToggle';
import { useToast } from '@/context/ToastContext';

export default function NotificationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [serviceNotification, setServiceNotification] = useState(true);
  const [adNotification, setAdNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: 서버에서 알림 설정 불러오기
    // 현재는 기본값 사용
  }, [session]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/mypage');
    }
  };

  const handleServiceNotificationChange = async (enabled: boolean) => {
    setLoading(true);
    try {
      // TODO: API 호출하여 서비스 알림 설정 저장
      setServiceNotification(enabled);
      showToast(enabled ? '서비스 알림이 활성화되었습니다.' : '서비스 알림이 비활성화되었습니다.');
    } catch (err: any) {
      showToast('알림 설정 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdNotificationChange = async (enabled: boolean) => {
    setLoading(true);
    try {
      // TODO: API 호출하여 광고 알림 설정 저장
      setAdNotification(enabled);
      showToast(enabled ? '광고 알림이 활성화되었습니다.' : '광고 알림이 비활성화되었습니다.');
    } catch (err: any) {
      showToast('알림 설정 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        leftIcon={<span>←</span>}
        text="알림"
        onLeftClick={handleBack}
      />
      
      <main className="flex-1 border-t border-grayscale-200">
        <NotificationToggle
          label="서비스 알림"
          enabled={serviceNotification}
          onChange={handleServiceNotificationChange}
          disabled={loading}
        />
        <NotificationToggle
          label="광고 알림"
          enabled={adNotification}
          onChange={handleAdNotificationChange}
          disabled={loading}
        />
      </main>
    </div>
  );
}
