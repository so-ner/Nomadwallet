import { randomBytes, createHash } from 'crypto';

// 메일에 넣는 원문 토큰
export async function generateRawToken(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}

// DB에 저장할 해시
export async function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}