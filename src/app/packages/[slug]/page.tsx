'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, CheckCircle, MessageCircle, ArrowLeft, Clock, ImageIcon, FileText } from 'lucide-react';
import styles from './page.module.scss';
import { Package } from '@/types';
import { packageService } from '@/services/packageService';
import { formatRupiah, formatLocation } from '@/utils/format';
import { BRAND } from '@/constants/brand';
import { ROUTES } from '@/constants/routes';
import { Navbar } from '@/components/common/Navbar/Navbar';
import { Footer } from '@/components/common/Footer/Footer';
import { Button } from '@/components/ui/Button/Button';

export default function PackageDetailPage() {
  const params = useParams();
  const slug = (params?.slug || params?.id) as string;
  const [pkg, setPkg] = useState<Package | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeMedia, setActiveMedia] = useState<'banner' | 'poster'>('poster');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPackage = async () => {
      setIsLoading(true);
      const data = await packageService.getBySlugOrId(slug);
      setPkg(data);
      setIsLoading(false);
    };
    fetchPackage();
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container section-py" style={{ textAlign: 'center' }}>
          <p>Memuat detail paket wisata...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!pkg) {
    return (
      <>
        <Navbar />
        <div className="container section-py" style={{ textAlign: 'center' }}>
          <h2>Paket wisata tidak ditemukan.</h2>
          <Link href={ROUTES.PACKAGES} style={{ marginTop: '16px', display: 'inline-block' }}>
            <Button variant="primary">Kembali ke Katalog</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const currentOption = pkg.package_details?.[selectedIndex] ?? {
    option_name: 'Pilihan Standar',
    price: 0,
    duration: '1 Hari',
    facilities: [],
  };

  const whatsappMessage = encodeURIComponent(
    `Halo Admin Edelweiss Tour, saya tertarik untuk memesan:\n\n*Paket:* ${pkg.name}\n*Varian:* ${currentOption.option_name} (${currentOption.duration})\n*Harga:* ${formatRupiah(currentOption.price)}\n\nMohon info ketersediaan slot tanggal dan cara pemesanannya. Terima kasih!`
  );

  const whatsappUrl = `https://wa.me/6281234567890?text=${whatsappMessage}`;

  return (
    <>
      <Navbar />

      <main>
        <section
          className={styles.heroBanner}
          style={{
            backgroundImage: `linear-gradient(rgba(22, 25, 33, 0.75), rgba(22, 25, 33, 0.85)), url('${pkg.banner || '/images/bromo.jpg'}')`,
          }}
        >
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.locationRow}>
              <MapPin size={14} />
              {formatLocation(pkg.location)}
            </span>

            <h1 className={styles.title}>{pkg.name}</h1>

            <div className={styles.heroCta}>
              <Link href={ROUTES.PACKAGES}>
                <Button size="sm" variant="primary" leftIcon={<ArrowLeft size={16} />}>
                  Kembali ke Semua Paket
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className={`container ${styles.layout}`}>
          <div className={styles.mainCol}>
            <div className={styles.mediaSection}>
              <div className={styles.mediaTabs}>
                <button
                  type="button"
                  className={`${styles.mediaTab} ${activeMedia === 'poster' ? styles.activeTab : ''}`}
                  onClick={() => setActiveMedia('poster')}
                >
                  <FileText size={18} />
                  <span>Poster Paket</span>
                </button>
                <button
                  type="button"
                  className={`${styles.mediaTab} ${activeMedia === 'banner' ? styles.activeTab : ''}`}
                  onClick={() => setActiveMedia('banner')}
                >
                  <ImageIcon size={18} />
                  <span>Banner Wisata</span>
                </button>
              </div>

              {activeMedia === 'poster' ? (
                <div className={styles.portraitPosterCard}>
                  <img src={pkg.poster || '/images/poster_bromo.jpg'} alt={`${pkg.name} Poster`} />
                </div>
              ) : (
                <div className={styles.landscapeBannerCard}>
                  <img src={pkg.banner || '/images/bromo.jpg'} alt={`${pkg.name} Banner`} />
                </div>
              )}
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.blockTitle}>Tentang Paket Wisata</h2>
              <p className={styles.descriptionText}>{pkg.description}</p>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.blockTitle}>
                Fasilitas Termasuk ({currentOption.option_name})
              </h2>

              <div className={styles.facilitiesGrid}>
                {currentOption.facilities && currentOption.facilities.length > 0 ? (
                  currentOption.facilities.map((fac) => (
                    <div key={fac.id} className={styles.facilityItem}>
                      <CheckCircle size={18} />
                      <span>{fac.name}</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.facilityItem}>
                    <CheckCircle size={18} />
                    <span>Transportasi, Tiket Masuk, Pemandu Wisata</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside>
            <div className={styles.bookingCard}>
              <div className={styles.priceBox}>
                <span className={styles.priceLabel}>Biaya Per Orang</span>
                <span className={styles.priceAmount}>{formatRupiah(currentOption.price)}</span>
                <span style={{ fontSize: '0.82rem', color: '#5E626B', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} />
                  Durasi: {currentOption.duration}
                </span>
              </div>

              {pkg.package_details && pkg.package_details.length > 1 && (
                <div className={styles.optionsSelector}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E2833' }}>
                    Pilih Paket / Durasi:
                  </label>
                  {pkg.package_details.map((opt, idx) => (
                    <div
                      key={opt.id}
                      className={`${styles.optionRadio} ${selectedIndex === idx ? styles.activeOption : ''}`}
                      onClick={() => setSelectedIndex(idx)}
                    >
                      <div>
                        <div className={styles.optionName}>{opt.option_name}</div>
                        <div className={styles.optionDuration}>{opt.duration}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#F7921E' }}>
                        {formatRupiah(opt.price)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button fullWidth size="lg" variant="secondary" leftIcon={<MessageCircle size={20} />}>
                  Pesan via WhatsApp
                </Button>
              </a>

              <p style={{ fontSize: '0.8rem', color: '#8C93A0', textAlign: 'center' }}>
                Respon cepat 24 jam &bull; Konsultasi itinerary gratis
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
