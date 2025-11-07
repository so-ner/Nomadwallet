import {requireAuth} from '@/lib/auth';
import {supabaseAdmin} from "@/lib/supabaseAdmin";

/**
 * [POST] /api/storage/save
 * 사용자 테이블 프로필 url 수정
 */
export async function POST(req: Request) {
  const user = await requireAuth();
  if ('status' in user) return user;

  // 프론트에서 받은 key
  const {key, isBasic} = await req.json();
  if (!key) {
    return new Response('Missing image key', {status: 400});
  }

  // 업로드 프로필 일 시 캐시 무효화용 timestamp 추가
  const imageUrl = isBasic ? `basic/${key}` : `${key}?v=${Date.now()}`;

  const {error} = await supabaseAdmin
    .from('users')
    .update({profile_image_url: imageUrl})
    .eq('user_id', user.id);

  if (error) {
    return Response.json({error: error.message}, {status: 500});
  }

  return Response.json({success: true, imageUrl});
}