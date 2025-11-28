import { apiFetch } from './fetch';

export interface TermItem {
  id: number;
  kind: string | null;
  title: string;
  summary: string | null;
  isRequired: boolean;
  version?: string | null;
  contentUrl?: string | null;
}

interface ApiTermsResponse {
  terms: Array<{
    terms_id: number;
    kind: string | null;
    title: string;
    summary: string | null;
    is_required: boolean;
    version?: string | null;
    content_url?: string | null;
  }>;
}

// 클라이언트/서버 공통 사용
export async function fetchTerms(): Promise<TermItem[]> {
  // 서버 사이드에서는 절대 URL 필요
  const baseUrl = typeof window !== 'undefined' 
    ? '' 
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const url = `${baseUrl}/api/terms`;
  const res = typeof window !== 'undefined' 
    ? await apiFetch(url)
    : await fetch(url);
    
  if (!res.ok) {
    throw new Error('약관 정보를 불러오지 못했습니다.');
  }
  const data = (await res.json()) as ApiTermsResponse;
  return (data.terms ?? []).map((item) => ({
    id: item.terms_id,
    kind: item.kind,
    title: item.title,
    summary: item.summary,
    isRequired: item.is_required,
    version: item.version,
    contentUrl: item.content_url,
  }));
}
