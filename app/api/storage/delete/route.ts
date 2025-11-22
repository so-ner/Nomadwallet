import {NextResponse} from "next/server";
import {requireAuth} from "@/lib/auth";

/**
 * [POST] /api/storage/delete
 * fastAPI에 R2 삭제 요청
 */
const DELETE_SERVICE_URL = process.env.NOMAD_PYTHON_SERVICE_URL ?? 'http://r2-delete-api:8000';

export async function POST(req: Request) {
  const { old_key, new_key, new_is_basic, type } = await req.json();

  const user = await requireAuth();
  if ('status' in user) return user;

  const payload = {
    user_id: user.id,
    old_key,
    new_key,
    new_is_basic,
    type: type ?? "PROFILE_REPLACE",
  };

  const res = await fetch(`${DELETE_SERVICE_URL}/images/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "enqueue failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}