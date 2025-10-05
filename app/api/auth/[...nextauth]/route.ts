import NextAuth from "next-auth"
import {SupabaseAdapter} from "@auth/supabase-adapter"
import {supabaseAdmin} from "@/lib/supabaseAdmin"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
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

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("이메일 혹은 비밀번호가 비어있습니다.");

        console.log('auth 인증 진입 완료')
        console.log(credentials)
        // 기존 유저 조회
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .maybeSingle();

        console.log(existingUser)
        // 회원가입 로직
        if (!existingUser && credentials.name !== null) {
          const { data: newUser, error: insertError } = await supabaseAdmin
            .from("users")
            .insert([
              {
                email: credentials.email,
                password: credentials.password, // todo 현재 단순 저장 -> hash 처리
                user_name: credentials.name,
                phone_number: credentials.phone ?? null,
              },
            ])
            .select("*")
            .single();

          if (insertError || !newUser) {
            console.error("회원가입 실패:", insertError?.message);
            throw new Error("회원가입 실패.");
          }

          console.log('회원가입 완료')
          return { id: newUser.id, email: newUser.email };
        }

        // 로그인 로직
        if (existingUser.password !== credentials.password) throw new Error("비밀번호 불일치");

        console.log('로그인 완료')
        return { id: existingUser.id, email: existingUser.email };
      },
    }),
  ],

  session: { strategy: "jwt" as const },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }