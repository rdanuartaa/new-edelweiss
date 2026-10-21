'use client';

import React from 'react';
import { ROUTES } from '@/constants/routes';
import { AdminLayout } from '@/components/admin/AdminLayout/AdminLayout';
import { PackageForm } from '@/components/admin/PackageForm/PackageForm';

export default function CreatePackagePage() {
  return (
    <AdminLayout
      title="Tambah Paket Tour Baru"
      backHref={ROUTES.ADMIN.PACKAGES}
      backLabel="Kembali"
    >
      <PackageForm />
    </AdminLayout>
  );
}
