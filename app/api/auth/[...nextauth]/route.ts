import NextAuth from "next-auth"
import {SupabaseAdapter} from "@auth/supabase-adapter"
import {supabaseAdmin} from "@/lib/supabaseAdmin"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import type {JWT} from "next-auth/jwt"
import type {Account, Profile, User, Session} from "next-auth"

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent' // 사용자에게 항상 동의 화면을 표시하도록 강제
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
        name: {label: "Name", type: "text"},
        phone: {label: "Phone", type: "text"},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("이메일 혹은 비밀번호가 비어있습니다.");

        console.log('auth 인증 진입 완료')
        console.log(credentials)
        // 기존 유저 조회
        const {data: existingUser} = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .maybeSingle();

        console.log(existingUser)
        // 회원가입 로직
        if (!existingUser && credentials.name !== null) {
          const {data: newUser, error: insertError} = await supabaseAdmin
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
          return {id: newUser.user_id, email: newUser.email};
        }

        // 로그인 로직
        if (existingUser.password !== credentials.password) throw new Error("비밀번호 불일치");

        console.log('로그인 완료')
        return {id: existingUser.user_id, email: existingUser.email};
      },
    }),
  ],

  session: {strategy: "jwt" as const},

  callbacks: {
    async signIn({user, account, profile,}: {
      user: User
      account: Account | null
      profile?: Profile
    }) {
      console.log("SignIn 콜백 진입");
      console.log("Provider:", account?.provider)

      if (account?.provider === "google") {
        try {
          console.log('Google OAuth 로그인 성공')
        } catch (e) {
          if (e instanceof Error) {
            return `/error?message=${encodeURIComponent(e.message)}`
          }
        }
      }

      if (account?.provider === "credentials") {
        console.log("Credentials 로그인 시도");
        // 이미 authorize()에서 검증 완료됨
      }

      return true; // 로그인 허용
    },
    async jwt({token, user}: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name ?? null
      }
      return token
    },
    async session({session, token}: { session: Session; token: JWT }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        name: token.name as string | null,
      }
      return session
    },
  },
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}