'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DashboardPagination.module.scss';

export const DASHBOARD_PAGE_SIZE = 5;

interface DashboardPaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  itemLabel?: string;
}

const DOTS = 'dots';

const getVisiblePages = (currentPage: number, pageCount: number): (number | typeof DOTS)[] => {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) return [1, 2, 3, DOTS, pageCount];
  if (currentPage >= pageCount - 2) {
    return [1, DOTS, pageCount - 2, pageCount - 1, pageCount];
  }

  return [1, DOTS, currentPage, DOTS, pageCount];
};

export const DashboardPagination: React.FC<DashboardPaginationProps> = ({
  currentPage,
  totalItems,
  onPageChange,
  pageSize = DASHBOARD_PAGE_SIZE,
  itemLabel = 'data',
}) => {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const goToPage = (page: number) => {
    if (page < 1 || page > pageCount || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className={styles.paginationWrap}>
      <p className={styles.infoText}>
        Menampilkan {from}-{to} dari {totalItems} {itemLabel}
      </p>

      <ul className={styles.paginationList}>
        <li className={styles.pageItem}>
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {getVisiblePages(currentPage, pageCount).map((page, index) =>
          page === DOTS ? (
            <li key={`${page}-${index}`} className={`${styles.pageItem} ${styles.ellipsis}`}>
              <span>...</span>
            </li>
          ) : (
            <li
              key={page}
              className={`${styles.pageItem} ${page === currentPage ? styles.active : ''}`}
            >
              <button
                type="button"
                onClick={() => goToPage(page as number)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            </li>
          )
        )}

        <li className={styles.pageItem}>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export { DashboardPagination as Pagination };

