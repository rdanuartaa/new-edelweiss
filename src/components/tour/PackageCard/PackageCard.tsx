import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import styles from './PackageCard.module.scss';
import { Package } from '@/types';
import { formatRupiah, formatLocation } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button/Button';

interface PackageCardProps {
  pkg: Package;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const minPrice = pkg.package_details && pkg.package_details.length > 0
    ? Math.min(...pkg.package_details.map((d) => d.price))
    : 0;

  const displayImage = pkg.banner || pkg.poster || '/images/bromo.jpg';

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={displayImage} alt={pkg.name} />
        <span className={styles.locationBadge}>
          <MapPin size={12} />
          {formatLocation(pkg.location)}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{pkg.name}</h3>
        <p className={styles.description}>{pkg.description}</p>

        <div className={styles.footer}>
          <div className={styles.priceCol}>
            <span className={styles.priceLabel}>Mulai Dari</span>
            <span className={styles.priceValue}>{formatRupiah(minPrice)}</span>
          </div>

          <Link href={ROUTES.PACKAGE_DETAIL(pkg.id)}>
            <Button size="sm" variant="outline" rightIcon={<ArrowRight size={14} />}>
              Detail
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
