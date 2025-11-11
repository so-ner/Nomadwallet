import {DeleteObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {requireAuth} from '@/lib/auth';
import {r2Client} from "@/lib/r2Client";

/**
 * [DELETE] /api/storage/delete
 * R2 삭제
 */
export async function DELETE(req: Request) {
  const user = await requireAuth();
  if ('status' in user) return user;

  let {key} = await req.json();
  if (!key) return new Response('Missing key', {status: 400});
  if (key.includes("?v=")) key = key.split("?v=")[0]; // 캐시 무효화용 timestamp 제거

  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );
    return Response.json({success: true});
  } catch (err) {
    console.error('R2 삭제 실패:', err);
    return new Response('Delete failed', {status: 500});
  }
}