import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getProfileData } from '@/app/api/user/profile/route';
import CompleteContent from './_component/CompleteContent';

export default async function CompletePage() {
  const session = await getServerSession(authOptions);

  // 세션이 없으면 홈으로 리다이렉트
  if (!session?.user?.id) {
    redirect('/');
  }

  // 서버 사이드에서 프로필 정보 가져오기 (닉네임 우선)
  const profileData = await getProfileData(session.user.id);
  const userName = profileData?.nick_name || session.user.name || '유저';

  return <CompleteContent userName={userName} />;
}

