export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const uploadRes = await fetch('/api/storage/upload', {
    method: 'POST',
    body: formData,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    throw new Error(uploadData?.error ?? '이미지 업로드에 실패했습니다.');
  }

  const saveRes = await fetch('/api/storage/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({key: uploadData.key}),
  });

  const saveData = await saveRes.json();
  if (!saveRes.ok) {
    throw new Error(saveData?.error ?? '프로필 저장에 실패했습니다.');
  }

  return saveData.imageUrl as string;
}
