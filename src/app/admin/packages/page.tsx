'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react';
import styles from './page.module.scss';
import { Package } from '@/types';
import { packageService } from '@/services/packageService';
import { ROUTES } from '@/constants/routes';
import { formatRupiah } from '@/utils/format';
import { AdminLayout } from '@/components/admin/AdminLayout/AdminLayout';
import { ConfirmModal } from '@/components/common/ConfirmModal/ConfirmModal';
import { AdminCrudModal } from '@/components/admin/AdminCrudModal/AdminCrudModal';
import { PackageForm } from '@/components/admin/PackageForm/PackageForm';
import { DashboardPagination, DASHBOARD_PAGE_SIZE } from '@/components/common/DashboardPagination/DashboardPagination';

export default function AdminPackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    data: Package | null;
  }>({
    isOpen: false,
    mode: 'create',
    data: null,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const data = await packageService.getAll();
    setPackages(data);
  };

  const locations = useMemo(() => {
    const locSet = new Set<string>();
    packages.forEach((pkg) => {
      if (pkg.location) locSet.add(pkg.location);
    });
    return ['All', ...Array.from(locSet)];
  }, [packages]);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        selectedLocation === 'All' || pkg.location === selectedLocation;
      return matchesSearch && matchesLocation;
    });
  }, [packages, searchTerm, selectedLocation]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation]);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * DASHBOARD_PAGE_SIZE;
    return filteredPackages.slice(start, start + DASHBOARD_PAGE_SIZE);
  }, [filteredPackages, currentPage]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await packageService.delete(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    loadPackages();
  };

  const handleAddPackage = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      router.push(ROUTES.ADMIN.PACKAGE_CREATE);
    } else {
      setModalState({ isOpen: true, mode: 'create', data: null });
    }
  };

  return (
    <AdminLayout title="Kelola Paket Tour">
      <div className={styles.widgetBox}>
        <div className={styles.topHeader}>
          <div className={styles.titleArea}>
            <h2 className={styles.pageTitle}>Daftar Paket Tour</h2>
            <p className={styles.pageSubtitle}>
              Total {packages.length} paket tour tersedia di sistem
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddPackage}
            className={styles.btnAdd}
          >
            <Plus size={18} />
            <span>Tambah Paket Tour</span>
          </button>
        </div>

        <div className={styles.filterRow}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Cari nama atau destinasi paket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter Destinasi"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'Semua Destinasi' : loc}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tableWrap}>
          {filteredPackages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tidak ada paket tour yang cocok dengan kriteria pencarian.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Paket Tour</th>
                  <th style={{ width: '20%' }}>Varian / Opsi</th>
                  <th style={{ width: '20%' }}>Harga Mulai</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPackages.map((pkg) => {
                  const minPrice =
                    pkg.package_details && pkg.package_details.length > 0
                      ? Math.min(...pkg.package_details.map((d) => d.price))
                      : 0;

                  return (
                    <tr key={pkg.id}>
                      <td>
                        <div className={styles.listingBox}>
                          <img
                            src={pkg.banner || pkg.poster || '/images/bromo.jpg'}
                            alt={pkg.name}
                            className={styles.listingThumb}
                          />
                          <div className={styles.listingMeta}>
                            <span className={styles.listingTitle}>{pkg.name}</span>
                            <span className={styles.listingLocation}>
                              <MapPin size={13} />
                              {pkg.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badgePill}>
                          {pkg.package_details?.length ?? 0} Pilihan
                        </span>
                      </td>
                      <td>
                        <span className={styles.priceTag}>
                          {formatRupiah(minPrice)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionList}>
                          <button
                            type="button"
                            onClick={() => setModalState({ isOpen: true, mode: 'edit', data: pkg })}
                            className={styles.btnActionEdit}
                            title="Edit Paket"
                          >
                            <Edit2 size={15} />
                            <span>Ubah</span>
                          </button>
                          <button
                            type="button"
                            className={styles.btnActionDelete}
                            onClick={() => setDeleteTarget(pkg)}
                            title="Hapus Paket"
                          >
                            <Trash2 size={15} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.mobileCardsView}>
          {filteredPackages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tidak ada paket tour yang cocok dengan kriteria pencarian.</p>
            </div>
          ) : (
            paginatedPackages.map((pkg) => {
              const minPrice =
                pkg.package_details && pkg.package_details.length > 0
                  ? Math.min(...pkg.package_details.map((d) => d.price))
                  : 0;

              return (
                <div key={pkg.id} className={styles.mobileCard}>
                  <div className={styles.cardTopRow}>
                    <img
                      src={pkg.banner || pkg.poster || '/images/bromo.jpg'}
                      alt={pkg.name}
                      className={styles.cardThumb}
                    />
                    <div className={styles.cardInfo}>
                      <span className={styles.cardTitle}>{pkg.name}</span>
                      <span className={styles.cardSub}>
                        <MapPin size={12} />
                        {pkg.location}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardMetaRow}>
                    <span className={styles.badgePill}>
                      {pkg.package_details?.length ?? 0} Pilihan Opsi
                    </span>
                    <span className={styles.priceTag}>
                      {formatRupiah(minPrice)}
                    </span>
                  </div>

                  <div className={styles.cardActionRow}>
                    <Link
                      href={ROUTES.ADMIN.PACKAGE_EDIT(pkg.id)}
                      className={styles.btnMobileEdit}
                    >
                      <Edit2 size={15} />
                      <span>Ubah</span>
                    </Link>
                    <button
                      type="button"
                      className={styles.btnMobileDelete}
                      onClick={() => setDeleteTarget(pkg)}
                    >
                      <Trash2 size={15} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DashboardPagination
          currentPage={currentPage}
          totalItems={filteredPackages.length}
          pageSize={DASHBOARD_PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Paket"
        message={`Apakah kamu yakin ingin menghapus paket tour "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />

      <AdminCrudModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create', data: null })}
        title={modalState.mode === 'create' ? 'Tambah Paket Tour Baru' : 'Edit Paket Tour'}
      >
        <PackageForm
          key={modalState.data?.id || 'new'}
          initialData={modalState.data || undefined}
          isEdit={modalState.mode === 'edit'}
          onSuccess={() => {
            setModalState({ isOpen: false, mode: 'create', data: null });
            loadPackages();
          }}
          onCancel={() => {
            setModalState({ isOpen: false, mode: 'create', data: null });
          }}
        />
      </AdminCrudModal>
    </AdminLayout>
  );
}
