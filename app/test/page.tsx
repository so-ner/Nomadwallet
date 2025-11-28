'use client';

import Image from 'next/image';
import TopAreaMain from '@/component/top_area/TopAreaMain';
import TopAreaSub from '@/component/top_area/TopAreaSub';

export default function TestPage() {
  return (
    <div className="p-5 space-y-4">
      {/* Main 컴포넌트 */}
      <TopAreaMain 
        title="마이페이지" 
        notificationUrl="/notification"
        hasNotification={true}
      />

      {/* Sub 컴포넌트 - 왼쪽 아이콘, 가운데 텍스트, 오른쪽 아이콘 */}
      <TopAreaSub
        text="알림"
        rightElement={<span>X</span>}
        onBack={() => console.log('뒤로가기')}
        onRightClick={() => console.log('닫기')}
      />

      {/* Sub 컴포넌트 - 왼쪽 아이콘, 가운데 텍스트, 오른쪽 텍스트 */}
      <TopAreaSub
        text="영수증 스캔"
        rightElement="삭제"
        onBack={() => console.log('뒤로가기')}
        onRightClick={() => console.log('삭제')}
      />
    </div>
  );
}





