import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Award, Users, ArrowRight, MessageCircle } from 'lucide-react';
import styles from './page.module.scss';
import { packageService } from '@/services/packageService';
import { articleService } from '@/services/articleService';
import { ROUTES } from '@/constants/routes';
import { BRAND } from '@/constants/brand';
import { Navbar } from '@/components/common/Navbar/Navbar';
import { Footer } from '@/components/common/Footer/Footer';
import { PackageCard } from '@/components/tour/PackageCard/PackageCard';
import { ArticleCard } from '@/components/article/ArticleCard/ArticleCard';
import { Button } from '@/components/ui/Button/Button';
import { Carousel } from '@/components/ui/Carousel/Carousel';
import { CtaTravelersImage } from '@/components/home/CtaTravelersImage/CtaTravelersImage';

export default async function HomePage() {
  const [packages, articles] = await Promise.all([
    packageService.getAll(),
    articleService.getAll(),
  ]);

  const featuredPackages = packages.slice(0, 6);
  const latestArticles = articles.slice(0, 6);

  const features = [
    {
      icon: <Compass size={38} />,
      title: 'Rute Wisata Eksklusif',
      desc: 'Jalur offroad aliran lahar Semeru, keindahan Bromo, panorama Tumpak Sewu, hingga spot asri Sumber Urip.',
    },
    {
      icon: <ShieldCheck size={38} />,
      title: 'Armada & Driver Handal',
      desc: 'Armada Jeep 4WD tangguh untuk rute lahar dan pengemudi lokal berpengalaman yang mengutamakan keselamatan Anda.',
    },
    {
      icon: <Award size={38} />,
      title: 'Transparansi & Kredibilitas',
      desc: 'Tanpa biaya tersembunyi. Seluruh tiket masuk resmi, izin kawasan, dan armada terjamin aman.',
    },
  ];

  return (
    <>
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Tour & Travels Advanture</span>
            <h1 className={styles.heroTitle}>
              Booking Dulu <span>Healing Kemudian</span> Bersama Edelweiss
            </h1>
            <p className={styles.heroSubtitle}>
              Pengalaman petualangan tak terlupakan menyaksikan Sunrise Bromo, kemegahan Air Terjun Tumpak Sewu, dan kesejukan Sumber Urip bersama tim profesional.
            </p>

            <div className={styles.heroCta}>
              <Link href={ROUTES.PACKAGES}>
                <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />}>
                  Lihat Semua Paket
                </Button>
              </Link>
              <a href={BRAND.SOCIALS.WHATSAPP} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" leftIcon={<MessageCircle size={18} />}>
                  Hubungi WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.whySection}>
          <div className="container">
            <div className={styles.whyWrapper}>
              <div className={styles.whyDesktop}>
                <div className={styles.whyTitleCol}>
                  <h2 className={styles.whyMainTitle}>
                    Mengapa Memilih<br />Edelweiss Tour<br />& Travel?
                  </h2>
                </div>

                {features.map((item, idx) => (
                  <div key={idx} className={styles.whyFeatureItem}>
                    <div className={styles.whyFeatureIcon}>{item.icon}</div>
                    <div className={styles.whyFeatureBody}>
                      <h3 className={styles.whyFeatureTitle}>{item.title}</h3>
                      <p className={styles.whyFeatureDesc}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.whyMobile}>
                <h2 className={styles.whyMobileTitle}>
                  Mengapa Memilih Edelweiss Tour & Travel?
                </h2>
                <div className={styles.whyMobileList}>
                  {features.map((item, idx) => (
                    <div key={idx} className={styles.whyMobileItem}>
                      <div className={styles.whyMobileIcon}>{item.icon}</div>
                      <div className={styles.whyMobileBody}>
                        <h3 className={styles.whyMobileItemTitle}>{item.title}</h3>
                        <p className={styles.whyMobileItemDesc}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`container ${styles.popularSection}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleCol}>
              <span className={styles.sectionTag}>Pilihan Favorit</span>
              <h2 className={styles.sectionTitle}>Paket Tour Terpopuler</h2>
            </div>

            <Link href={ROUTES.PACKAGES}>
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                Lihat Semua Paket
              </Button>
            </Link>
          </div>

          <Carousel autoPlay interval={4000}>
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </Carousel>
        </section>

        <section className={`container ${styles.ctaWrapper}`}>
          <div className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Siap Memacu Adrenalin di <span>Lava Tour Semeru</span>?
              </h2>
              <p className={styles.ctaSubtitle}>
                Konsultasikan jadwal liburan Anda dengan tim kami sekarang dan dapatkan penawaran harga terbaik untuk rombongan maupun private tour!
              </p>

              <div className={styles.ctaAction}>
                <a href={BRAND.SOCIALS.WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="secondary" leftIcon={<MessageCircle size={20} />}>
                    Booking via WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <CtaTravelersImage
              src="/images/cta_travelers.png"
              alt="Petualangan Lava Tour Semeru & Wisata Jawa Timur Bersama Edelweiss"
            />
          </div>
        </section>

        <section className="container section-py">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleCol}>
              <span className={styles.sectionTag}>Edukasi & Cerita Wisata</span>
              <h2 className={styles.sectionTitle}>Artikel & Berita Terbaru</h2>
            </div>

            <Link href={ROUTES.ARTICLES}>
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                Lihat Semua Artikel
              </Button>
            </Link>
          </div>

          <Carousel autoPlay interval={5000}>
            {latestArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </Carousel>
        </section>
      </main>

      <Footer />
    </>
  );
}
