'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import styles from './page.module.scss';
import { Article } from '@/types';
import { articleService } from '@/services/articleService';
import { formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { Navbar } from '@/components/common/Navbar/Navbar';
import { Footer } from '@/components/common/Footer/Footer';
import { Button } from '@/components/ui/Button/Button';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = (params?.slug || params?.id) as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      setIsLoading(true);
      const data = await articleService.getBySlugOrId(slug);
      setArticle(data);
      setIsLoading(false);
    };
    fetchArticle();
  }, [slug]);

  const shareText = encodeURIComponent(`Baca artikel menarik: "${article?.judul || ''}" di Edelweiss Tour & Travel`);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappShare = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;

  return (
    <>
      <Navbar />

      <main>
        {isLoading ? (
          <div className="container section-py" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#8C93A0' }}>Memuat artikel...</p>
          </div>
        ) : !article ? (
          <div className="container section-py" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2>Artikel tidak ditemukan.</h2>
            <Link href={ROUTES.ARTICLES} style={{ marginTop: '16px', display: 'inline-block' }}>
              <Button variant="primary">Kembali ke Daftar Artikel</Button>
            </Link>
          </div>
        ) : (
          <>
            <section
              className={styles.heroBanner}
              style={{
                backgroundImage: `linear-gradient(rgba(22, 25, 33, 0.75), rgba(22, 25, 33, 0.85)), url('${article.gambar || '/images/poster_lavatour.jpg'}')`,
              }}
            >
              <div className={`container ${styles.heroContent}`}>
            <div className={styles.metaRow}>
              <span className={styles.tagBadge}>{article.tags?.nama || 'Wisata'}</span>
              <div className={styles.date}>
                <Calendar size={14} />
                <span>{formatDate(article.created_at)}</span>
              </div>
            </div>

            <h1 className={styles.title}>{article.judul}</h1>

            <div className={styles.heroCta}>
              <Link href={ROUTES.ARTICLES}>
                <Button size="sm" variant="primary" leftIcon={<ArrowLeft size={16} />}>
                  Kembali ke Semua Artikel
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <article className={styles.articleContainer}>
          <div className={styles.articleMetaTop}>
            <span className={styles.categoryBadge}>{article.tags?.nama || 'Wisata'}</span>
            <div className={styles.dateMeta}>
              <Calendar size={15} />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>

          <p className={styles.lead}>{article.deskripsi}</p>

          <div className={styles.imageWrapper}>
            <img
              src={article.gambar || '/user_assets/images/blog/blog-1.jpg'}
              alt={article.judul}
            />
          </div>

          <div className={styles.content}>{article.isi}</div>

          <div className={styles.shareBox}>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1E2833' }}>Bagikan Cerita Ini</h4>
              <p style={{ fontSize: '0.85rem', color: '#5E626B' }}>
                Bantu teman Anda merencanakan liburan impian ke Bromo & sekitarnya.
              </p>
            </div>

            <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="secondary" leftIcon={<Share2 size={16} />}>
                Bagikan ke WhatsApp
              </Button>
            </a>
          </div>
        </article>
      </>
    )}
  </main>

  <Footer />
</>
);
}
