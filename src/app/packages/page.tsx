'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';
import { Package } from '@/types';
import { packageService } from '@/services/packageService';
import { Navbar } from '@/components/common/Navbar/Navbar';
import { Footer } from '@/components/common/Footer/Footer';
import { PackageCard } from '@/components/tour/PackageCard/PackageCard';
import { Input } from '@/components/ui/Input/Input';
import { DropdownSelect } from '@/components/ui/DropdownSelect/DropdownSelect';
import { PageHighlightCard } from '@/components/common/PageHighlightCard/PageHighlightCard';
import { Pagination } from '@/components/common/DashboardPagination/DashboardPagination';

export default function PackagesCatalogPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const catalogSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await packageService.getAll();
      const sorted = [...data].sort((a, b) => b.id - a.id);
      setPackages(sorted);
    };
    loadData();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pageSize = isMobile ? 5 : 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, pageSize]);

  const locations = ['Semua Lokasi', ...Array.from(new Set(packages.map((p) => p.location)))];

  const filtered = packages.filter((pkg) => {
    const matchSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = selectedLocation === 'Semua Lokasi' || pkg.location === selectedLocation;
    return matchSearch && matchLocation;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPackages = filtered.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section className={styles.banner}>
          <div className="container">
            <h1 className={styles.bannerTitle}>Katalog Paket Wisata & Tour</h1>
            <p className={styles.bannerSubtitle}>
              Pusat reservasi Lava Tour Semeru serta destinasi favorit Bromo, Pronojiwo, dan Sumber Urip dengan armada Jeep prima dan harga terbaik.
            </p>
          </div>
        </section>

        <section ref={catalogSectionRef} className="container section-py" style={{ paddingTop: 0 }}>
          <div className={styles.highlightCardWrapper}>
            <PageHighlightCard
              title={
                <>
                  Paket Wisata Unggulan <br />
                  <span>Lava Tour Semeru</span>
                </>
              }
              description="Eksplorasi keseruan offroad menembus jalur lahar dingin Gunung Semeru dengan armada Jeep 4WD tangguh. Kami juga menyediakan paket lengkap ke destinasi populer Jawa Timur lainnya seperti Bromo, Tumpak Sewu, dan Sumber Urip."
              imageSrc="/images/package_jeep.png"
              imageAlt="Armada Jeep 4WD & Wisatawan Edelweiss"
              imageVariant="fleet"
            />
          </div>

          <div className={styles.filterBar}>
            <div className={styles.filterCol}>
              <Input
                placeholder="Cari paket wisata atau kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterLocationCol}>
              <DropdownSelect
                options={locations}
                selectedValue={selectedLocation}
                onChange={setSelectedLocation}
              />
            </div>
          </div>

          <div className={styles.grid}>
            {paginatedPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tidak ada paket wisata yang sesuai dengan pencarian Anda.</p>
            </div>
          ) : (
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              itemLabel="paket wisata"
            />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

