import klienApi from '@/api/klien';
import type { Absensi, FilterAbsensi } from '@/tipe/absensi';
import type { ResponsApi, ResponsPaginasi } from '@/tipe/umum';

/** Melakukan check-in dengan foto (multipart/form-data) dan koordinat GPS */
export async function absenMasuk(latitude: number, longitude: number, foto: File): Promise<Absensi> {
  const formData = new FormData();
  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
  formData.append('foto', foto);

  const respons = await klienApi.post<ResponsApi<Absensi>>('/absensi/masuk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return respons.data.data;
}

/** Melakukan check-out dengan koordinat GPS */
export async function absenKeluar(latitude: number, longitude: number): Promise<Absensi> {
  const respons = await klienApi.put<ResponsApi<Absensi>>('/absensi/keluar', {
    latitude,
    longitude,
  });
  return respons.data.data;
}

/** Mengambil data absensi hari ini */
export async function ambilAbsensiHariIni(): Promise<Absensi | null> {
  const respons = await klienApi.get<ResponsApi<Absensi | null>>('/absensi/hari-ini');
  return respons.data.data;
}

/** Mengambil riwayat absensi dengan filter dan paginasi */
export async function ambilRiwayatAbsensi(filter?: FilterAbsensi): Promise<{
  baris: Absensi[];
  total: number;
  totalHalaman: number;
}> {
  const respons = await klienApi.get('/absensi/riwayat', { params: filter });
  const { data, pagination } = respons.data;
  return {
    baris: (data ?? []) as Absensi[],
    total: pagination?.total ?? 0,
    totalHalaman: pagination?.totalHalaman ?? 1,
  };
}

/** Mengambil detail satu absensi berdasarkan ID */
export async function ambilDetailAbsensi(id: string): Promise<Absensi> {
  const respons = await klienApi.get<ResponsApi<Absensi>>(`/absensi/${id}`);
  return respons.data.data;
}
