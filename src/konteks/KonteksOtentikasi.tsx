import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Pengguna } from '@/tipe/pengguna';
import type { StateOtentikasi } from '@/tipe/otentikasi';
import { KUNCI_SIMPAN } from '@/utils/konstanta';
import { bersihkanSesi } from '@/api/klien';

interface KonteksOtentikasiTipe extends StateOtentikasi {
  /** Menyimpan data sesi setelah login berhasil */
  simpanSesi: (token: string, tokenPembaruan: string, pengguna: Pengguna) => void;
  /** Menghapus sesi dan keluar dari sistem */
  keluar: () => void;
  /** Memperbarui data pengguna di state (setelah edit profil) */
  perbaruiPengguna: (pengguna: Pengguna) => void;
}

const KonteksOtentikasi = createContext<KonteksOtentikasiTipe | null>(null);

/** Cek apakah JWT sudah kadaluarsa tanpa perlu request ke server */
function tokenSudahKadaluarsa(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/** Provider untuk state autentikasi global */
export function PenyediaOtentikasi({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StateOtentikasi>({
    pengguna: null,
    token: null,
    tokenPembaruan: null,
    sedangMemuat: true,
    sudahDiotentikasi: false,
  });

  /** Memuat ulang sesi dari localStorage saat aplikasi pertama kali dimuat */
  useEffect(() => {
    const token = localStorage.getItem(KUNCI_SIMPAN.TOKEN);
    const tokenPembaruan = localStorage.getItem(KUNCI_SIMPAN.TOKEN_PEMBARUAN);
    const penggunaTersimpan = localStorage.getItem(KUNCI_SIMPAN.PENGGUNA);

    if (token && tokenPembaruan && penggunaTersimpan) {
      // Jika token sudah kadaluarsa, paksa logout tanpa perlu request ke server
      if (tokenSudahKadaluarsa(token) && tokenSudahKadaluarsa(tokenPembaruan)) {
        bersihkanSesi();
        setState((prev) => ({ ...prev, sedangMemuat: false }));
        return;
      }
      try {
        const pengguna: Pengguna = JSON.parse(penggunaTersimpan);
        setState({
          pengguna,
          token,
          tokenPembaruan,
          sedangMemuat: false,
          sudahDiotentikasi: true,
        });
      } catch {
        // Data tersimpan rusak, bersihkan
        bersihkanSesi();
        setState((prev) => ({ ...prev, sedangMemuat: false }));
      }
    } else {
      setState((prev) => ({ ...prev, sedangMemuat: false }));
    }
  }, []);

  /** Menyimpan token dan data pengguna ke localStorage dan state */
  const simpanSesi = useCallback((token: string, tokenPembaruan: string, pengguna: Pengguna) => {
    localStorage.setItem(KUNCI_SIMPAN.TOKEN, token);
    localStorage.setItem(KUNCI_SIMPAN.TOKEN_PEMBARUAN, tokenPembaruan);
    localStorage.setItem(KUNCI_SIMPAN.PENGGUNA, JSON.stringify(pengguna));

    setState({
      pengguna,
      token,
      tokenPembaruan,
      sedangMemuat: false,
      sudahDiotentikasi: true,
    });
  }, []);

  /** Menghapus semua data sesi */
  const keluar = useCallback(() => {
    bersihkanSesi();
    setState({
      pengguna: null,
      token: null,
      tokenPembaruan: null,
      sedangMemuat: false,
      sudahDiotentikasi: false,
    });
  }, []);

  /** Memperbarui data pengguna di state dan localStorage */
  const perbaruiPengguna = useCallback((pengguna: Pengguna) => {
    localStorage.setItem(KUNCI_SIMPAN.PENGGUNA, JSON.stringify(pengguna));
    setState((prev) => ({ ...prev, pengguna }));
  }, []);

  return (
    <KonteksOtentikasi.Provider value={{ ...state, simpanSesi, keluar, perbaruiPengguna }}>
      {children}
    </KonteksOtentikasi.Provider>
  );
}

/** Hook untuk mengakses state dan aksi autentikasi */
export function gunakanOtentikasi(): KonteksOtentikasiTipe {
  const konteks = useContext(KonteksOtentikasi);
  if (!konteks) {
    throw new Error('gunakanOtentikasi harus dipakai di dalam PenyediaOtentikasi');
  }
  return konteks;
}
