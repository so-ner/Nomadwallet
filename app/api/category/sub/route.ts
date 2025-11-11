import {NextResponse} from 'next/server'
import {supabaseAdmin} from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const body = await req.json()
  const { major, sub_name, user_id } = body

  const { data, error } = await supabaseAdmin
    .from('category_sub')
    .insert({
      major,
      sub_name,
      user_id
    })
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { sub_id, sub_name } = body

  const { data, error } = await supabaseAdmin
    .from('category_sub')
    .update({ sub_name, updated_at: new Date().toISOString() })
    .eq('sub_id', sub_id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { sub_id } = body

  const { error } = await supabaseAdmin
    .from('category_sub')
    .delete()
    .eq('sub_id', sub_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ message: 'Deleted successfully' })
}
