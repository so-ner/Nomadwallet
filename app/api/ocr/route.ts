import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

const OCR_SERVICE_URL = process.env.NOMAD_PYTHON_SERVICE_URL ?? 'http://r2-delete-api:8000';

/**
 * [POST] /api/ocr
 * 영수증 OCR 요청
 */
export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if ('status' in user) return user;

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 });
    }

    // OCR 서비스에 요청
    const ocrFormData = new FormData();
    ocrFormData.append('file', file);

    const response = await fetch(`${OCR_SERVICE_URL}/images/ocr`, {
      method: 'POST',
      body: ocrFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'OCR 요청 실패' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('OCR 요청 실패:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '영수증 인식에 실패했습니다.' },
      { status: 500 }
    );
  }
}

