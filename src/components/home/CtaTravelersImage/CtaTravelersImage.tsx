'use client';

import React, { useState } from 'react';
import styles from './CtaTravelersImage.module.scss';

interface CtaTravelersImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export const CtaTravelersImage: React.FC<CtaTravelersImageProps> = ({
  src,
  alt,
  className,
  imgClassName,
}) => {
  const [isJumping, setIsJumping] = useState(false);

  const handleClick = () => {
    if (isJumping) return;
    setIsJumping(true);
  };

  const handleAnimationEnd = () => {
    setIsJumping(false);
  };

  const wrapClasses = className ? `${styles.imageWrap} ${className}` : styles.imageWrap;
  const imageClasses = `${styles.image} ${imgClassName || ''} ${isJumping ? styles.jumping : ''}`.trim();

  return (
    <div className={wrapClasses}>
      <img
        src={src}
        alt={alt}
        className={imageClasses}
        onClick={handleClick}
        onAnimationEnd={handleAnimationEnd}
        title="Klik untuk animasi!"
      />
    </div>
  );
};
