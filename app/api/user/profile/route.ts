import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAuth } from '@/lib/auth';

export interface ProfileData {
  nick_name: string | null;
  profile_image_url: string | null;
}

/**
 * 사용자 프로필 정보 조회 로직
 * API 라우트와 서버 컴포넌트에서 공통으로 사용
 * @param userId 사용자 ID
 * @returns 프로필 정보 또는 null (에러 발생 시)
 */
export async function getProfileData(userId: string): Promise<ProfileData | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('nick_name, profile_image_url')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('프로필 정보 조회 실패:', error);
    return null;
  }

  return {
    nick_name: data?.nick_name || null,
    profile_image_url: data?.profile_image_url || null,
  };
}

/**
 * [GET] /api/user/profile
 * 사용자 프로필 정보 조회 (닉네임, 프로필 이미지 URL)
 */
export const GET = withAuth(async (user, req) => {
  const profileData = await getProfileData(user.id);

  if (!profileData) {
    return NextResponse.json({ error: '프로필 정보를 가져오지 못했습니다.' }, { status: 500 });
  }

  return NextResponse.json(profileData, { status: 200 });
});

