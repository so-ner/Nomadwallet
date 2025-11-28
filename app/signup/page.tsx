import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignUpContent from './_component/SignUpContent';
import { fetchTerms } from '@/lib/api/terms';
import type { TermItem } from '@/lib/api/terms';

export default async function SignUpPage() {
  // session이 있으면 홈으로 리다이렉트 (가입 정보 입력은 session 없을 때만)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect('/');
  }

  // 서버 사이드에서 약관 목록 가져오기
  let initialTerms: TermItem[] = [];
  try {
    initialTerms = await fetchTerms();
  } catch (error) {
    console.error('약관 목록 로드 실패:', error);
    // 에러가 발생해도 빈 배열로 진행
  }

  return (
    <Suspense fallback={<div className="flex flex-col items-center min-h-screen w-full px-5 py-8 bg-white">로딩중...</div>}>
      <SignUpContent initialTerms={initialTerms} />
    </Suspense>
  );
}
