# Project Edelweiss Development & Migration Guidelines (SKILL.md)

Panduan utama pengembangan dan migrasi project Edelweiss dari Laravel ke Next.js (App Router + TypeScript) dan Supabase.

---

## 1. Zero Comments Policy
- Dilarang menulis komentar dalam bentuk apa pun (`//`, `/* */`, `<!-- -->`, `{/* */}`) di seluruh source code file produksi.
- Seluruh kode harus *self-documenting* melalui penamaan fungsi, variabel, props, dan tipe data TypeScript yang jelas dan deskriptif.

## 2. Clean, Concise & Modular Logic
- Hindari *nested if-else* berlapis.
- Terapkan *early returns / guard clauses*, *dictionary/map lookup*, *nullish coalescing (`??`)*, dan *optional chaining (`?.`)*.
- Pisahkan logika dengan tegas:
  - UI Components (`src/components/`): Hanya rendering tampilan dan penanganan event.
  - Services (`src/services/`): Komunikasi API / Supabase query & mutasi.
  - Custom Hooks (`src/hooks/`): State management dan logika aksi interaktif.
  - Utilities (`src/utils/`): Pure helper functions (format rupiah, date, slug, dll).
- Anti hard-code: Semua URL, key, status, kategori, dan konfigurasi diletakkan di `src/constants/` atau environment variables (`.env.local`).

## 3. Styling & Modern Aesthetics (SCSS)
- Menggunakan **SCSS** (Sass Modules, contoh: `[name].module.scss`).
- Gunakan palet warna resmi dari project lama ([project_edelweiss](https://github.com/rdanuartaa/project_edelweiss)):
  - **Primary Green**: `#63AB45` (hover: `#4e8836`)
  - **Accent Orange**: `#F7921E` (hover: `#d87b12`)
  - **Dark Heading/Text**: `#1E2833` & `#161921`
  - **Body Text**: `#5E626B`
  - **Light Background**: `#F4F5F7` & `#FFFFFF`
- Variabel dan mixin SCSS terpusat di `src/styles/`.

## 4. Reusabilitas Komponen (Zero Duplicate Components)
- Bangun komponen modular dan fleksibel (Dynamic Modal, Data Table, Form Input, Card, Button Variants).
- Hindari membuat duplikat komponen untuk perbedaan minor; manfaatkan variant props dan komposisi (*children/slots*).

## 5. Admin Experience (User-Friendly & Streamlined CRUD)
- Antarmuka admin harus ringkas, sangat intuitif, dan terarah tanpa paragraf penjelasan yang bertele-tele.
- **Dynamic Rows**: Penambahan/penghapusan varian durasi, harga, dan fasilitas paket tour cukup dengan tombol `+ Tambah Baris` dan icon hapus responsif.
- **Instant Media Preview**: Drag-and-drop / upload banner atau poster langsung menampilkan gambar pratinjau sebelum disimpan.
- **Feedback Langsung**: Modal konfirmasi sebelum delete data, loading state pada tombol aksi, dan toast alert status.

## 6. Cakupan Fitur Admin
1. **Paket Tour**: Tambah & kelola data paket (`packages`, `package_details`, `facilities`).
2. **Artikel**: Tambah & kelola artikel (`articles`, `tags`).
