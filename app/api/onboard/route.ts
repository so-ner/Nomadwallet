import {NextResponse} from 'next/server'
import {supabaseAdmin} from "@/lib/supabaseAdmin";
import {withAuth} from "@/lib/auth";

/**
 * [POST] /api/onboard
 * body: { consents: [{ termsId: number, channels?: string[] }] }
 * 약관 동의 항목 insert/update
 */
export const POST = withAuth(async (user, req): Promise<Response> => {
  try {
    const body = await req.json()

    const {consents} = body
    if (!Array.isArray(consents)) {
      return NextResponse.json({error: 'invalid_payload'}, {status: 400})
    }

    // 현재 활성 약관 목록 가져오기
    const {data: activeTerms, error: activeErr} = await supabaseAdmin
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

    const {error: upsertErr} = await supabaseAdmin.from('user_terms').upsert(rows, {onConflict: 'user_id'})
    if (upsertErr) {
      console.error('[onboard] upsert error:', upsertErr);
      return NextResponse.json({error: upsertErr.message}, {status: 500})
    }

    const {error: updateErr} = await supabaseAdmin
      .from('users')
      .update({is_onboarded: true, updated_at: new Date().toISOString()})
      .eq('user_id', user.id);
    if (updateErr) {
      console.error('[onboard] update user error:', updateErr);
      return NextResponse.json({error: updateErr.message}, {status: 500})
    }

    return NextResponse.json({ok: true}, {status: 200})
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
})