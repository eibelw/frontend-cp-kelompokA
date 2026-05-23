import type { Pengguna } from './pengguna';

/** Jenis izin yang tersedia */
export type JenisIzin = 'izin' | 'sakit' | 'cuti';

/** Status pengajuan izin */
export type StatusIzin = 'menunggu' | 'disetujui' | 'ditolak';

/** Tipe data izin dari API */
export interface Izin {
  id: string;
  idPengguna: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  status: StatusIzin;
  disetujuiOleh: string | null;
  urlDokumen: string | null;
  createdAt: string;
  updatedAt: string;
  pengguna?: Pengguna;
  penyetuju?: Pengguna;
}

/** Tipe untuk request pengajuan izin (dikirim sebagai FormData) */
export interface AjukanIzinBody {
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  dokumen?: File;
}

/** Tipe untuk filter daftar izin */
export interface FilterIzin {
  halaman?: number;
  batas?: number;
  status?: StatusIzin;
  jenisIzin?: JenisIzin;
  idPengguna?: string;
}
