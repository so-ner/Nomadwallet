import {DefaultSession} from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      is_onboarded?: boolean
    } & DefaultSession["user"];
    expires: string
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    refreshTokenExpires?: number
    error?: "RefreshAccessTokenError"
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    refreshTokenExpires?: number
    exp: number
    error?: "RefreshAccessTokenError"
    public_user?: {
      user_id: number
      user_name: string
      email: string
      is_onboarded: boolean
    }
  }
}