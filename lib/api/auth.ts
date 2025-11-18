export interface ApiMessageResponse {
  message: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null);
  return base ?? '';
};

import { apiFetch } from './fetch';

async function request<PostBody>(
  url: string,
  payload: PostBody,
  defaultErrorMessage: string,
): Promise<ApiMessageResponse> {
  const endpoint = `${getBaseUrl()}${url}`;
  const res = await apiFetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiMessageResponse>(res);

  if (!res.ok) {
    const message = data?.message ?? defaultErrorMessage;
    throw new Error(message);
  }

  return data ?? { message: '요청이 완료되었습니다.' };
}

export async function requestPasswordReset(
  payload: RequestPasswordResetPayload,
): Promise<ApiMessageResponse> {
  return request('/api/auth/request-reset', payload, '비밀번호 재설정 메일 발송에 실패했습니다.');
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ApiMessageResponse> {
  return request('/api/auth/reset-password', payload, '비밀번호 변경에 실패했습니다.');
}

