'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Search, Calendar, Tag } from 'lucide-react';
import styles from '../packages/page.module.scss';
import { Article } from '@/types';
import { articleService } from '@/services/articleService';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils/format';
import { AdminLayout } from '@/components/admin/AdminLayout/AdminLayout';
import { ConfirmModal } from '@/components/common/ConfirmModal/ConfirmModal';
import { AdminCrudModal } from '@/components/admin/AdminCrudModal/AdminCrudModal';
import { ArticleForm } from '@/components/admin/ArticleForm/ArticleForm';
import { DashboardPagination, DASHBOARD_PAGE_SIZE } from '@/components/common/DashboardPagination/DashboardPagination';

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    data: Article | null;
  }>({
    isOpen: false,
    mode: 'create',
    data: null,
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await articleService.getAll();
    setArticles(data);
  };

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((art) => {
      if (art.tags?.nama) tags.add(art.tags.nama);
    });
    return ['All', ...Array.from(tags)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag =
        selectedTag === 'All' || art.tags?.nama === selectedTag;
      return matchesSearch && matchesTag;
    });
  }, [articles, searchTerm, selectedTag]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * DASHBOARD_PAGE_SIZE;
    return filteredArticles.slice(start, start + DASHBOARD_PAGE_SIZE);
  }, [filteredArticles, currentPage]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await articleService.delete(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    loadArticles();
  };

  const handleAddArticle = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      router.push(ROUTES.ADMIN.ARTICLE_CREATE);
    } else {
      setModalState({ isOpen: true, mode: 'create', data: null });
    }
  };

  return (
    <AdminLayout title="Kelola Artikel & Berita">
      <div className={styles.widgetBox}>
        <div className={styles.topHeader}>
          <div className={styles.titleArea}>
            <h2 className={styles.pageTitle}>Daftar Artikel</h2>
            <p className={styles.pageSubtitle}>
              Total {articles.length} artikel terdaftar dalam portal
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddArticle}
            className={styles.btnAdd}
          >
            <Plus size={18} />
            <span>Tambah Artikel</span>
          </button>
        </div>

        <div className={styles.filterRow}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Cari judul atau isi artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter Tag Artikel"
          >
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag === 'All' ? 'Semua Kategori' : tag}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tableWrap}>
          {filteredArticles.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tidak ada artikel yang cocok dengan pencarian.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '48%' }}>Artikel</th>
                  <th style={{ width: '18%' }}>Kategori / Tag</th>
                  <th style={{ width: '18%' }}>Tanggal Terbit</th>
                  <th style={{ width: '16%', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.map((art) => (
                  <tr key={art.id}>
                    <td>
                      <div className={styles.listingBox}>
                        <img
                          src={art.gambar || '/user_assets/images/blog/blog-1.jpg'}
                          alt={art.judul}
                          className={styles.listingThumb}
                        />
                        <div className={styles.listingMeta}>
                          <span className={styles.listingTitle}>{art.judul}</span>
                          <span
                            className={styles.listingLocation}
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              maxWidth: '380px',
                            }}
                          >
                            {art.deskripsi}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.badgePill}>
                        <Tag size={12} style={{ marginRight: 4 }} />
                        {art.tags?.nama || 'Umum'}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.86rem',
                          color: '#64748B',
                          fontWeight: 500,
                        }}
                      >
                        <Calendar size={14} />
                        <span>{formatDate(art.created_at)}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionList}>
                        <button
                          type="button"
                          onClick={() => setModalState({ isOpen: true, mode: 'edit', data: art })}
                          className={styles.btnActionEdit}
                          title="Edit Artikel"
                        >
                          <Edit2 size={15} />
                          <span>Ubah</span>
                        </button>
                        <button
                          type="button"
                          className={styles.btnActionDelete}
                          onClick={() => setDeleteTarget(art)}
                          title="Hapus Artikel"
                        >
                          <Trash2 size={15} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.mobileCardsView}>
          {filteredArticles.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tidak ada artikel yang cocok dengan pencarian.</p>
            </div>
          ) : (
            paginatedArticles.map((art) => (
              <div key={art.id} className={styles.mobileCard}>
                <div className={styles.cardTopRow}>
                  <img
                    src={art.gambar || '/user_assets/images/blog/blog-1.jpg'}
                    alt={art.judul}
                    className={styles.cardThumb}
                  />
                  <div className={styles.cardInfo}>
                    <span className={styles.cardTitle}>{art.judul}</span>
                    <span
                      className={styles.cardSub}
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {art.deskripsi}
                    </span>
                  </div>
                </div>

                <div className={styles.cardMetaRow}>
                  <span className={styles.badgePill}>
                    <Tag size={12} style={{ marginRight: 4 }} />
                    {art.tags?.nama || 'Umum'}
                  </span>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.82rem',
                      color: '#64748B',
                      fontWeight: 500,
                    }}
                  >
                    <Calendar size={13} />
                    <span>{formatDate(art.created_at)}</span>
                  </div>
                </div>

                <div className={styles.cardActionRow}>
                  <Link
                    href={ROUTES.ADMIN.ARTICLE_EDIT(art.id)}
                    className={styles.btnMobileEdit}
                  >
                    <Edit2 size={15} />
                    <span>Ubah</span>
                  </Link>
                  <button
                    type="button"
                    className={styles.btnMobileDelete}
                    onClick={() => setDeleteTarget(art)}
                  >
                    <Trash2 size={15} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <DashboardPagination
          currentPage={currentPage}
          totalItems={filteredArticles.length}
          pageSize={DASHBOARD_PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Artikel"
        message={`Apakah kamu yakin ingin menghapus artikel "${deleteTarget?.judul}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />

      <AdminCrudModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create', data: null })}
        title={modalState.mode === 'create' ? 'Tambah Artikel Baru' : 'Edit Artikel'}
      >
        <ArticleForm
          key={modalState.data?.id || 'new'}
          initialData={modalState.data || undefined}
          isEdit={modalState.mode === 'edit'}
          onSuccess={() => {
            setModalState({ isOpen: false, mode: 'create', data: null });
            loadArticles();
          }}
          onCancel={() => {
            setModalState({ isOpen: false, mode: 'create', data: null });
          }}
        />
      </AdminCrudModal>
    </AdminLayout>
  );
}
