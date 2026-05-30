import klienApi from '@/api/klien';
import type { MasukBody, ResponsMasuk, UbahKataSandiBody } from '@/tipe/otentikasi';
import type { ResponsApi } from '@/tipe/umum';
import type { Pengguna } from '@/tipe/pengguna';

/** Melakukan login dengan email dan kata sandi */
export async function masuk(body: MasukBody): Promise<ResponsMasuk> {
  const respons = await klienApi.post<ResponsApi<ResponsMasuk>>('/otentikasi/masuk', body);
  return respons.data.data;
}

/** Melakukan logout (membersihkan state di sisi client) */
export async function keluar(): Promise<void> {
  await klienApi.post('/otentikasi/keluar');
}

/** Mengambil data profil pengguna yang sedang login */
export async function ambilProfil(): Promise<Pengguna> {
  const respons = await klienApi.get<ResponsApi<Pengguna>>('/otentikasi/profil');
  return respons.data.data;
}

/** Mengubah kata sandi pengguna yang sedang login */
export async function ubahKataSandi(body: UbahKataSandiBody): Promise<void> {
  await klienApi.put('/otentikasi/ubah-kata-sandi', body);
}
