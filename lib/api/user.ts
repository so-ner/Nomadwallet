import { apiFetch } from './fetch';

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateNicknameResponse {
  message: string;
}

export interface GetNicknameResponse {
  nick_name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

/**
 * 닉네임 조회
 * @returns 사용자 닉네임
 */
export async function getNickname(): Promise<GetNicknameResponse> {
  const res = await apiFetch('/api/user/nickname', {
    method: 'GET',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? '닉네임을 가져오지 못했습니다.');
  }

  // API가 배열을 반환하는 경우 첫 번째 요소 반환
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as GetNicknameResponse;
  }

  return data as GetNicknameResponse;
}

/**
 * 닉네임 변경
 * @param nickname 변경할 닉네임
 * @returns 변경 완료 메시지
 */
export async function updateNickname(nickname: string): Promise<UpdateNicknameResponse> {
  const res = await apiFetch('/api/user/nickname', {
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

  return data as UpdateNicknameResponse;
}

/**
 * TODO: 비밀번호 변경 API 구현 필요
 * 기존 비밀번호를 확인하고 새 비밀번호로 변경하는 API 엔드포인트가 필요합니다.
 * 
 * @param currentPassword 기존 비밀번호
 * @param newPassword 새 비밀번호
 * @returns 변경 완료 메시지
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> {
  // TODO: 비밀번호 변경 API 엔드포인트 구현 필요
  // 예상 엔드포인트: PATCH /api/user/password
  // 요청 본문: { currentPassword: string, newPassword: string }
  // 응답: { message: string }
  
  throw new Error('비밀번호 변경 API가 아직 구현되지 않았습니다.');
  
  // 구현 예시:
  // const res = await apiFetch('/api/user/password', {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({currentPassword, newPassword}),
  // });
  //
  // const data = await res.json();
  // if (!res.ok) {
  //   throw new Error(data?.error ?? '비밀번호 변경에 실패했습니다.');
  // }
  //
  // return data as ChangePasswordResponse;
}

export interface WithdrawResponse {
  message: string;
}

/**
 * 회원 탈퇴
 * @returns 탈퇴 완료 메시지
 */
export async function withdraw(): Promise<WithdrawResponse> {
  const res = await apiFetch('/api/user/withdraw', {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? '회원탈퇴에 실패했습니다.');
  }

  return data as WithdrawResponse;
}
