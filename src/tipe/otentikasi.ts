import type { Pengguna } from './pengguna';

/** Tipe untuk body request login */
export interface MasukBody {
  email: string;
  kataSandi: string;
}

/** Tipe untuk respons login yang berhasil */
export interface ResponsMasuk {
  token: string;
  tokenPembaruan: string;
  pengguna: Pengguna;
}

/** Tipe untuk request perbarui token */
export interface PerbaruiTokenBody {
  tokenPembaruan: string;
}

/** Tipe untuk respons perbarui token */
export interface ResponsPerbaruiToken {
  token: string;
}

/** Tipe untuk request ubah kata sandi */
export interface UbahKataSandiBody {
  kataSandiLama: string;
  kataSandiBaru: string;
}

/** Tipe state autentikasi di context */
export interface StateOtentikasi {
  pengguna: Pengguna | null;
  token: string | null;
  tokenPembaruan: string | null;
  sedangMemuat: boolean;
  sudahDiotentikasi: boolean;
}
