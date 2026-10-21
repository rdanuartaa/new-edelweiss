'use client';

import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Carousel.module.scss';

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showPagination?: boolean;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = true,
  interval = 4000,
  showArrows = true,
  showPagination = true,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalItems = React.Children.count(children);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const items = track.children;
    if (!items || !items[index]) return;

    const targetItem = items[index] as HTMLElement;
    const scrollTarget = targetItem.offsetLeft - track.offsetLeft;

    track.scrollTo({
      left: scrollTarget,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (!autoPlay || isPaused || totalItems <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % totalItems;
        scrollToIndex(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, totalItems, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || totalItems <= 1) return;

    const currentScrollLeft = track.scrollLeft;
    const items = Array.from(track.children) as HTMLElement[];

    let closestIndex = 0;
    let minDistance = Infinity;

    items.forEach((item, idx) => {
      const distance = Math.abs((item.offsetLeft - track.offsetLeft) - currentScrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, [totalItems]);

  const handlePrev = () => {
    const prev = (activeIndex - 1 + totalItems) % totalItems;
    scrollToIndex(prev);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % totalItems;
    scrollToIndex(next);
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={`${styles.carouselWrapper} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className={styles.viewport}>
        {showArrows && totalItems > 1 && (
          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.prevBtn}`}
            onClick={handlePrev}
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div
          ref={trackRef}
          className={styles.track}
          onScroll={handleScroll}
        >
          {React.Children.map(children, (child, idx) => (
            <div key={idx} className={styles.slide}>
              {child}
            </div>
          ))}
        </div>

        {showArrows && totalItems > 1 && (
          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.nextBtn}`}
            onClick={handleNext}
            aria-label="Slide berikutnya"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {showPagination && totalItems > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalItems }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Pindah ke slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
