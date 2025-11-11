import bcrypt from 'bcryptjs';

// 비밀번호 암호화
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}