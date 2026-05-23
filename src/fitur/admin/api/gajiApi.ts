import klienApi from '@/api/klien';
import type { PengaturanGaji, PengaturanGajiBody, SlipGaji, FilterSlipGaji, JadwalKirimGaji } from '@/tipe/gaji';
import type { ResponsApi } from '@/tipe/umum';

// ===== PENGATURAN GAJI =====

export async function ambilPengaturanGaji(): Promise<PengaturanGaji[]> {
  const respons = await klienApi.get<ResponsApi<PengaturanGaji[]>>('/admin/gaji/pengaturan');
  return respons.data.data;
}

export async function buatPengaturanGaji(data: PengaturanGajiBody): Promise<PengaturanGaji> {
  const respons = await klienApi.post<ResponsApi<PengaturanGaji>>('/admin/gaji/pengaturan', data);
  return respons.data.data;
}

export async function perbaruiPengaturanGaji(id: string, data: Partial<PengaturanGajiBody>): Promise<PengaturanGaji> {
  const respons = await klienApi.put<ResponsApi<PengaturanGaji>>(`/admin/gaji/pengaturan/${id}`, data);
  return respons.data.data;
}

// ===== SLIP GAJI ADMIN =====

export async function generateSlipGaji(bulan: number, tahun: number, idPengguna?: string): Promise<SlipGaji[]> {
  const respons = await klienApi.post<ResponsApi<SlipGaji[]>>('/admin/gaji/slip/generate', { bulan, tahun, idPengguna });
  return respons.data.data;
}

export async function ambilSemuaSlipGaji(filter?: FilterSlipGaji) {
  const respons = await klienApi.get('/admin/gaji/slip', { params: filter });
  const { data, pagination } = respons.data;
  return {
    baris: (data ?? []) as SlipGaji[],
    total: pagination?.total ?? 0,
    totalHalaman: pagination?.totalHalaman ?? 1,
  };
}

export async function ambilSlipGajiPerId(id: string): Promise<SlipGaji> {
  const respons = await klienApi.get<ResponsApi<SlipGaji>>(`/admin/gaji/slip/${id}`);
  return respons.data.data;
}

export async function hapusPengaturanGaji(id: string): Promise<void> {
  await klienApi.delete(`/admin/gaji/pengaturan/${id}`);
}

// ===== JADWAL KIRIM =====

export async function ambilJadwalKirim(): Promise<JadwalKirimGaji | null> {
  const respons = await klienApi.get<ResponsApi<JadwalKirimGaji | null>>('/admin/gaji/jadwal');
  return respons.data.data;
}

export async function simpanJadwalKirim(tanggalKirim: number, aktif: boolean): Promise<JadwalKirimGaji> {
  const respons = await klienApi.post<ResponsApi<JadwalKirimGaji>>('/admin/gaji/jadwal', { tanggalKirim, aktif });
  return respons.data.data;
}

// ===== SLIP GAJI USER =====

export async function ambilSlipGajiSaya(bulan?: number, tahun?: number): Promise<SlipGaji | SlipGaji[]> {
  const respons = await klienApi.get<ResponsApi<SlipGaji | SlipGaji[]>>('/gaji/slip', {
    params: { bulan, tahun },
  });
  return respons.data.data;
}
