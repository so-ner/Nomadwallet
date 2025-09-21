import { NextResponse } from "next/server";
import { IdParamSchema, UserUpdateSchema } from "@/lib/validator";
import { ApiError, toSafeError } from "@/lib/errors";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = IdParamSchema.parse(params);
        const session = await auth();

        if (!session?.user?.id) throw new ApiError(401, "Unauthorized");
        if (session.user.id !== id) throw new ApiError(403, "Forbidden");

        const { data, error } = await supabaseAdmin
            .from("profiles")
            .select("id, display_name, bio")
            .eq("id", id)
            .single();

        if (error) throw new ApiError(500, "Database error");

        return NextResponse.json(data);
    } catch (e) {
        const safe = toSafeError(e);
        return NextResponse.json(
            { error: safe.message },
            { status: safe.status }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = IdParamSchema.parse(params);
        const session = await auth();

        if (!session?.user?.id) throw new ApiError(401, "Unauthorized");
        if (session.user.id !== id) throw new ApiError(403, "Forbidden");

        const body = await req.json();
        const update = UserUpdateSchema.parse(body);

        const { error } = await supabaseAdmin
            .from("profiles")
            .update(update)
            .eq("id", id);

        if (error) throw new ApiError(500, "Database error");

        return NextResponse.json({ ok: true });
    } catch (e) {
        const safe = toSafeError(e);
        return NextResponse.json(
            { error: safe.message },
            { status: safe.status }
        );
    }
}