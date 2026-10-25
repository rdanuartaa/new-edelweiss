import { supabase } from '@/lib/supabase/client';

export const storageService = {
  async uploadMedia(file: File, folder: string = 'tour/banner'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.url) {
          return result.url;
        }
      }

      return await this.fallbackDirectUpload(file, folder);
    } catch {
      return await this.fallbackDirectUpload(file, folder);
    }
  },

  async fallbackDirectUpload(file: File, folder: string): Promise<string> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const bucket = folder.startsWith('artikel') ? 'article-media' : 'tour-media';
    const filePath = `uploads/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return URL.createObjectURL(file);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch {
      return URL.createObjectURL(file);
    }
  },
};
