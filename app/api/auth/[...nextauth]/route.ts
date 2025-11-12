import type {Account, Session, User} from "next-auth"
import NextAuth from "next-auth"
import {SupabaseAdapter} from "@auth/supabase-adapter";
import {supabaseAdmin} from "@/lib/supabaseAdmin"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import type {JWT} from "next-auth/jwt"
import {supabase} from "@/lib/supabaseClient";
import {hashPassword, verifyPassword} from "@/lib/password";

// sns 로그인 시 user_map을 통한 public user 정보 연게
async function getPublicUserByAuthId(authUserId: string) {
  const {data, error} = await supabase
    .from('user_map')
    .select(`
      public_user_id,
      public_user:public_user_id (user_id, user_name, email, is_onboarded)
    `)
    .eq('auth_user_id', authUserId)
    .single()

  if (error) {
    console.error('user_map 조회 실패:', error)
    return null
  }

  const user =
    Array.isArray(data.public_user) && data.public_user.length > 0
      ? data.public_user[0]
      : data.public_user

  return user as {
    user_id: number
    user_name: string
    email: string
    is_onboarded: boolean
  } | null
}

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
        // console.log(credentials)

        // 기존 유저 조회
        const {data: existingUser} = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .maybeSingle();

        // console.log(existingUser)

        // 회원가입 로직
        if (!existingUser && credentials.name !== null) {
          const hashed = await hashPassword(credentials.password);
          const {data: newUser, error: insertError} = await supabaseAdmin
            .from("users")
            .insert([
              {
                email: credentials.email,
                password: hashed,
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

          return {id: newUser.user_id, email: newUser.email};
        }

        // 로그인 로직
        if (!existingUser)
          throw new Error('해당 이메일의 계정이 존재하지 않습니다.');

        const isValid = await verifyPassword(
          credentials.password,
          existingUser.password
        );
        if (!isValid) throw new Error('비밀번호 불일치');

        return {id: existingUser.user_id, email: existingUser.email};
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 7, // 7일
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // 세션 암복호화용
  },

  callbacks: {
    async signIn({user, account}: { user: User; account: Account | null }) {
      console.log("signIn 콜백 진입:", account?.provider)

      if (account?.provider === "google") {
        console.log("Google OAuth 로그인 성공:", user.email)
      }

      if (account?.provider === "credentials") {
        console.log("Credentials 로그인 시도:", user.email)
      }

      return true
    },
    async jwt({token, user, account}: { token: JWT; user?: any; account?: Account | null }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name ?? null
        // sns 로그인 시 public.users 정보 연계해오기
        if (account?.provider && account?.provider !== "credentials") {
          const publicUser = await getPublicUserByAuthId(user.id)
          if (publicUser) token.public_user = publicUser
        }
      }
      return token
    },
    async session({session, token}: { session: Session; token: JWT }) {
      session.user = {
        ...session.user,
        id: token.public_user ? String(token.public_user.user_id) : (token.id as string),
        email: token.email as string,
        name: token.name as string | null,
        is_onboarded: token.public_user?.is_onboarded ?? false,
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}