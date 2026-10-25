import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, isR2Configured } from '@/lib/r2/client';
import { supabase } from '@/lib/supabase/client';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const FOLDER_MAP: Record<string, string> = {
  'article-media': 'artikel',
  'artikel': 'artikel',
  'article': 'artikel',
  'tour/banner': 'tour/banner',
  'tour/poster': 'tour/poster',
  'banner': 'tour/banner',
  'poster': 'tour/poster',
  'tour': 'tour/banner',
  'tour-media': 'tour/banner',
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isMockAuth = !supabaseUrl || supabaseUrl.includes('placeholder');

    if (!isMockAuth) {
      if (!token) {
        return NextResponse.json(
          { error: 'Akses ditolak: Autentikasi sesi admin diperlukan' },
          { status: 401 }
        );
      }

      const { data: userData, error: authError } = await supabase.auth.getUser(token);
      if (authError || !userData.user) {
        return NextResponse.json(
          { error: 'Akses ditolak: Sesi admin tidak valid atau telah kedaluwarsa' },
          { status: 401 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const requestedFolder =
      (formData.get('folder') as string) ||
      (formData.get('bucket') as string) ||
      'tour/banner';

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimal 5MB' },
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        { error: 'Format file tidak diizinkan. Gunakan JPG, PNG, atau WebP' },
        { status: 400 }
      );
    }

    const targetFolder = FOLDER_MAP[requestedFolder] || 'tour/banner';
    const timestamp = Date.now();
    const randomHash = Math.random().toString(36).substring(2, 10);
    const cleanFileName = `${timestamp}-${randomHash}.${fileExt}`;
    const r2Key = `${targetFolder}/${cleanFileName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (isR2Configured && r2Client && process.env.R2_BUCKET_NAME) {
      const publicBaseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

      await r2Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: r2Key,
          Body: fileBuffer,
          ContentType: file.type || 'image/jpeg',
        })
      );

      const publicUrl = publicBaseUrl
        ? `${publicBaseUrl}/${r2Key}`
        : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${r2Key}`;

      return NextResponse.json({
        url: publicUrl,
        provider: 'cloudflare-r2',
        path: r2Key,
      });
    }

    const supabaseBucket = targetFolder.startsWith('artikel') ? 'article-media' : 'tour-media';
    const supabasePath = `uploads/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(supabaseBucket)
      .upload(supabasePath, fileBuffer, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(supabasePath);

    return NextResponse.json({
      url: data.publicUrl,
      provider: 'supabase',
      path: supabasePath,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
