import { z } from "zod";

export const IdParamSchema = z.object({
    id: z.string().uuid(),
});

export const UserUpdateSchema = z.object({
    display_name: z.string().min(1).max(50),
    bio: z.string().max(160).optional(),
});