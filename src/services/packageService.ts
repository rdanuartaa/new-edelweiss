import { supabase } from '@/lib/supabase/client';
import { Package, PackageFormData } from '@/types';
import { INITIAL_PACKAGES } from '@/constants/initialData';
import { slugify } from '@/utils/format';

export const packageService = {
  async getAll(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          package_details (
            *,
            facilities (*)
          )
        `)
        .order('id', { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_PACKAGES.map((item) => ({
          ...item,
          slug: item.slug || slugify(item.name),
        }));
      }

      return (data as Package[]).map((item) => ({
        ...item,
        slug: item.slug || slugify(item.name),
      }));
    } catch {
      return INITIAL_PACKAGES.map((item) => ({
        ...item,
        slug: item.slug || slugify(item.name),
      }));
    }
  },

  async getBySlugOrId(slugOrId: number | string): Promise<Package | null> {
    const raw = String(slugOrId).trim();
    const numericId = parseInt(raw, 10);
    const isNumeric = !isNaN(numericId) && String(numericId) === raw;

    try {
      if (isNumeric) {
        const { data, error } = await supabase
          .from('packages')
          .select(`
            *,
            package_details (
              *,
              facilities (*)
            )
          `)
          .eq('id', numericId)
          .maybeSingle();

        if (!error && data) {
          return {
            ...data,
            slug: data.slug || slugify(data.name),
          } as Package;
        }
      }

      const all = await this.getAll();
      const match = all.find(
        (pkg) =>
          pkg.slug === raw ||
          slugify(pkg.name) === raw ||
          (isNumeric && pkg.id === numericId)
      );

      if (match) {
        return match;
      }

      const initialMatch = INITIAL_PACKAGES.find(
        (pkg) =>
          pkg.slug === raw ||
          slugify(pkg.name) === raw ||
          (isNumeric && pkg.id === numericId)
      );

      return initialMatch
        ? { ...initialMatch, slug: initialMatch.slug || slugify(initialMatch.name) }
        : null;
    } catch {
      const initialMatch = INITIAL_PACKAGES.find(
        (pkg) =>
          pkg.slug === raw ||
          slugify(pkg.name) === raw ||
          (isNumeric && pkg.id === numericId)
      );
      return initialMatch
        ? { ...initialMatch, slug: initialMatch.slug || slugify(initialMatch.name) }
        : null;
    }
  },

  async getById(id: number | string): Promise<Package | null> {
    return this.getBySlugOrId(id);
  },

  async getPopular(limit: number = 6): Promise<Package[]> {
    const all = await this.getAll();
    return [...all].sort((a, b) => a.id - b.id).slice(0, limit);
  },

  async create(payload: PackageFormData): Promise<{ success: boolean; data?: Package; error?: string }> {
    try {
      const { data: pkg, error: pkgError } = await supabase
        .from('packages')
        .insert({
          name: payload.name,
          description: payload.description,
          location: payload.location,
          latitude: payload.latitude,
          longitude: payload.longitude,
          banner: payload.banner,
          poster: payload.poster,
        })
        .select()
        .single();

      if (pkgError || !pkg) {
        return { success: false, error: pkgError?.message ?? 'Gagal membuat paket' };
      }

      for (const option of payload.options) {
        const { data: detail, error: detailError } = await supabase
          .from('package_details')
          .insert({
            package_id: pkg.id,
            option_name: option.option_name,
            price: option.price,
            duration: option.duration,
          })
          .select()
          .single();

        if (detailError || !detail) continue;

        if (option.facilities && option.facilities.length > 0) {
          const facilitiesData = option.facilities
            .filter((f) => f.trim().length > 0)
            .map((f) => ({
              package_detail_id: detail.id,
              name: f.trim(),
            }));

          if (facilitiesData.length > 0) {
            await supabase.from('facilities').insert(facilitiesData);
          }
        }
      }

      return { success: true, data: pkg };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      return { success: false, error: message };
    }
  },

  async update(id: number, payload: PackageFormData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error: updateError } = await supabase
        .from('packages')
        .update({
          name: payload.name,
          description: payload.description,
          location: payload.location,
          latitude: payload.latitude,
          longitude: payload.longitude,
          banner: payload.banner,
          poster: payload.poster,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      await supabase.from('package_details').delete().eq('package_id', id);

      for (const option of payload.options) {
        const { data: detail, error: detailError } = await supabase
          .from('package_details')
          .insert({
            package_id: id,
            option_name: option.option_name,
            price: option.price,
            duration: option.duration,
          })
          .select()
          .single();

        if (detailError || !detail) continue;

        if (option.facilities && option.facilities.length > 0) {
          const facilitiesData = option.facilities
            .filter((f) => f.trim().length > 0)
            .map((f) => ({
              package_detail_id: detail.id,
              name: f.trim(),
            }));

          if (facilitiesData.length > 0) {
            await supabase.from('facilities').insert(facilitiesData);
          }
        }
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui paket';
      return { success: false, error: message };
    }
  },

  async delete(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus paket';
      return { success: false, error: message };
    }
  },
};
