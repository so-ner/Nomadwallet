'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import Button from '@/component/Button';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import { fetchTerms, TermItem } from '@/lib/api/terms';
import { submitConsents, ConsentPayload } from '@/lib/api/onboard';

interface PermissionItem {
  id: string;
  type: string;
  description: string[];
  required: boolean;
  icon: string;
}

const permissionItems: PermissionItem[] = [
  {
    id: 'location',
    type: '[필수] 위치 정보',
    description: [
      '위치 기반으로 서비스를 제공합니다.',
      '정확한 이용을 위해 위치 정보',
      '접근 권한이 필요해요',
    ],
    required: true,
    icon: 'location',
  },
  {
    id: 'notification',
    type: '[선택] 알림',
    description: [
      '서비스 주요 소식을',
      '알림으로 받을 수 있어요.',
    ],
    required: false,
    icon: 'notification',
  },
];

interface PermissionStatus {
  location: 'granted' | 'denied' | 'prompt' | 'unavailable';
  notification: 'granted' | 'denied' | 'default' | 'unavailable';
}

export default function PermissionsPage() {
  const router = useRouter();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
    location: 'unavailable',
    notification: 'unavailable',
  });
  const [terms, setTerms] = useState<TermItem[]>([]);

  useEffect(() => {
    checkPermissions();
    // 약관 목록 가져오기
    fetchTerms()
      .then((items) => {
        setTerms(items);
      })
      .catch((err) => {
        console.error('약관 정보를 불러오는데 실패했습니다:', err);
      });
  }, []);

  const checkPermissions = async () => {
    const status: PermissionStatus = {
      location: 'unavailable',
      notification: 'unavailable',
    };

    // 위치 정보 권한 확인
    if ('geolocation' in navigator) {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({name: 'geolocation'});
          status.location = result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'prompt';
        } catch {
          // Permissions API를 지원하지 않는 경우
          status.location = 'prompt';
        }
      } else {
        status.location = 'prompt';
      }
    }

    // 알림 권한 확인
    if ('Notification' in window) {
      status.notification = Notification.permission as 'granted' | 'denied' | 'default';
    }

    setPermissionStatus(status);
  };

  const handleConfirm = async () => {
    const requests: Promise<void>[] = [];

    // 위치 정보 권한 요청 (필수 권한)
    if (permissionStatus.location !== 'granted' && 'geolocation' in navigator) {
      requests.push(
        new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(),
            () => resolve(),
            {timeout: 1000},
          );
        }),
      );
    }

    // 알림 권한 요청 (선택 권한)
    if (permissionStatus.notification === 'default' && 'Notification' in window) {
      requests.push(Notification.requestPermission().then(() => undefined));
    }

    // 권한 요청 실행
    await Promise.all(requests);
    
    // 권한 상태 다시 확인
    const updatedStatus: PermissionStatus = {
      location: 'unavailable',
      notification: 'unavailable',
    };

    // 위치 정보 권한 확인
    if ('geolocation' in navigator) {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({name: 'geolocation'});
          updatedStatus.location = result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'prompt';
        } catch {
          updatedStatus.location = 'prompt';
        }
      } else {
        updatedStatus.location = 'prompt';
      }
    }

    // 알림 권한 확인
    if ('Notification' in window) {
      updatedStatus.notification = Notification.permission as 'granted' | 'denied' | 'default';
    }

    setPermissionStatus(updatedStatus);

    // 권한 허용 여부에 따라 약관 동의 처리
    try {
      const consents: ConsentPayload[] = [];

      // 필수 약관 모두 동의 (여기까지 왔다는 것은 필수 약관에 동의했다는 의미)
      const requiredTerms = terms.filter((term) => term.isRequired);
      requiredTerms.forEach((term) => {
        consents.push({ termsId: term.id });
      });

      // 위치 정보 권한이 허용된 경우, kind가 'location'인 약관에 동의
      if (updatedStatus.location === 'granted') {
        const locationTerm = terms.find((term) => term.kind === 'location');
        if (locationTerm) {
          // 이미 필수 약관에 포함되어 있지 않으면 추가
          if (!consents.find((c) => c.termsId === locationTerm.id)) {
            consents.push({ termsId: locationTerm.id });
          }
        }
      }

      // 알림 권한이 허용된 경우, kind가 'notice'인 약관에 동의
      if (updatedStatus.notification === 'granted') {
        const noticeTerm = terms.find((term) => term.kind === 'notice');
        if (noticeTerm) {
          // 이미 필수 약관에 포함되어 있지 않으면 추가
          if (!consents.find((c) => c.termsId === noticeTerm.id)) {
            consents.push({ termsId: noticeTerm.id });
          }
        }
      }

      // 약관 동의 저장
      if (consents.length > 0) {
        await submitConsents(consents);
      }
    } catch (err) {
      console.error('약관 동의 저장 실패:', err);
      // 저장 실패해도 계속 진행
    }

    // 필수 권한(위치 정보)이 허용되었는지 확인
    if (updatedStatus.location === 'granted') {
      // 필수 권한이 허용되면 가입 완료 페이지로 이동
      router.replace('/signup/complete');
    }
    // 필수 권한이 허용되지 않았어도 사용자가 거부했을 수 있으므로, 다음 페이지로 이동하지 않음
  };

  const getIconComponent = (iconType: string) => {
    if (iconType === 'location') {
      return <Image src="/icons/icon-location-66.svg" alt="위치" width={66} height={66} />;
    }
    if (iconType === 'notification') {
      return <Image src="/icons/icon-alarm-66.svg" alt="알림" width={66} height={66} />;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-white">
      <div className="w-full flex flex-col">
        <TopAreaSub onBack={() => router.push('/signup/profile')} />
        <div className="flex flex-col min-h-screen pb-[calc(5rem+2rem)]">
          <div style={{padding: '0 2rem', marginTop: '1.5rem'}}>
            <h1 className="text-[24px] font-bold text-[#111827] leading-[32px]">
              편리한 사용을 위해<br />
              필요한 권한을 확인해주세요.
            </h1>
          </div>

          <div style={{padding: '50px 20px 20px'}} className="flex flex-col gap-[2.7rem]">
            {permissionItems.map((item) => (
              <div key={item.id} className="flex gap-[1.6rem]">
                <div className="flex-shrink-0">
                  {getIconComponent(item.icon)}
                </div>
                <div className="flex-1 flex flex-col gap-[1.2rem]">
                  <h2 className="text-headline-4 font-bold text-black">
                    {item.type}
                  </h2>
                  <div className="flex flex-col">
                    {item.description.map((line, idx) => (
                      <p key={idx} className="text-body-4 font-medium text-grayscale-600">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 고정 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 p-5 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
            <Button type="button" variant="default" onClick={handleConfirm} className="w-full">
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

