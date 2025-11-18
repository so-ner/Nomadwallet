'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { getNickname } from '@/lib/api/user';
import { changeProfileImage, ProfileState } from '@/lib/api/storage';
import { useToast } from '@/context/ToastContext';
import TopAreaMain from '@/component/top_area/TopAreaMain';
import NavigationBar from '@/component/NavigationBar';
import MenuItem from './_component/MenuItem';

function getProfileImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/profile_1.png';
  }
  
  if (imageUrl.startsWith('basic/')) {
    const key = imageUrl.replace('basic/', '').replace('.jpg', '');
    return `/profile_${key}.png`;
  }
  
  // 업로드된 이미지인 경우
  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  const bucketName = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;
  if (r2PublicUrl && bucketName) {
    const key = imageUrl.split('?')[0]; // timestamp 제거
    return `${r2PublicUrl}/${bucketName}/${key}`;
  }
  
  return '/profile_1.png';
}

export default function MyPageClient() {
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('사용자');

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await getNickname();
        setDisplayName(response.nick_name || '사용자');
      } catch (err) {
        // 에러 발생 시 session에서 fallback
        if (session?.user) {
          const fallbackName = session.user.nick_name || session.user.user_name || session.user.name || '사용자';
          setDisplayName(fallbackName);
        }
      }
    };

    if (session?.user?.id) {
      fetchNickname();
    }
  }, [session]);

  if (!session?.user?.id) {
    return null;
  }

  const profileImageUrl = getProfileImageUrl(session.user.profile_image_url);
  
  const profileState: ProfileState = session.user.profile_image_url?.startsWith('basic/') ? 'basic' : 'upload';
  const currentKey = profileState === 'upload' ? session.user.profile_image_url?.split('?')[0] : undefined;

  const handleProfileEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      try {
        setLoading(true);
        await changeProfileImage({
          from: profileState,
          to: 'upload',
          file,
          currentKey: currentKey || undefined,
        });
        
        await update();
        showToast('프로필 사진이 변경되었습니다.');
      } catch (err) {
        showToast('프로필 사진 변경이 실패되었습니다.');
      } finally {
        setLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopAreaMain title="마이페이지" />
      
      <main className="flex-1">
        {/* 프로필 영역 */}
        <div className="flex items-center pl-[20px] pt-[22px] pb-[20px] gap-[20px]">
          <div className="relative">
            <div className="w-[80px] h-[80px] rounded-[20px] flex items-center justify-center overflow-hidden">
              <img
                src={profileImageUrl}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleProfileEditClick}
              disabled={loading}
              className="absolute -bottom-1 -right-1 w-[2.4rem] h-[2.4rem] flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <Image
                src="/icons/icon-modify-36.svg"
                alt="프로필 수정"
                width={36}
                height={36}
                className="w-[2.4rem] h-[2.4rem]"
              />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </div>
          <div className="text-subhead-1 text-grayscale-900" style={{ fontSize: '20px' }}>
            {displayName}
          </div>
        </div>

        <MenuItem title="계정관리" href="/mypage/account" />
        <div className="w-full h-[8px] bg-secondary-100" />
        <MenuItem title="알림" href="/mypage/notification" />
        <MenuItem title="서비스 이용약관" href="/mypage/term" />
        <MenuItem title="버전정보">v.0.1</MenuItem>
      </main>

      <NavigationBar />
    </div>
  );
}

