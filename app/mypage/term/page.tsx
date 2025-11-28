'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TopAreaSub from '@/component/top_area/TopAreaSub';

export default function TermsPage() {
  const router = useRouter();
  
  // Google Docs URL (iframe에 표시하기 위해 /preview로 변경)
  const termsUrl = 'https://docs.google.com/document/d/1JG--XEBkprF977N6-OLbqK_MQGi9djajLiK57MidHZE/preview';

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/mypage');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <TopAreaSub
        text="서비스 이용약관"
        onBack={handleBack}
      />
      
      <main className="flex-1 bg-grayscale-200 overflow-hidden">
        <iframe
          src={termsUrl}
          className="w-full h-full border-0"
          title="서비스 이용약관"
          style={{ height: '100%' }}
        />
      </main>
    </div>
  );
}

