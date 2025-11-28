import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import OnboardContent from './_component/OnboardContent';

export default async function OnboardPage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || '노마드월렛';

  // 세션이 없으면 홈으로 리다이렉트
  if (!session?.user?.id) {
    redirect('/');
  }

  return <OnboardContent userName={userName} />;
}

