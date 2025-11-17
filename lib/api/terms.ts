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

export async function fetchTerms(): Promise<TermItem[]> {
  const res = await fetch('/api/terms');
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
