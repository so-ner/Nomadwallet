import {PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {requireAuth} from '@/lib/auth';
import {r2Client} from "@/lib/r2Client";
import {NextResponse} from "next/server";

/**
 * [POST] /api/storage/upload
 * R2 업로드 presigned URL 발급
 */
export async function POST(req: Request) {
  const user = await requireAuth();
  if ('status' in user) return user;

  // 클라이언트에서 전달한 파일 받기
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({error: 'No file uploaded'}, {status: 400});
  }

  // 파일 확장자와 경로 설정
  const ext = file.name.split('.').pop(); // 확장자 추출
  const key = `profile/${user.id}.${ext}`; // 고정 파일명

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${key}`;
    console.log(publicUrl);

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.log('R2 upload error: ', error);
    return NextResponse.json({error: 'Upload failed'}, {status: 500});
  }
}