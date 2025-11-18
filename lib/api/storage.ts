import { apiFetch } from './fetch';

export type ProfileState = 'basic' | 'upload';

/**
 * 프로필 이미지 업로드 (회원가입, 프로필 수정에서 사용)
 */
export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const uploadRes = await apiFetch('/api/storage/upload', {
    method: 'POST',
    body: formData,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    throw new Error(uploadData?.error ?? '이미지 업로드에 실패했습니다.');
  }

  const saveRes = await apiFetch('/api/storage/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({key: uploadData.key, isBasic: false}),
  });

  const saveData = await saveRes.json();
  if (!saveRes.ok) {
    throw new Error(saveData?.error ?? '프로필 저장에 실패했습니다.');
  }

  return saveData.imageUrl as string;
}

/**
 * 프로필 이미지 변경 (기본 프로필 ↔ 업로드 프로필)
 */
export async function changeProfileImage({
  from,
  to,
  file,
  currentKey,
}: {
  from: ProfileState;
  to: ProfileState;
  file?: File;
  currentKey?: string;
}): Promise<string> {
  if (from === 'basic' && to === 'upload') {
    // 기본 → 업로드
    if (!file) throw new Error('파일이 필요합니다.');

    const formData = new FormData();
    formData.append('file', file);

    // R2 업로드
    const res = await apiFetch('/api/storage/upload', {
      method: 'POST',
      body: formData
    }).then((r) => r.json());

    // Supabase에 url 저장
    const response = await apiFetch('/api/storage/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: res.key, isBasic: false }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error ?? '프로필 사진 변경이 실패되었습니다.');
    }
    
    return data.imageUrl as string;
  } else if (from === 'upload' && to === 'basic') {
    // 업로드 → 기본 (랜덤하게)
    if (currentKey) {
      await apiFetch('/api/storage/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: currentKey }),
      });
    }

    const randomBasic = Math.floor(Math.random() * 3) + 1; // 1, 2, 또는 3
    const response = await apiFetch('/api/storage/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: `${randomBasic}.jpg`, isBasic: true }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error ?? '프로필 사진 변경이 실패되었습니다.');
    }
    
    return data.imageUrl as string;
  } else if (from === 'upload' && to === 'upload') {
    // 업로드 → 업로드
    if (!file) throw new Error('파일이 필요합니다.');
    if (!currentKey) throw new Error('현재 키가 필요합니다.');

    const formData = new FormData();
    formData.append('file', file);

    await apiFetch('/api/storage/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: currentKey }),
    });

    // R2 업로드
    const res = await apiFetch('/api/storage/upload', {
      method: 'POST',
      body: formData
    }).then((r) => r.json());

    // Supabase에 url 업데이트
    const response = await apiFetch('/api/storage/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: res.key, isBasic: false }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error ?? '프로필 사진 변경이 실패되었습니다.');
    }
    
    return data.imageUrl as string;
  }
  
  throw new Error('잘못된 프로필 변경 요청입니다.');
}

/**
 * 기본 프로필로 변경 (1, 2, 3 중 선택)
 */
export async function changeToBasicProfile(profileNumber: 1 | 2 | 3, currentKey?: string): Promise<string> {
  if (currentKey) {
    await apiFetch('/api/storage/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: currentKey }),
    });
  }

  const response = await apiFetch('/api/storage/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key: `${profileNumber}.jpg`, isBasic: true }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error ?? '프로필 사진 변경이 실패되었습니다.');
  }
  
  return data.imageUrl as string;
}
