import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import styles from './ArticleCard.module.scss';
import { Article } from '@/types';
import { formatDate, slugify } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { Badge } from '@/components/ui/Badge/Badge';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const displayImage = article.gambar || '/user_assets/images/blog/blog-1.jpg';
  const tagTitle = article.tags?.nama || 'Wisata';
  const articleSlug = article.slug || slugify(article.judul);

  return (
    <article className={styles.card}>
      <Link href={ROUTES.ARTICLE_DETAIL(articleSlug)} className={styles.imageWrapper}>
        <img src={displayImage} alt={article.judul} />
        <div className={styles.tagBadge}>
          <Badge variant="primary">{tagTitle}</Badge>
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.dateRow}>
          <Calendar size={14} />
          <span>{formatDate(article.created_at)}</span>
        </div>

        <Link href={ROUTES.ARTICLE_DETAIL(articleSlug)}>
          <h3 className={styles.title}>{article.judul}</h3>
        </Link>
        <p className={styles.description}>{article.deskripsi}</p>

        <Link href={ROUTES.ARTICLE_DETAIL(articleSlug)} className={styles.readMore}>
          <span>Baca Selengkapnya</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
};

