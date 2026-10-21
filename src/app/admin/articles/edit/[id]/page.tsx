'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { AdminLayout } from '@/components/admin/AdminLayout/AdminLayout';
import { ArticleForm } from '@/components/admin/ArticleForm/ArticleForm';
import { Article } from '@/types';
import { articleService } from '@/services/articleService';

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      setIsLoading(true);
      const data = await articleService.getById(id);
      setArticle(data);
      setIsLoading(false);
    };
    fetchArticle();
  }, [id]);

  return (
    <AdminLayout
      title="Edit Artikel"
      backHref={ROUTES.ADMIN.ARTICLES}
      backLabel="Kembali"
    >

      {isLoading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Memuat data artikel...</div>
      ) : article ? (
        <ArticleForm initialData={article} isEdit />
      ) : (
        <div style={{ padding: '32px', textAlign: 'center', color: '#EF4444' }}>
          Artikel tidak ditemukan.
        </div>
      )}
    </AdminLayout>
  );
}
