import { supabase } from '@/lib/supabase/client';
import { Article, ArticleFormData, Tag } from '@/types';
import { INITIAL_ARTICLES, INITIAL_TAGS } from '@/constants/initialData';
import { slugify } from '@/utils/format';

export const articleService = {
  async getAll(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          tags (*)
        `)
        .order('id', { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_ARTICLES;
      }

      return (data as Article[]).map((item) => ({
        ...item,
        slug: item.slug || slugify(item.judul),
      }));
    } catch {
      return INITIAL_ARTICLES;
    }
  },

  async getBySlugOrId(slugOrId: number | string): Promise<Article | null> {
    const raw = String(slugOrId).trim();
    const numericId = parseInt(raw, 10);
    const isNumeric = !isNaN(numericId) && String(numericId) === raw;

    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          tags (*)
        `);

      if (isNumeric) {
        query = query.eq('id', numericId);
      } else {
        query = query.eq('slug', raw);
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return {
          ...data,
          slug: data.slug || slugify(data.judul),
        } as Article;
      }

      const match = INITIAL_ARTICLES.find(
        (art) =>
          art.slug === raw ||
          slugify(art.judul) === raw ||
          (isNumeric && art.id === numericId)
      );

      if (match) {
        return {
          ...match,
          slug: match.slug || slugify(match.judul),
        };
      }

      const all = await this.getAll();
      const fallback = all.find(
        (art) =>
          art.slug === raw ||
          slugify(art.judul) === raw ||
          (isNumeric && art.id === numericId)
      );

      return fallback ?? null;
    } catch {
      const match = INITIAL_ARTICLES.find(
        (art) =>
          art.slug === raw ||
          slugify(art.judul) === raw ||
          (isNumeric && art.id === numericId)
      );
      return match ? { ...match, slug: match.slug || slugify(match.judul) } : null;
    }
  },

  async getById(id: number | string): Promise<Article | null> {
    return this.getBySlugOrId(id);
  },

  async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('nama', { ascending: true });

      if (error || !data || data.length === 0) {
        return INITIAL_TAGS;
      }

      return data as Tag[];
    } catch {
      return INITIAL_TAGS;
    }
  },

  async createTag(nama: string): Promise<Tag | null> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({ nama: nama.trim() })
        .select()
        .single();

      if (error || !data) return null;
      return data as Tag;
    } catch {
      return null;
    }
  },

  async create(payload: ArticleFormData): Promise<{ success: boolean; data?: Article; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          judul: payload.judul,
          tag_id: payload.tag_id,
          deskripsi: payload.deskripsi,
          isi: payload.isi,
          gambar: payload.gambar,
        })
        .select()
        .single();

      if (error || !data) {
        return { success: false, error: error?.message ?? 'Gagal membuat artikel' };
      }

      return { success: true, data: data as Article };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      return { success: false, error: message };
    }
  },

  async update(id: number, payload: ArticleFormData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          judul: payload.judul,
          tag_id: payload.tag_id,
          deskripsi: payload.deskripsi,
          isi: payload.isi,
          gambar: payload.gambar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui artikel';
      return { success: false, error: message };
    }
  },

  async delete(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus artikel';
      return { success: false, error: message };
    }
  },
};
