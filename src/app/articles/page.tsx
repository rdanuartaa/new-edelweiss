'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { Article, Tag } from '@/types';
import { articleService } from '@/services/articleService';
import { Navbar } from '@/components/common/Navbar/Navbar';
import { Footer } from '@/components/common/Footer/Footer';
import { ArticleCard } from '@/components/article/ArticleCard/ArticleCard';
import { PageHighlightCard } from '@/components/common/PageHighlightCard/PageHighlightCard';

export default function ArticlesCatalogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [artList, tagList] = await Promise.all([
        articleService.getAll(),
        articleService.getTags(),
      ]);
      setArticles(artList);
      setTags(tagList);
    };
    loadData();
  }, []);

  const filtered = selectedTag === null
    ? articles
    : articles.filter((art) => art.tag_id === selectedTag);

  return (
    <>
      <Navbar />

      <main>
        <section className={styles.banner}>
          <div className="container">
            <h1 className={styles.bannerTitle}>Artikel & Berita Wisata</h1>
            <p className={styles.bannerSubtitle}>
              Informasi terkini, tips offroad Lava Tour Semeru, panduan rute Bromo, dan inspirasi petualangan seru seputar Jawa Timur.
            </p>
          </div>
        </section>

        <section className="container section-py" style={{ paddingTop: 0 }}>
          <div className={styles.highlightCardWrapper}>
            <PageHighlightCard
              title={
                <>
                  Cerita, Tips & Inspirasi <br />
                  <span>Lava Tour & Semeru</span>
                </>
              }
              description={
                <>
                  Kumpulan artikel edukatif, panduan rute offroad Lava Tour Semeru, tips wisata alam Bromo, serta{' '}
                  <br className={styles.desktopBr} />
                  cerita seru dari para penjelajah alam untuk membantu persiapan liburan Anda lebih maksimal.
                </>
              }
              imageSrc="/images/article_traveler.png"
              imageAlt="Tips Petualang Edelweiss"
              imageVariant="jeep"
            />
          </div>

          <div className={styles.tagsBar}>
            <button
              className={`${styles.tagBtn} ${selectedTag === null ? styles.active : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              Semua Artikel
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`${styles.tagBtn} ${selectedTag === tag.id ? styles.active : ''}`}
                onClick={() => setSelectedTag(tag.id)}
              >
                {tag.nama}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              <p>Belum ada artikel pada kategori ini.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
