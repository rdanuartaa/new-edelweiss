'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  HelpCircle,
  Info,
  Share2,
  MessageCircle,
  ChevronDown,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import styles from './page.module.scss';
import { BRAND } from '@/constants/brand';
import { Navbar } from '@/components/common/Navbar/Navbar';
import { Footer } from '@/components/common/Footer/Footer';
import { Button } from '@/components/ui/Button/Button';
import { CtaTravelersImage } from '@/components/home/CtaTravelersImage/CtaTravelersImage';

type ModalType = 'order' | 'faq' | 'about' | null;

export default function LayananKamiPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'order' || tabParam === 'faq' || tabParam === 'about') {
      setActiveModal(tabParam as ModalType);
    }
  }, []);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${BRAND.NAME} - Layanan Resmi`,
          text: BRAND.DESCRIPTION,
          url: window.location.href,
        });
      } catch {
        return;
      }
    } else if (typeof navigator !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const orderSteps = [
    {
      num: '01',
      title: 'Pilih Paket Wisata',
      desc: 'Pilih paket Lava Tour Semeru, Bromo, Pronojiwo, atau Sumber Urip yang sesuai dengan durasi dan preferensi perjalanan Anda.',
    },
    {
      num: '02',
      title: 'Konsultasi & Cek Slot',
      desc: 'Hubungi admin resmi via WhatsApp untuk konfirmasi ketersediaan armada Jeep 4WD, pemandu, dan tanggal keberangkatan.',
    },
    {
      num: '03',
      title: 'Konfirmasi & Uang Muka (DP)',
      desc: 'Kunci slot armada, tiket masuk kawasan wisata TNBTS resmi, dan penginapan Anda dengan pembayaran DP aman.',
    },
    {
      num: '04',
      title: 'Siap Berpetualang',
      desc: 'Tim pemandu dan driver Jeep siap menjemput Anda di titik kumpul untuk memulai petualangan seru tanpa rasa khawatir.',
    },
  ];

  const faqs = [
    {
      q: 'Apa saja rute petualangan yang dilalui saat Lava Tour Semeru?',
      a: 'Lava Tour Semeru mengajak Anda melintasi jalur offroad aliran lahar dingin Gunung Semeru, bebatuan vulkanik, sungai pegunungan, hingga panorama lanskap megah Semeru dengan armada Jeep 4WD tangguh.',
    },
    {
      q: 'Apakah paket wisata Edelweiss aman untuk keluarga dan anak-anak?',
      a: 'Sangat aman. Kami menyediakan opsi Family Trip dengan ritme santai, armada Jeep 4WD prima, driver berpengalaman, serta rute yang ramah untuk segala usia.',
    },
    {
      q: 'Apa saja perlengkapan yang disarankan untuk dibawa ke Bromo?',
      a: 'Suhu di puncak Bromo berkisar 5-10 derajat Celcius. Kami menyarankan membawa jaket tebal windproof, sarung tangan hangat, kupluk/syal, masker pasir, dan sepatu nyaman.',
    },
    {
      q: 'Apakah biaya tiket masuk kawasan wisata sudah termasuk dalam paket?',
      a: 'Ya, seluruh biaya retribusi resmi Lava Tour Semeru, tiket TNBTS Bromo, Air Terjun Tumpak Sewu, maupun Sumber Urip sudah termasuk di dalam paket tanpa biaya tersembunyi.',
    },
    {
      q: 'Bagaimana prosedur perubahan jadwal (reschedule)?',
      a: 'Perubahan jadwal dapat diajukan selambat-lambatnya 5 hari sebelum hari keberangkatan dengan konfirmasi ke admin WhatsApp kami tanpa biaya penalti selama slot masih tersedia.',
    },
  ];

  const menuItems = [
    {
      id: 'order',
      title: 'Cara Order / Booking',
      tag: 'Panduan',
      tagClass: styles.tagGreen,
      icon: <ShoppingBag size={22} />,
      actionText: 'Buka',
    },
    {
      id: 'faq',
      title: 'Pusat Bantuan & FAQ',
      tag: 'Tanya Jawab',
      tagClass: styles.tagGreen,
      icon: <HelpCircle size={22} />,
      actionText: 'Buka',
    },
    {
      id: 'about',
      title: 'Tentang Kami',
      tag: 'Profil & Armada',
      tagClass: styles.tagGreen,
      icon: <Info size={22} />,
      actionText: 'Lihat',
    },
  ];

  return (
    <>
      <Navbar />

      <main className={styles.pageWrapper}>
        <section className={styles.banner}>
          <div className="container">
            <div className={styles.bannerBadge}>
              <Sparkles size={15} />
              <span>Pusat Layanan & Bantuan Wisata</span>
            </div>
            <h1 className={styles.bannerTitle}>Layanan Kami</h1>
            <p className={styles.bannerSubtitle}>
              Pusat informasi resmi, panduan reservasi Lava Tour Semeru, paket Bromo & Pronojiwo, FAQ, serta profil layanan profesional Edelweiss Tour & Travel.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.cardsStack}>
              <div className={styles.statusCard}>
                <div className={styles.statusCardBody}>
                  <div className={styles.statusHeader}>
                    <h3 className={styles.statusName}>
                      Siap Berpetualang ke <br />
                      <span>Lava Tour Semeru?</span>
                    </h3>
                    <p className={styles.statusRole}>
                      Konsultasikan jadwal liburan Anda dengan tim kami sekarang dan{' '}
                      <br className={styles.desktopBr} />
                      dapatkan penawaran harga terbaik untuk rombongan maupun private tour!
                    </p>
                  </div>

                  <div className={styles.statusActions}>
                    <a href={BRAND.SOCIALS.WHATSAPP} target="_blank" rel="noopener noreferrer" className={styles.btnStatusWa}>
                      <MessageCircle size={18} />
                      <span>Booking via WhatsApp</span>
                    </a>
                    <button type="button" onClick={handleShare} className={styles.btnStatusShare}>
                      <Share2 size={17} />
                      <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
                    </button>
                  </div>
                </div>

                <CtaTravelersImage
                  src="/images/layanan_jeep.png"
                  alt="Layanan Jeep & Petualangan Edelweiss"
                  className={styles.statusTravelerWrap}
                  imgClassName={styles.statusTravelerImg}
                />
              </div>

              <div className={styles.menuCardsGroup}>
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveModal(item.id as ModalType)}
                    className={styles.menuCardItem}
                  >
                    <div className={styles.cardLeft}>
                      <div className={styles.iconCircle}>{item.icon}</div>
                      <div className={styles.cardTextWrap}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <span className={`${styles.cardTag} ${item.tagClass}`}>{item.tag}</span>
                      </div>
                    </div>
                    <div className={styles.cardRight}>
                      <span className={styles.actionText}>
                        {item.actionText}
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {activeModal && (
        <div className={styles.modalBackdrop} onClick={() => setActiveModal(null)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <h3 className={styles.modalTitle}>
                  {activeModal === 'order' && 'Cara Order / Booking'}
                  {activeModal === 'faq' && 'Pusat Bantuan & Pertanyaan Umum (FAQ)'}
                  {activeModal === 'about' && 'Tentang Kami'}
                </h3>
                <p className={styles.modalSubtitle}>
                  {activeModal === 'order' && 'Panduan reservasi paket wisata bersama Edelweiss Tour & Travel'}
                  {activeModal === 'faq' && 'Jawaban cepat atas hal yang sering ditanyakan wisatawan'}
                  {activeModal === 'about' && 'Profil perusahaan, komitmen layanan, dan rekam jejak petualangan'}
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveModal(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {activeModal === 'order' && (
                <div className={styles.stepsGrid}>
                  {orderSteps.map((step) => (
                    <div key={step.num} className={styles.stepCard}>
                      <span className={styles.stepNum}>{step.num}</span>
                      <div className={styles.stepContent}>
                        <h4 className={styles.stepTitle}>{step.title}</h4>
                        <p className={styles.stepDesc}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'faq' && (
                <div>
                  {faqs.map((faq, idx) => (
                    <div key={idx} className={styles.faqItem}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                        className={`${styles.faqBtn} ${openFaqIndex === idx ? styles.faqOpen : ''}`}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={18} />
                      </button>
                      {openFaqIndex === idx && (
                        <div className={styles.faqAnswer}>
                          <p style={{ margin: 0 }}>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'about' && (
                <div className={styles.aboutModalWrap}>
                  <img src="/images/poster_lavatour.jpg" alt="Tentang Kami" className={styles.aboutHeroImg} />
                  <p className={styles.aboutDesc}>
                    {BRAND.NAME} didirikan untuk menghadirkan pengalaman berpetualang yang aman, nyaman, dan berkesan, berpusat pada sensasi offroad Lava Tour Semeru serta destinasi ikonik Jawa Timur lainnya seperti kawasan Gunung Bromo, Air Terjun Tumpak Sewu Pronojiwo, dan keasrian Sumber Urip.
                  </p>
                  <p className={styles.aboutDesc}>
                    Didukung oleh armada Jeep 4WD tangguh serta tim pemandu lokal yang berlisensi, kami berkomitmen menjaga standar keamanan tertinggi dan pelayanan ramah bagi wisatawan domestik maupun mancanegara.
                  </p>

                  <div className={styles.statCardsGrid}>
                    <div className={styles.statCardItem}>
                      <span className={styles.statNumber}>1,500+</span>
                      <span className={styles.statLabel}>Wisatawan Bahagia</span>
                    </div>
                    <div className={styles.statCardItem}>
                      <span className={styles.statNumber}>50+</span>
                      <span className={styles.statLabel}>Trip Setiap Bulan</span>
                    </div>
                    <div className={styles.statCardItem}>
                      <span className={styles.statNumber}>100%</span>
                      <span className={styles.statLabel}>Kepuasan Layanan</span>
                    </div>
                    <div className={styles.statCardItem}>
                      <span className={styles.statNumber}>24/7</span>
                      <span className={styles.statLabel}>Dukungan Pelanggan</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                Tutup
              </Button>
              <a href={BRAND.SOCIALS.WHATSAPP} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" leftIcon={<MessageCircle size={15} />}>
                  Hubungi Admin
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer className={styles.layananFooter} />
    </>
  );
}
