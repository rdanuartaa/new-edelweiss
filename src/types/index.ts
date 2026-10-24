export interface Facility {
  id: number;
  package_detail_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface PackageDetail {
  id: number;
  package_id: number;
  option_name: string;
  price: number;
  duration: string;
  created_at?: string;
  updated_at?: string;
  facilities?: Facility[];
}

export interface Package {
  id: number;
  name: string;
  slug?: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  banner?: string | null;
  poster?: string | null;
  created_at?: string;
  updated_at?: string;
  package_details?: PackageDetail[];
}

export interface Tag {
  id: number;
  nama: string;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  tag_id?: number | null;
  judul: string;
  slug?: string;
  deskripsi: string;
  isi: string;
  gambar?: string | null;
  created_at?: string;
  updated_at?: string;
  tags?: Tag | null;
}

export interface PackageDetailInput {
  id?: number;
  option_name: string;
  price: number;
  duration: string;
  facilities: string[];
}

export interface PackageFormData {
  name: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  banner?: string | null;
  poster?: string | null;
  options: PackageDetailInput[];
}

export interface ArticleFormData {
  judul: string;
  tag_id?: number | null;
  deskripsi: string;
  isi: string;
  gambar?: string | null;
}
