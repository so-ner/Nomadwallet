# Nomadwallet_FE

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Nomadwallet_BE

## 1. 라이브러리 설치
```bash
# 인증 관련
npm install next-auth @auth/supabase-adapter

# Supabase 연동
npm install @supabase/supabase-js

# 입력값 검증
npm install zod

# 암호화 관련
npm install bcryptjs

# 이메일 인증
npm i nodemailer
npm i -D @types/nodemailer

# 통계를 위한 날짜 라이브러리
npm install dayjs

# .env 사용
npm install @next/env

# 이미지 저장 및 조회를 위한 r2 호환
npm install @aws-sdk/client-s3

# Presigned URL을 만들어주는 유틸리티
npm install @aws-sdk/s3-request-presigner
```

## 2. 개발 서버 실행
```bash
npm run dev
```
## 3. 인증 (NextAuth with Supabase)

NextAuth.js
와 Supabase Adapter
 기반 인증 사용

다양한 SNS 로그인 지원

Supabase DB와 연동 가능 (공식 문서의 Auth.js | Supabase 가이드라인 준수)

## 4. 환경 변수 설정

레포지토리 내 .env.example 파일 참고해
로컬 개발 환경에서는 .env.local 파일을 생성하여 환경 변수 추가

## 🌐 External APIs / 외부 API

### 💱 Exchange Rate API (환율 조회 API)

본 프로젝트는 [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api)를 사용하여  
특정 날짜 기준 환율 데이터를 조회합니다.  
주 서비스(`cdn.jsdelivr.net`)가 응답하지 않을 경우  
자동으로 보조 서비스(`currency-api.pages.dev`)로 요청을 전환합니다.

#### 🔗 API Endpoints
| 구분 | URL | 설명 |
|------|-----|------|
| Primary | `https://cdn.jsdelivr.net/gh/fawazahmed0/exchange-api@{date}/currencies/{base}.json` | 기준 통화(base) → 타 통화 환율 데이터 |
| Fallback | `https://currency-api.pages.dev/{base}.json` | CDN 실패 시 자동 대체 |

#### 📅 Example Request / 요청 예시
```bash
POST /api/exchange
{
  "amount": 20,
  "currency": "usd",
  "date": "2025-11-11"
}