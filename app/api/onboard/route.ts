import {NextResponse} from 'next/server'
import {supabase} from "@/lib/supabaseClient";
import {withAuth} from "@/lib/auth";

/**
 * [GET] /api/onboard
 * 최신 버전 약관 동의 목록 조회
 */
export const GET = withAuth(async (user, req) => {
  const { data, error } = await supabase
    .from('terms')
    .select('terms_id, kind, title, summary, is_required, version, content_url')
    .eq('retired_at', null) // null일 경우 최신 버전
    .order('is_required', { ascending: false })
    .order('kind', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ terms: data })
})

/**
 * [POST] /api/onboard
 * body: { consents: [{ termsId: number, channels?: string[] }] }
 * 약관 동의 항목 insert
 */
export const POST = withAuth(async (user, req): Promise<Response> => {
  const body = await req.json()

  const {consents} = body
  if (!Array.isArray(consents)) {
    return NextResponse.json({error: 'invalid_payload'}, {status: 400})
  }

  // 현재 활성 약관 목록 가져오기
  const {data: activeTerms, error: activeErr} = await supabase
    .from('terms')
    .select('terms_id, is_required')
    .is('retired_at', null)
  if (activeErr) return NextResponse.json({error: activeErr.message}, {status: 500})

  // 필수 약관 검증
  const requiredIds = activeTerms.filter(t => t.is_required).map(t => t.terms_id)
  const providedIds = consents.map(c => c.termsId)
  const missingRequired = requiredIds.filter(id => !providedIds.includes(id))
  if (missingRequired.length) {
    return NextResponse.json(
      {error: 'missing_required_terms', missing: missingRequired},
      {status: 409}
    )
  }

  // Bulk upsert
  const rows = consents.map(c => ({
    user_id: user.id,
    terms_id: c.termsId,
    consent_channels: c.channels ?? null,
  }))

  const {error: upsertErr} = await supabase.from('user_terms').upsert(rows, {onConflict: 'user_id'})
  if (upsertErr) return NextResponse.json({error: upsertErr.message}, {status: 500})

  return NextResponse.json({ok: true})
})