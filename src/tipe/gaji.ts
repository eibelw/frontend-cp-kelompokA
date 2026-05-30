import type { Pengguna } from './pengguna';

/** Pengaturan gaji (global atau per-pegawai) */
export interface PengaturanGaji {
  id: string;
  idPengguna: string | null;
  gajiPokok: number;
  tunjanganKehadiran: number;
  potonganPerJamTerlambat: number;
  potonganPerHariCuti: number;
  berlakuMulai: string;
  aktif: boolean;
  dibuatOleh?: string | null;
  createdAt: string;
  updatedAt: string;
  pegawai?: { id: string; idPegawai: string; nama: string } | null;
}

export interface PengaturanGajiBody {
  idPengguna?: string | null;
  gajiPokok: number;
  tunjanganKehadiran?: number;
  potonganPerJamTerlambat?: number;
  potonganPerHariCuti?: number;
  berlakuMulai: string;
  aktif?: boolean;
}

export interface JadwalKirimGaji {
  id: string;
  tanggalKirim: number;
  aktif: boolean;
}

/** Slip gaji bulanan */
export interface SlipGaji {
  id: string;
  idPengguna: string;
  bulan: number;
  tahun: number;
  gajiPokok: number;
  tunjanganKehadiran: number;
  totalPotonganKeterlambatan: number;
  totalPotonganCuti: number;
  totalGaji: number;
  jumlahHadir: number;
  totalMenitTerlambat: number;
  jumlahHariCuti: number;
  status: 'draft' | 'final';
  dibuatOleh?: string | null;
  createdAt: string;
  updatedAt: string;
  pengguna?: Pengguna;
}

export interface FilterSlipGaji {
  halaman?: number;
  batas?: number;
  bulan?: number;
  tahun?: number;
  idPengguna?: string;
  status?: 'draft' | 'final';
}

export const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
