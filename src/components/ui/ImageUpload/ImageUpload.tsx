'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Trash2, Image as ImageIcon } from 'lucide-react';
import styles from './ImageUpload.module.scss';
import { storageService } from '@/services/storageService';

interface ImageUploadProps {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  bucket?: string;
  required?: boolean;
  presets?: { label: string; url: string }[];
  aspectRatio?: 'landscape' | 'portrait';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  folder,
  bucket = 'tour-media',
  required = false,
  presets = [],
  aspectRatio = 'landscape',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setIsUploading(true);
    try {
      const targetFolder = folder || (bucket === 'article-media' ? 'artikel' : 'tour/banner');
      const uploadedUrl = await storageService.uploadMedia(file, targetFolder);
      onChange(uploadedUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      {value ? (
        <div
          className={`${styles.previewContainer} ${aspectRatio === 'portrait' ? styles.portraitPreview : ''} ${isDragging ? styles.dragActive : ''}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img
            src={value}
            alt={label}
            className={`${styles.previewImage} ${aspectRatio === 'portrait' ? styles.portraitImage : ''}`}
          />
          {isDragging && (
            <div className={styles.dragOverlay}>
              <UploadCloud size={28} />
              <span>Lepas untuk mengganti gambar</span>
            </div>
          )}
          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleRemove}
              title="Hapus gambar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${aspectRatio === 'portrait' ? styles.portraitDropzone : ''} ${isDragging ? styles.dragActive : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={styles.iconWrapper}>
            {isUploading ? <UploadCloud className={styles.spinner} size={22} /> : <UploadCloud size={22} />}
          </div>
          <p className={styles.promptText}>
            {isUploading ? 'Mengunggah gambar...' : isDragging ? 'Lepaskan gambar di sini' : 'Klik untuk unggah atau seret gambar ke sini'}
          </p>
          <span className={styles.subText}>JPG, PNG, atau WebP (Maks. 5MB)</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      {presets.length > 0 && (
        <div className={styles.presetContainer}>
          <span className={styles.presetTitle}>Atau pilih gambar bawaan:</span>
          <div className={styles.presetList}>
            {presets.map((preset) => (
              <button
                key={preset.url}
                type="button"
                className={`${styles.presetThumb} ${aspectRatio === 'portrait' ? styles.portraitThumb : ''} ${value === preset.url ? styles.active : ''}`}
                onClick={() => onChange(preset.url)}
                title={preset.label}
              >
                <img src={preset.url} alt={preset.label} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
