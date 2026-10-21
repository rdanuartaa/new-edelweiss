'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { AdminLayout } from '@/components/admin/AdminLayout/AdminLayout';
import { PackageForm } from '@/components/admin/PackageForm/PackageForm';
import { Package } from '@/types';
import { packageService } from '@/services/packageService';

export default function EditPackagePage() {
  const params = useParams();
  const id = params?.id as string;
  const [pkg, setPkg] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPackage = async () => {
      setIsLoading(true);
      const data = await packageService.getById(id);
      setPkg(data);
      setIsLoading(false);
    };
    fetchPackage();
  }, [id]);

  return (
    <AdminLayout
      title="Edit Paket Tour"
      backHref={ROUTES.ADMIN.PACKAGES}
      backLabel="Kembali"
    >

      {isLoading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Memuat data paket...</div>
      ) : pkg ? (
        <PackageForm initialData={pkg} isEdit />
      ) : (
        <div style={{ padding: '32px', textAlign: 'center', color: '#EF4444' }}>
          Paket tour tidak ditemukan.
        </div>
      )}
    </AdminLayout>
  );
}
