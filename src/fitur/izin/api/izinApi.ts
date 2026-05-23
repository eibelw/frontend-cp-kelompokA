import klienApi from '@/api/klien';
import type { Izin, FilterIzin } from '@/tipe/izin';
import type { ResponsApi } from '@/tipe/umum';

/** Mengajukan permohonan izin atau sakit */
export async function ajukanIzin(
  jenisIzin: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  alasan: string,
  dokumen?: File
): Promise<Izin> {
  const formData = new FormData();
  formData.append('jenisIzin', jenisIzin);
  formData.append('tanggalMulai', tanggalMulai);
  formData.append('tanggalSelesai', tanggalSelesai);
  formData.append('alasan', alasan);
  if (dokumen) formData.append('dokumen', dokumen);

  const respons = await klienApi.post<ResponsApi<Izin>>('/izin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return respons.data.data;
}

/** Mengambil daftar izin milik pengguna yang login dengan filter */
export async function ambilDaftarIzin(filter?: FilterIzin): Promise<{
  baris: Izin[];
  total: number;
  totalHalaman: number;
}> {
  const respons = await klienApi.get('/izin', { params: filter });
  const { data, pagination } = respons.data;
  return {
    baris: (data ?? []) as Izin[],
    total: pagination?.total ?? 0,
    totalHalaman: pagination?.totalHalaman ?? 1,
  };
}

/** Mengambil detail izin berdasarkan ID */
export async function ambilDetailIzin(id: string): Promise<Izin> {
  const respons = await klienApi.get<ResponsApi<Izin>>(`/izin/${id}`);
  return respons.data.data;
}

/** Membatalkan pengajuan izin yang masih berstatus "menunggu" */
export async function batalkanIzin(id: string): Promise<void> {
  await klienApi.delete(`/izin/${id}`);
}
