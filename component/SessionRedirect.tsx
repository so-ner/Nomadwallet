'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/providers/session';

/**
 * 세션 기반 리다이렉트 컴포넌트
 * - 인증된 사용자의 is_onboarded 상태에 따라 리다이렉트
 * - is_onboarded: false → 프로필 설정 페이지 (/signup?step=4)
 * - is_onboarded: true → 홈 페이지 (/home)
 * 
 * 리다이렉트하지 않는 페이지:
 * - / (로그인 페이지 - 자체 로직 있음)
 * - /signup (회원가입 페이지)
 * - /onboard (온보딩 페이지)
 * - /permissions (권한 설정 페이지)
 */
export default function SessionRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {
    // 세션이 없으면 리다이렉트하지 않음
    if (!session?.user?.id) return;

    // 리다이렉트하지 않아야 하는 페이지들
    const excludedPaths = ['/', '/signup', '/onboard', '/permissions'];
    if (pathname && excludedPaths.some(path => pathname.startsWith(path))) {
      return;
    }

    // is_onboarded 상태에 따라 리다이렉트
    if (session.user.is_onboarded === false) {
      // 프로필 설정이 완료되지 않은 경우 프로필 설정 페이지로 이동
      router.replace('/signup?step=4');
    } else if (session.user.is_onboarded === true) {
      // 온보딩이 완료된 경우 홈으로 이동 (이미 홈에 있으면 리다이렉트하지 않음)
      if (pathname !== '/home' && pathname !== '/expense' && pathname !== '/budget') {
        router.replace('/home');
      }
    }
  }, [session, pathname, router]);

  return null;
}

