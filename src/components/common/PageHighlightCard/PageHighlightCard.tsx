'use client';

import React from 'react';
import styles from './PageHighlightCard.module.scss';
import { CtaTravelersImage } from '@/components/home/CtaTravelersImage/CtaTravelersImage';

interface PageHighlightCardProps {
  icon?: React.ReactNode;
  badge?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imageVariant?: 'jeep' | 'fleet' | 'traveler';
  className?: string;
}

export const PageHighlightCard: React.FC<PageHighlightCardProps> = ({
  icon,
  badge,
  title,
  description,
  imageSrc,
  imageAlt,
  imageVariant = 'traveler',
  className,
}) => {
  const cardClasses = className ? `${styles.card} ${className}` : styles.card;
  const isFleet = imageVariant === 'fleet';
  const isJeep = imageVariant === 'jeep';
  const bodyModifier = isFleet ? styles.hasFleet : (isJeep ? styles.hasJeep : styles.hasImage);
  const bodyClasses = `${styles.cardBody} ${imageSrc ? bodyModifier : ''}`.trim();
  const wrapClasses = isFleet ? styles.fleetWrap : (isJeep ? styles.jeepWrap : styles.travelerWrap);
  const imgClasses = isFleet ? styles.fleetImg : (isJeep ? styles.jeepImg : styles.travelerImg);

  return (
    <div className={cardClasses}>
      <div className={bodyClasses}>
        {(badge || icon) && (
          <div className={styles.metaRow}>
            {icon && <div className={styles.iconCircle}>{icon}</div>}
            {badge && (
              <div className={styles.badge}>
                <span />
                {badge}
              </div>
            )}
          </div>
        )}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      {imageSrc && (
        <CtaTravelersImage
          src={imageSrc}
          alt={imageAlt || ''}
          className={wrapClasses}
          imgClassName={imgClasses}
        />
      )}
    </div>
  );
};
