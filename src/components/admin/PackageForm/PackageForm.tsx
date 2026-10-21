'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, X } from 'lucide-react';
import styles from './PackageForm.module.scss';
import { Package, PackageFormData, PackageDetailInput } from '@/types';
import { ROUTES } from '@/constants/routes';
import { packageService } from '@/services/packageService';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { ImageUpload } from '@/components/ui/ImageUpload/ImageUpload';

interface PackageFormProps {
  initialData?: Package;
  isEdit?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PackageForm: React.FC<PackageFormProps> = ({
  initialData,
  isEdit = false,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<PackageFormData>({
    name: initialData?.name ?? '',
    location: initialData?.location ?? '',
    description: initialData?.description ?? '',
    latitude: initialData?.latitude ?? null,
    longitude: initialData?.longitude ?? null,
    banner: initialData?.banner ?? '',
    poster: initialData?.poster ?? '',
    options: initialData?.package_details?.map((detail) => ({
      id: detail.id,
      option_name: detail.option_name,
      price: detail.price,
      duration: detail.duration,
      facilities: detail.facilities?.map((f) => f.name) ?? [],
    })) ?? [
      {
        option_name: 'Paket Reguler',
        price: 350000,
        duration: '1 Hari',
        facilities: ['Transportasi AC', 'Tiket Masuk', 'Air Mineral'],
      },
    ],
  });

  const [newFacilityInputs, setNewFacilityInputs] = useState<Record<number, string>>({});

  const handleTextChange = (field: keyof PackageFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, field: keyof PackageDetailInput, value: unknown) => {
    setFormData((prev) => {
      const updated = [...prev.options];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, options: updated };
    });
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          option_name: 'Pilihan Baru',
          price: 250000,
          duration: '1 Hari',
          facilities: ['Pemandu Wisata', 'Tiket Masuk'],
        },
      ],
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddFacility = (optionIndex: number) => {
    const text = newFacilityInputs[optionIndex]?.trim();
    if (!text) return;

    setFormData((prev) => {
      const updated = [...prev.options];
      const facilities = [...(updated[optionIndex].facilities || []), text];
      updated[optionIndex] = { ...updated[optionIndex], facilities };
      return { ...prev, options: updated };
    });

    setNewFacilityInputs((prev) => ({ ...prev, [optionIndex]: '' }));
  };

  const handleRemoveFacility = (optionIndex: number, facilityIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.options];
      const facilities = updated[optionIndex].facilities.filter((_, idx) => idx !== facilityIndex);
      updated[optionIndex] = { ...updated[optionIndex], facilities };
      return { ...prev, options: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) {
      setErrorMessage('Harap isi Nama Paket dan Lokasi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const res = isEdit && initialData
      ? await packageService.update(initialData.id, formData)
      : await packageService.create(formData);

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Gagal menyimpan paket tour.');
      return;
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(ROUTES.ADMIN.PACKAGES);
      router.refresh();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errorMessage && (
        <div style={{ padding: '12px 16px', background: '#FEE2E2', color: '#DC2626', borderRadius: '8px' }}>
          {errorMessage}
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>1. Informasi Paket Tour</h2>
        <div className={styles.row2}>
          <Input
            label="Nama Paket Tour"
            value={formData.name}
            onChange={(e) => handleTextChange('name', e.target.value)}
            placeholder="Contoh: Paket Wisata Bromo Sunrise"
            required
          />
          <Input
            label="Lokasi Destinasi"
            value={formData.location}
            onChange={(e) => handleTextChange('location', e.target.value)}
            placeholder="Contoh: Gunung Bromo, Jawa Timur"
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>
            Deskripsi Paket
          </label>
          <textarea
            className={styles.textareaControl}
            value={formData.description}
            onChange={(e) => handleTextChange('description', e.target.value)}
            placeholder="Jelaskan daya tarik, rencana perjalanan, dan keistimewaan paket..."
            rows={4}
            required
          />
        </div>

        <div className={styles.row2}>
          <Input
            label="Latitude (Opsional)"
            type="number"
            step="any"
            value={formData.latitude ?? ''}
            onChange={(e) => handleTextChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="-7.9424936"
          />
          <Input
            label="Longitude (Opsional)"
            type="number"
            step="any"
            value={formData.longitude ?? ''}
            onChange={(e) => handleTextChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="112.9530124"
          />
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>2. Media & Foto Paket</h2>
        <div className={styles.row2}>
          <ImageUpload
            label="Banner Landscape (16:9 / Foto Kartu & Banner)"
            value={formData.banner}
            onChange={(url) => handleTextChange('banner', url)}
            folder="tour/banner"
            aspectRatio="landscape"
            required
          />
          <ImageUpload
            label="Poster Portrait (Brosur & Detail Paket)"
            value={formData.poster}
            onChange={(url) => handleTextChange('poster', url)}
            folder="tour/poster"
            aspectRatio="portrait"
            required
          />
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.cardTitle} style={{ borderBottom: 'none', paddingBottom: 0 }}>
            3. Pilihan Varian, Harga & Fasilitas
          </h2>
          <Button type="button" size="sm" variant="outline" leftIcon={<Plus size={16} />} onClick={handleAddOption}>
            Tambah Pilihan
          </Button>
        </div>

        {formData.options.map((option, optIdx) => (
          <div key={optIdx} className={styles.optionItem}>
            <div className={styles.optionHeader}>
              <span className={styles.optionTitle}>Pilihan #{optIdx + 1}</span>
              {formData.options.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(optIdx)}
                  style={{ color: '#EF4444', background: 'none' }}
                  title="Hapus pilihan ini"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className={styles.row3}>
              <Input
                label="Nama Varian / Trip"
                value={option.option_name}
                onChange={(e) => handleOptionChange(optIdx, 'option_name', e.target.value)}
                placeholder="Contoh: One Day Trip Sunrise"
                required
              />
              <Input
                label="Harga (Rp)"
                type="number"
                value={option.price}
                onChange={(e) => handleOptionChange(optIdx, 'price', parseInt(e.target.value, 10) || 0)}
                placeholder="350000"
                required
              />
              <Input
                label="Durasi"
                value={option.duration}
                onChange={(e) => handleOptionChange(optIdx, 'duration', e.target.value)}
                placeholder="1 Hari"
                required
              />
            </div>

            <div className={styles.facilitiesWrapper}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Fasilitas Termasuk:</label>
              <div className={styles.facilitiesList}>
                {option.facilities?.map((fac, facIdx) => (
                  <span key={facIdx} className={styles.facilityChip}>
                    <span>{fac}</span>
                    <button type="button" onClick={() => handleRemoveFacility(optIdx, facIdx)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className={styles.addFacilityRow}>
                <input
                  type="text"
                  placeholder="Ketik fasilitas (contoh: Tiket Masuk) lalu tekan Tambah..."
                  value={newFacilityInputs[optIdx] ?? ''}
                  onChange={(e) => setNewFacilityInputs((prev) => ({ ...prev, [optIdx]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFacility(optIdx);
                    }
                  }}
                  className={styles.textareaControl}
                  style={{ minHeight: '38px', padding: '6px 12px' }}
                />
                <Button type="button" size="sm" variant="secondary" onClick={() => handleAddFacility(optIdx)}>
                  Tambah
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actionBar}>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              router.push(ROUTES.ADMIN.PACKAGES);
            }
          }}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEdit ? 'Simpan Perubahan' : 'Terbitkan Paket Tour'}
        </Button>
      </div>
    </form>
  );
};
