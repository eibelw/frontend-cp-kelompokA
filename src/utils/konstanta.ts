/** Kunci penyimpanan di localStorage */
export const KUNCI_SIMPAN = {
  TOKEN: 'absensi_token',
  TOKEN_PEMBARUAN: 'absensi_token_pembaruan',
  PENGGUNA: 'absensi_pengguna',
} as const;

/** URL dasar API */
export const URL_API = import.meta.env.VITE_API_URL ?? 'https://backend-cp-kelompok-a.vercel.app/api/v1';

/** URL dasar untuk file upload (foto/dokumen) — tidak dipakai sejak migrasi ke Supabase Storage */
export const URL_UPLOAD = '/uploads';

/** Label status absensi dalam bahasa Indonesia */
export const LABEL_STATUS_ABSENSI: Record<string, string> = {
  hadir: 'Hadir',
  izin: 'Izin',
  sakit: 'Sakit',
  alpa: 'Alpa',
  cuti: 'Cuti',
};

/** Label jenis izin dalam bahasa Indonesia */
export const LABEL_JENIS_IZIN: Record<string, string> = {
  izin: 'Izin',
  sakit: 'Sakit',
  cuti: 'Cuti',
};

/** Label status pengajuan izin */
export const LABEL_STATUS_IZIN: Record<string, string> = {
  menunggu: 'Menunggu',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
};

/** Label peran pengguna */
export const LABEL_PERAN: Record<string, string> = {
  admin: 'Admin',
  pegawai: 'Pegawai',
};

/** Jumlah data per halaman default */
export const BATAS_HALAMAN_DEFAULT = 10;

/** Aturan waktu absensi */
export const ATURAN_WAKTU = {
  MASUK_MULAI: '07:00',
  MASUK_SELESAI: '10:00',
  KELUAR_MULAI: '16:00',
} as const;
