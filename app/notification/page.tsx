'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TopAreaSub from '@/component/top_area/TopAreaSub';

export default function NotificationListPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // TODO: API 호출하여 알림 목록 불러오기
        // const response = await fetch('/api/notification');
        // const data = await response.json();
        // setNotifications(data.notifications || []);
        setNotifications([]); // 임시로 빈 배열
      } catch (error) {
        console.error('알림 목록 로드 실패:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const hasData = notifications.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaSub
        text="알림"
        onBack={handleBack}
      />
      
      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-body-2 text-grayscale-600">로딩 중...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center pt-40 px-4 pb-12 text-center">
            <div className="mb-8 flex items-center justify-center">
              <Image
                src="/empty-alirm.png"
                alt="알림 없음"
                width={200}
                height={200}
                priority
                className="grayscale"
              />
            </div>
            <h2 className="text-headline-1 text-grayscale-600 mt-[32px] mb-2">최근 받은 알림이 없어요</h2>
          </div>
        ) : (
          <div className="p-4">
            {/* TODO: 알림 목록 렌더링 */}
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b border-grayscale-200">
                {/* 알림 아이템 */}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

