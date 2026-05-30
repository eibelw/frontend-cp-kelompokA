/** Tipe untuk respons API yang berhasil */
export interface ResponsApi<T = unknown> {
  sukses: boolean;
  pesan: string;
  data: T;
}

/** Tipe untuk respons API dengan paginasi */
export interface ResponsPaginasi<T = unknown> {
  sukses: boolean;
  pesan: string;
  data: {
    baris: T[];
    total: number;
    halaman: number;
    batas: number;
    totalHalaman: number;
  };
}

/** Tipe untuk error validasi dari API */
export interface ErrorValidasi {
  bidang: string;
  pesan: string;
}

/** Tipe untuk opsi select/dropdown */
export interface OpsiPilihan {
  nilai: string;
  label: string;
}

/** Tipe parameter filter umum */
export interface FilterUmum {
  halaman?: number;
  batas?: number;
  cari?: string;
}
