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
        leftIcon={<Image src="/icons/icon-arrow_left-24.svg" alt="뒤로가기" width={24} height={24} />}
        text="알림"
        rightElement={<span>X</span>}
        onLeftClick={() => console.log('뒤로가기')}
        onRightClick={() => console.log('닫기')}
      />

      {/* Sub 컴포넌트 - 왼쪽 아이콘, 가운데 텍스트, 오른쪽 텍스트 */}
      <TopAreaSub
        leftIcon={<Image src="/icons/icon-arrow_left-24.svg" alt="뒤로가기" width={24} height={24} />}
        text="영수증 스캔"
        rightElement="삭제"
        onLeftClick={() => console.log('뒤로가기')}
        onRightClick={() => console.log('삭제')}
      />
    </div>
  );
}





