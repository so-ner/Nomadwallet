import {requireAuth} from '@/lib/auth';
import {NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabaseAdmin";

/**
 * [POST] /api/storage/save
 * 사용자 테이블 프로필 url 수정
 */
export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if ('status' in user) return user;

    // 프론트에서 받은 key
    const {key, isBasic} = await req.json();
    if (!key) {
      return new Response('Missing image key', {status: 400});
    }

    // isBasic의 경우 key: ${randomBasic}.jpg
    // 아닐 경우 key: profile/${user.id}.${ext}?v=${Date.now()}
    const imageUrl = isBasic ? `basic/${key}` : `${key}`;

    const {error} = await supabaseAdmin
      .from('users')
      .update({profile_image_url: imageUrl, updated_at: new Date().toISOString()})
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({imageUrl}, {status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}