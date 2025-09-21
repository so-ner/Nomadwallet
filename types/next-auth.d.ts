import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; // Supabase User/Profiles 테이블 UUID
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
    }
}