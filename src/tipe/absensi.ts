import type { Pengguna } from './pengguna';

/** Status kehadiran */
export type StatusAbsensi = 'hadir' | 'izin' | 'sakit' | 'alpa';

/** Tipe data absensi dari API */
export interface Absensi {
  id: string;
  idPengguna: string;
  tanggal: string;
  waktuMasuk: string;
  waktuKeluar: string | null;
  latMasuk: number;
  lngMasuk: number;
  latKeluar: number | null;
  lngKeluar: number | null;
  urlFoto: string;
  keterlambatan: number;
  status: StatusAbsensi;
  catatan: string | null;
  createdAt: string;
  updatedAt: string;
  pengguna?: Pengguna;
}

/** Tipe untuk request check-in (dikirim sebagai FormData) */
export interface AbsensiMasukBody {
  latitude: number;
  longitude: number;
  foto: File;
}

/** Tipe untuk request check-out */
export interface AbsensiKeluarBody {
  latitude: number;
  longitude: number;
}

/** Tipe untuk filter riwayat absensi */
export interface FilterAbsensi {
  halaman?: number;
  batas?: number;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  status?: StatusAbsensi;
  idPengguna?: string;
}

/** Tipe untuk koreksi absensi oleh admin */
export interface KoreksiAbsensi {
  waktuMasuk?: string;
  waktuKeluar?: string;
  status?: StatusAbsensi;
  catatan?: string;
}

/** Tipe untuk filter ekspor data */
export interface FilterEkspor {
  tanggalMulai: string;
  tanggalSelesai: string;
  idPengguna?: string;
  departemen?: string;
}
