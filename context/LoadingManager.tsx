'use client';

import { useEffect } from 'react';
import { useLoading } from './LoadingContext';
import { setLoadingManager } from '@/lib/api/fetch';

/**
 * LoadingContext와 apiFetch를 연결하는 컴포넌트
 * layout.tsx에서 사용하여 전역 로딩 관리를 활성화합니다.
 */
export function LoadingManager() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoadingManager({ setLoading });
  }, [setLoading]);

  return null;
}

