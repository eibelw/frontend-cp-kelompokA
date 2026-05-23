/** Peran pengguna dalam sistem */
export type PeranPengguna = 'admin' | 'pegawai';

/** Jenis kelamin pegawai */
export type JenisKelamin = 'laki-laki' | 'perempuan';

/** Tipe data pengguna dari API */
export interface Pengguna {
  id: string;
  idPegawai: string;
  nama: string;
  email: string;
  peran: PeranPengguna;
  departemen: string | null;
  jabatan: string | null;
  telepon: string | null;
  jenisKelamin: JenisKelamin | null;
  urlFoto: string | null;
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Tipe untuk membuat pengguna baru (admin) */
export interface BuatPengguna {
  idLokasiKantor: string;
  nama: string;
  email: string;
  kataSandi: string;
  peran: PeranPengguna;
  departemen?: string;
  jabatan?: string;
  telepon?: string;
  jenisKelamin?: JenisKelamin;
}

/** Tipe untuk memperbarui data pengguna */
export interface PerbaruiPengguna {
  nama?: string;
  email?: string;
  peran?: PeranPengguna;
  departemen?: string;
  jabatan?: string;
  telepon?: string;
  jenisKelamin?: JenisKelamin;
  aktif?: boolean;
}

/** Tipe untuk filter daftar pegawai (admin) */
export interface FilterPengguna {
  halaman?: number;
  batas?: number;
  cari?: string;
  departemen?: string;
  peran?: PeranPengguna;
}
