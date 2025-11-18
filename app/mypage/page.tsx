import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import MyPageClient from './MyPageClient';

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/');
  }

  return <MyPageClient />;
}
