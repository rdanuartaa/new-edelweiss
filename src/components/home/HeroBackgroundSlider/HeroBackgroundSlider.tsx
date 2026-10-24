'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './HeroBackgroundSlider.module.scss';

const SLIDES = [
  { id: 1, image: '/images/bromo.jpg', position: 'center center' },
  { id: 2, image: '/images/sumberurip.jpg', position: 'center 48%' },
  { id: 3, image: '/images/pronojiwo.jpg', position: 'center 72%' },
];

const SLIDE_INTERVAL_MS = 5000;

export const HeroBackgroundSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <>
      <div className={styles.sliderContainer}>
        {SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              className={`${styles.slide} ${isActive ? styles.active : ''}`}
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundPosition: slide.position,
              }}
            />
          );
        })}
        <div className={styles.overlay} />
      </div>

      <div className={styles.indicators}>
        {SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`${styles.dot} ${isActive ? styles.activeDot : ''}`}
              aria-label={`Slide ${index + 1}`}
            />
          );
        })}
      </div>
    </>
  );
};
