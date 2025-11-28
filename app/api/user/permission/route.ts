import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAuth } from '@/lib/auth';

/**
 * [POST] /api/user/permission
 * 사용자 권한 허용 여부 저장
 * body: { kind: 'location' | 'notice', granted: boolean }
 */
export const POST = withAuth(async (user, req) => {
  try {
    const body = await req.json();
    const { kind, granted } = body;

    if (!kind || typeof granted !== 'boolean') {
      return NextResponse.json({ error: 'kind와 granted가 필요합니다.' }, { status: 400 });
    }

    if (kind !== 'location' && kind !== 'notice') {
      return NextResponse.json({ error: 'kind는 location 또는 notice여야 합니다.' }, { status: 400 });
    }

    // users 테이블에 권한 정보 저장
    const updateField = kind === 'location' ? 'location_permission' : 'notification_permission';
    const { error } = await supabaseAdmin
      .from('users')
      .update({ [updateField]: granted, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (error) {
      console.error('권한 정보 저장 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

