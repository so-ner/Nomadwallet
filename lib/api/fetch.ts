/**
 * 401 에러 발생 시 자동으로 로그인 페이지로 리다이렉트하는 fetch 래퍼
 * 로딩 상태를 자동으로 관리합니다.
 */
let loadingManager: { setLoading: (loading: boolean) => void } | null = null;

export function setLoadingManager(manager: { setLoading: (loading: boolean) => void }) {
  loadingManager = manager;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  // 클라이언트 사이드에서만 로딩 관리
  if (typeof window !== 'undefined' && loadingManager) {
    loadingManager.setLoading(true);
  }

  try {
    const response = await fetch(input, init);

    // 401 Unauthorized 에러 발생 시 로그인 페이지로 리다이렉트
    if (response.status === 401) {
      // 클라이언트 사이드에서만 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new Error('Unauthorized');
    }

    return response;
  } finally {
    // 클라이언트 사이드에서만 로딩 관리
    if (typeof window !== 'undefined' && loadingManager) {
      loadingManager.setLoading(false);
    }
  }
}

