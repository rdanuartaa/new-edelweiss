import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, isR2Configured } from '@/lib/r2/client';
import { supabase } from '@/lib/supabase/client';

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

    const targetFolder = FOLDER_MAP[requestedFolder] || requestedFolder;
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
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
