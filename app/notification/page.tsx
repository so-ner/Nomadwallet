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
        <Image
          src="/screenshot.png"
          alt="Screenshot"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
      </main>
    </div>
  );
}

