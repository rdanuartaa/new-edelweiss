'use client';

import React from 'react';
import { ROUTES } from '@/constants/routes';
import { AdminLayout } from '@/components/admin/AdminLayout/AdminLayout';
import { ArticleForm } from '@/components/admin/ArticleForm/ArticleForm';

export default function CreateArticlePage() {
  return (
    <AdminLayout
      title="Tambah Artikel Baru"
      backHref={ROUTES.ADMIN.ARTICLES}
      backLabel="Kembali"
    >
      <ArticleForm />
    </AdminLayout>
  );
}
