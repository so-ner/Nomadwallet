import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getProfileData } from '@/app/api/user/profile/route';
import ProfileSetupContent from './_component/ProfileSetupContent';

export default async function ProfileSetupPage() {
  // session이 없으면 홈으로 리다이렉트 (프로필 설정은 session 있을 때만)
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/');
  }

  // 서버 사이드에서 프로필 정보 가져오기 (API 로직 재사용)
  const profileData = await getProfileData(session.user.id);
  const initialNickname = profileData?.nick_name || null;
  const initialProfileImageUrl = profileData?.profile_image_url || null;

  return (
    <ProfileSetupContent
      initialNickname={initialNickname}
      initialProfileImageUrl={initialProfileImageUrl}
    />
  );
}

