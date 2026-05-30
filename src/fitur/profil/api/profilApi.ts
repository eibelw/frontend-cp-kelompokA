import klienApi from '@/api/klien';
import type { Pengguna, PerbaruiPengguna } from '@/tipe/pengguna';
import type { ResponsApi } from '@/tipe/umum';
import type { UbahKataSandiBody } from '@/tipe/otentikasi';

/** Memperbarui data profil pengguna yang sedang login */
export async function perbaruiProfil(data: PerbaruiPengguna): Promise<Pengguna> {
  const respons = await klienApi.put<ResponsApi<Pengguna>>('/otentikasi/profil', data);
  return respons.data.data;
}

/** Mengubah kata sandi pengguna yang sedang login */
export async function ubahKataSandi(body: UbahKataSandiBody): Promise<void> {
  await klienApi.put('/otentikasi/ubah-kata-sandi', body);
}

/** Mengunggah foto profil pengguna yang sedang login */
export async function unggahFotoProfil(foto: File): Promise<{ urlFoto: string }> {
  const formData = new FormData();
  formData.append('foto', foto);
  const respons = await klienApi.put<ResponsApi<{ urlFoto: string }>>('/otentikasi/profil/foto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return respons.data.data;
}
