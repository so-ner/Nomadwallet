import {PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {requireAuth} from '@/lib/auth';
import {r2Client} from "@/lib/r2Client";

/**
 * [POST] /api/storage/upload
 * R2 업로드 presigned URL 발급
 */
export async function POST(req: Request) {
  const user = await requireAuth();
  if ('status' in user) return user;

  // 클라이언트에서 전달한 파일 확장자 및 MIME 타입 받기
  const { contentType } = await req.json();

  // 허용된 MIME 타입만 통과
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(contentType)) {
    return new Response('Unsupported file type', { status: 400 });
  }

  const ext = contentType.split('/')[1]; // 확장자 추출
  const key = `profile/${user.id}.${ext}`; // 고정 파일명

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(r2Client, command, { expiresIn: 60 }); // 60초 유효
  return Response.json({ url, key });
}