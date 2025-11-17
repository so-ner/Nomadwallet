import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabaseAdmin';

export async function GET() {
  const {data, error} = await supabaseAdmin
    .from('terms')
    .select('terms_id, kind, title, summary, is_required, version, content_url')
    .is('retired_at', null)
    .order('is_required', {ascending: false})
    .order('kind', {ascending: true});

  if (error) {
    console.error('[terms] fetch error:', error);
    return NextResponse.json({error: '약관 정보를 불러오지 못했습니다.'}, {status: 500});
  }

  return NextResponse.json({terms: data ?? []}, {status: 200});
}
