'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import Button from '@/component/Button';
import TopAreaSub from '@/component/top_area/TopAreaSub';

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
      '접근 권한이 필요해요.',
    ],
    required: true,
    icon: '📍',
  },
  {
    id: 'notification',
    type: '[선택] 알림',
    description: [
      '서비스 주요 소식을',
      '알림으로 받을 수 있어요.',
    ],
    required: false,
    icon: '🔔',
  },
];

interface PermissionStatus {
  location: 'granted' | 'denied' | 'prompt' | 'unavailable';
  notification: 'granted' | 'denied' | 'default' | 'unavailable';
}

function PermissionPopup({
  isVisible,
  missingPermissions,
  onClose,
  onRequest,
}: {
  isVisible: boolean;
  missingPermissions: string[];
  onClose: () => void;
  onRequest: () => void;
}) {
  if (!isVisible) return null;

  const getPermissionName = (id: string) => {
    const item = permissionItems.find((p) => p.id === id);
    return item?.type || id;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-bold text-[#111827] mb-4">
          권한 허용이 필요합니다
        </h2>
        <div className="mb-6">
          <p className="text-[15px] text-[#4B5563] mb-3">
            다음 권한이 허용되지 않았습니다:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[15px] text-[#4B5563]">
            {missingPermissions.map((id) => (
              <li key={id}>{getPermissionName(id)}</li>
            ))}
          </ul>
          <p className="text-[14px] text-[#6B7280] mt-4">
            브라우저 설정에서 권한을 허용해주세요.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="line"
            onClick={onClose}
            className="flex-1"
          >
            나중에
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onRequest}
            className="flex-1"
          >
            권한 요청
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PermissionsPage() {
  const router = useRouter();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
    location: 'unavailable',
    notification: 'unavailable',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [missingPermissions, setMissingPermissions] = useState<string[]>([]);

  useEffect(() => {
    checkPermissions();
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
    const missing: string[] = [];

    // 필수 권한 확인 (위치 정보)
    if (permissionStatus.location !== 'granted') {
      missing.push('location');
    }

    // 선택 권한 확인 (알림) - 선택이므로 체크하지 않음

    if (missing.length > 0) {
      setMissingPermissions(missing);
      setShowPopup(true);
      return;
    }

    // 모든 필수 권한이 허용되어 있으면 가입 완료 페이지로
    router.push('/onboard');
  };

  const handleRequestPermissions = async () => {
    const requests: Promise<void>[] = [];

    // 위치 정보 권한 요청
    if (missingPermissions.includes('location') && permissionStatus.location !== 'granted') {
      if ('geolocation' in navigator) {
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
    }

    // 알림 권한 요청
    if (missingPermissions.includes('notification') && permissionStatus.notification !== 'granted') {
      if ('Notification' in window && Notification.permission === 'default') {
        requests.push(Notification.requestPermission().then(() => undefined));
      }
    }

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
    setShowPopup(false);

    // 다시 확인
    const stillMissing: string[] = [];
    if (updatedStatus.location !== 'granted') {
      stillMissing.push('location');
    }

    if (stillMissing.length === 0) {
      router.push('/onboard');
    } else {
      setMissingPermissions(stillMissing);
      // 여전히 권한이 없으면 팝업 다시 표시
      setTimeout(() => setShowPopup(true), 100);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-5 py-8 bg-white">
      <div className="w-full max-w-[600px] flex flex-col gap-4">
        <TopAreaSub onBack={() => router.back()} />

        <div style={{padding: '0 2rem', marginTop: '2.4rem'}}>
          <h1 className="text-[24px] font-bold text-[#111827] leading-[32px]">
            편리한 사용을 위해
            <br/>
            필요한 권한을 확인해주세요.
          </h1>
        </div>

        <div className="mt-6 flex flex-col gap-4 px-5">
          {permissionItems.map((item) => (
            <div key={item.id} className="flex gap-4 p-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#D7E3EC] flex items-center justify-center">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#111827] mb-2">
                  {item.type}
                </p>
                <div className="text-[14px] text-[#4B5563] leading-5">
                  {item.description.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 mt-8">
          <Button type="button" variant="default" onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </div>

      <PermissionPopup
        isVisible={showPopup}
        missingPermissions={missingPermissions}
        onClose={() => setShowPopup(false)}
        onRequest={handleRequestPermissions}
      />
    </div>
  );
}
