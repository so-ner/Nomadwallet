export async function updateNickname(nickname: string) {
  const res = await fetch('/api/user/nickname', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({nickname}),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? '닉네임을 저장하지 못했습니다.');
  }

  return data;
}
