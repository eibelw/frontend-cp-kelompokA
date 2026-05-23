import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { KUNCI_SIMPAN, URL_API } from '@/utils/konstanta';

/** Instance Axios utama dengan konfigurasi dasar */
const klienApi: AxiosInstance = axios.create({
  baseURL: URL_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Menambahkan token JWT ke setiap request yang membutuhkan autentikasi */
klienApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(KUNCI_SIMPAN.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Flag untuk mencegah refresh token dipanggil berkali-kali secara bersamaan */
let sedangRefresh = false;
let antrianRefresh: Array<{
  selesai: (nilai: string) => void;
  gagal: (error: unknown) => void;
}> = [];

/** Memproses antrian request yang menunggu token baru */
function prosesAntrianRefresh(error: unknown, token: string | null = null) {
  antrianRefresh.forEach((item) => {
    if (error) {
      item.gagal(error);
    } else if (token) {
      item.selesai(token);
    }
  });
  antrianRefresh = [];
}

/** Menangani response: auto-refresh token jika expired, redirect ke login jika gagal */
klienApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestAsli = error.config as InternalAxiosRequestConfig & { _sudahDicoba?: boolean };

    if (error.response?.status === 401 && !requestAsli._sudahDicoba) {
      // Jangan coba refresh untuk endpoint login/register
      const url = requestAsli.url ?? '';
      if (url.includes('/otentikasi/masuk') || url.includes('/otentikasi/daftar')) {
        return Promise.reject(error);
      }

      if (sedangRefresh) {
        // Masukkan ke antrian untuk menunggu token baru
        return new Promise((selesai, gagal) => {
          antrianRefresh.push({ selesai, gagal });
        }).then((tokenBaru) => {
          requestAsli.headers.Authorization = `Bearer ${tokenBaru}`;
          return klienApi(requestAsli);
        });
      }

      requestAsli._sudahDicoba = true;
      sedangRefresh = true;

      const tokenPembaruan = localStorage.getItem(KUNCI_SIMPAN.TOKEN_PEMBARUAN);

      if (!tokenPembaruan) {
        // Tidak ada refresh token, paksa logout
        bersihkanSesi();
        window.location.href = '/masuk';
        return Promise.reject(error);
      }

      try {
        const respons = await axios.post(`${URL_API}/otentikasi/perbarui-token`, {
          tokenPembaruan,
        });

        const tokenBaru = respons.data.data.token;
        localStorage.setItem(KUNCI_SIMPAN.TOKEN, tokenBaru);

        prosesAntrianRefresh(null, tokenBaru);
        requestAsli.headers.Authorization = `Bearer ${tokenBaru}`;
        return klienApi(requestAsli);
      } catch (errorRefresh) {
        prosesAntrianRefresh(errorRefresh, null);
        bersihkanSesi();
        window.location.href = '/masuk';
        return Promise.reject(errorRefresh);
      } finally {
        sedangRefresh = false;
      }
    }

    return Promise.reject(error);
  }
);

/** Menghapus semua data sesi dari localStorage */
export function bersihkanSesi() {
  localStorage.removeItem(KUNCI_SIMPAN.TOKEN);
  localStorage.removeItem(KUNCI_SIMPAN.TOKEN_PEMBARUAN);
  localStorage.removeItem(KUNCI_SIMPAN.PENGGUNA);
}

/** Mengambil pesan error dari respons API atau dari instance Error */
export function ambilPesanError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { pesan?: string; message?: string } | undefined;
    return data?.pesan ?? data?.message ?? error.message ?? 'Terjadi kesalahan tidak diketahui';
  }
  if (error instanceof Error) return error.message;
  return 'Terjadi kesalahan tidak diketahui';
}

export default klienApi;
