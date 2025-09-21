import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
// import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

// 네이버 Provider 정의
// function NaverProvider<P extends Record<string, any> = any>(
//     options: OAuthUserConfig<P>
// ): OAuthConfig<P> {
//     return {
//         id: "naver",
//         name: "Naver",
//         type: "oauth",
//         version: "2.0",
//         authorization: "https://nid.naver.com/oauth2.0/authorize",
//         token: "https://nid.naver.com/oauth2.0/token",
//         userinfo: "https://openapi.naver.com/v1/nid/me",
//         profile(profile) {
//             return {
//                 id: profile.response.id,
//                 name: profile.response.name,
//                 email: profile.response.email,
//                 image: profile.response.profile_image,
//             };
//         },
//         options,
//     };
// }

const authOptions = {
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // NaverProvider({
        //     clientId: process.env.NAVER_CLIENT_ID!,
        //     clientSecret: process.env.NAVER_CLIENT_SECRET!,
        // }),
    ],

    session: {
        strategy: "jwt" as const,
    },

    callbacks: {
        async jwt({ token, user }: any) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) session.user.id = token.id as string;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };