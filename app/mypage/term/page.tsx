'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TermsIframeView from '@/component/TermsIframeView';

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
    <TermsIframeView
      url={termsUrl}
      title="서비스 이용약관"
      onBack={handleBack}
      isModal={false}
    />
  );
}

