import { apiFetch } from './fetch';
import type { ConsentPayload, SubmitConsentsResponse } from '@/types/onboard';

export type { ConsentPayload, SubmitConsentsResponse };

export async function submitConsents(consents: ConsentPayload[]): Promise<SubmitConsentsResponse> {
  const res = await apiFetch('/api/onboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({consents}),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? '약관 동의 처리에 실패했습니다.');
  }

  return data as SubmitConsentsResponse;
}
