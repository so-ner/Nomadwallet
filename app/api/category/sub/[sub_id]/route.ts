import {requireAuth} from "@/lib/auth";
import {NextResponse} from 'next/server'
import {supabaseAdmin} from "@/lib/supabaseAdmin";

/**
 * [PUT] /api/category/sub/:sub_id
 * 사용자의 카테고리별 소분류 수정
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ sub_id: number }> }
) {
  try {
    const subId = (await context.params).sub_id;
    if (!subId) {
      return NextResponse.json({error: 'Invalid subId'}, {status: 400})
    }

    const user = await requireAuth()
    if ('status' in user) return user

    const {sub_name} = await req.json()

    const {data, error} = await supabaseAdmin
      .from('category_sub')
      .update({sub_name, updated_at: new Date().toISOString()})
      .eq('sub_id', subId)
      .eq('user_id', user.id)
      .select()
    if (error) return NextResponse.json({error: error.message}, {status: 500});

    if (!data || data.length === 0) {
      return NextResponse.json({error: 'Subcategory not found'}, {status: 404});
    }

    return NextResponse.json(data, {status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}

/**
 * [DELETE] /api/category/sub/:sub_id
 * 사용자의 카테고리별 소분류 삭제
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ sub_id: number }> }
) {
  try {
    const subId = (await context.params).sub_id;
    if (!subId)
      return NextResponse.json({error: 'Missing required subId'}, {status: 400})

    const user = await requireAuth()
    if ('status' in user) return user

    const {error} = await supabaseAdmin
      .from('category_sub')
      .delete()
      .eq('sub_id', subId)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({error: error.message}, {status: 500});

    return NextResponse.json({message: 'Deleted successfully'})
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}