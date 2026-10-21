'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ArticleForm.module.scss';
import { Article, ArticleFormData, Tag } from '@/types';
import { ROUTES } from '@/constants/routes';
import { articleService } from '@/services/articleService';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { ImageUpload } from '@/components/ui/ImageUpload/ImageUpload';

interface ArticleFormProps {
  initialData?: Article;
  isEdit?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData,
  isEdit = false,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState<ArticleFormData>({
    judul: initialData?.judul ?? '',
    tag_id: initialData?.tag_id ?? 1,
    deskripsi: initialData?.deskripsi ?? '',
    isi: initialData?.isi ?? '',
    gambar: initialData?.gambar ?? '',
  });

  useEffect(() => {
    const loadTags = async () => {
      const data = await articleService.getTags();
      setTags(data);
      if (!initialData?.tag_id && data.length > 0) {
        setFormData((prev) => ({ ...prev, tag_id: data[0].id }));
      }
    };
    loadTags();
  }, [initialData]);

  const handleChange = (field: keyof ArticleFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.isi.trim()) {
      setErrorMessage('Harap isi Judul dan Konten Artikel.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const res = isEdit && initialData
      ? await articleService.update(initialData.id, formData)
      : await articleService.create(formData);

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Gagal menyimpan artikel.');
      return;
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(ROUTES.ADMIN.ARTICLES);
      router.refresh();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errorMessage && (
        <div style={{ padding: '12px 16px', background: '#FEE2E2', color: '#DC2626', borderRadius: '8px' }}>
          {errorMessage}
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>1. Informasi Utama Artikel</h2>
        <div className={styles.row2}>
          <Input
            label="Judul Artikel"
            value={formData.judul}
            onChange={(e) => handleChange('judul', e.target.value)}
            placeholder="Contoh: Tips Mendaki Puncak Bromo Saat Musim Liburan"
            required
          />

          <div className={styles.tagSelector}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Kategori / Tag</label>
            <select
              className={styles.selectControl}
              value={formData.tag_id ?? ''}
              onChange={(e) => handleChange('tag_id', parseInt(e.target.value, 10) || null)}
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>
            Ringkasan Singkat (Lead Paragraph)
          </label>
          <textarea
            className={styles.textareaControl}
            value={formData.deskripsi}
            onChange={(e) => handleChange('deskripsi', e.target.value)}
            placeholder="Deskripsi singkat artikel yang akan muncul di kartu cuplikan..."
            rows={3}
            required
          />
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>2. Gambar Sampul Artikel</h2>
        <ImageUpload
          label="Foto Sampul (Thumbnail)"
          value={formData.gambar}
          onChange={(url) => handleChange('gambar', url)}
          folder="artikel"
          required
        />
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>3. Konten Lengkap Artikel</h2>
        <div>
          <textarea
            className={styles.textareaControl}
            value={formData.isi}
            onChange={(e) => handleChange('isi', e.target.value)}
            placeholder="Tuliskan isi cerita, panduan, atau informasi lengkap wisata di sini..."
            rows={10}
            required
          />
        </div>
      </div>

      <div className={styles.actionBar}>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              router.push(ROUTES.ADMIN.ARTICLES);
            }
          }}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEdit ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
        </Button>
      </div>
    </form>
  );
};
