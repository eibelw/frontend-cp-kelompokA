import klienApi from '@/api/klien';
import type { Pengguna, BuatPengguna, PerbaruiPengguna, FilterPengguna } from '@/tipe/pengguna';
import type { Absensi, FilterAbsensi, KoreksiAbsensi, FilterEkspor } from '@/tipe/absensi';
import type { Izin, FilterIzin } from '@/tipe/izin';
import type { LokasiKantor, LokasiKantorBody } from '@/tipe/lokasi';
import type { ResponsApi } from '@/tipe/umum';

// ===== MANAJEMEN PEGAWAI =====

/** Mengambil daftar semua pegawai */
export async function ambilDaftarPegawai(filter?: FilterPengguna) {
  const respons = await klienApi.get('/admin/pengguna', { params: filter });
  const { data, pagination } = respons.data;
  return {
    baris: (data ?? []) as Pengguna[],
    total: pagination?.total ?? 0,
    totalHalaman: pagination?.totalHalaman ?? 1,
  };
}

/** Membuat pegawai baru */
export async function buatPegawai(data: BuatPengguna): Promise<Pengguna> {
  const respons = await klienApi.post<ResponsApi<Pengguna>>('/admin/pengguna', data);
  return respons.data.data;
}

/** Memperbarui data pegawai */
export async function perbaruiPegawai(id: string, data: PerbaruiPengguna): Promise<Pengguna> {
  const respons = await klienApi.put<ResponsApi<Pengguna>>(`/admin/pengguna/${id}`, data);
  return respons.data.data;
}

/** Menonaktifkan akun pegawai */
export async function nonaktifkanPegawai(id: string): Promise<void> {
  await klienApi.delete(`/admin/pengguna/${id}`);
}

/** Mengubah kata sandi pegawai (oleh admin) */
export async function ubahKataSandiPegawai(id: string, kataSandiBaru: string): Promise<void> {
  await klienApi.put(`/admin/pengguna/${id}/kata-sandi`, { kataSandiBaru });
}

/** Menghapus foto profil pegawai (oleh admin) */
export async function hapusFotoPegawai(id: string): Promise<void> {
  await klienApi.delete(`/admin/pengguna/${id}/foto`);
}

/** Mendapatkan prakiraan ID pegawai berikutnya untuk lokasi tertentu */
export async function ambilPrakiraIdPegawai(idLokasi: string): Promise<string> {
  const respons = await klienApi.get<ResponsApi<{ idPegawai: string }>>('/admin/pengguna/id-berikutnya', {
    params: { idLokasi },
  });
  return respons.data.data.idPegawai;
}

// ===== MANAJEMEN ABSENSI =====

/** Mengambil rekap absensi semua pegawai */
export async function ambilRekapAbsensi(filter?: FilterAbsensi) {
  const respons = await klienApi.get('/admin/absensi', { params: filter });
  const { data, pagination } = respons.data;
  return {
    baris: (data ?? []) as Absensi[],
    total: pagination?.total ?? 0,
    totalHalaman: pagination?.totalHalaman ?? 1,
  };
}

/** Mengambil detail satu absensi berdasarkan ID */
export async function ambilDetailAbsensi(id: string): Promise<Absensi> {
  const respons = await klienApi.get<ResponsApi<Absensi>>(`/admin/absensi/${id}`);
  return respons.data.data;
}

/** Mengoreksi data absensi pegawai secara manual */
export async function koreksiAbsensi(id: string, data: KoreksiAbsensi): Promise<Absensi> {
  const respons = await klienApi.put<ResponsApi<Absensi>>(`/admin/absensi/${id}`, data);
  return respons.data.data;
}

// ===== MANAJEMEN IZIN =====

/** Mengambil semua pengajuan izin */
export async function ambilSemuaIzin(filter?: FilterIzin) {
  const respons = await klienApi.get('/admin/izin', { params: filter });
  const { data, pagination } = respons.data;
  return {
    baris: (data ?? []) as Izin[],
    total: pagination?.total ?? 0,
    totalHalaman: pagination?.totalHalaman ?? 1,
  };
}

/** Menyetujui pengajuan izin */
export async function setujuiIzin(id: string): Promise<Izin> {
  const respons = await klienApi.put<ResponsApi<Izin>>(`/admin/izin/${id}/setujui`);
  return respons.data.data;
}

/** Menolak pengajuan izin */
export async function tolakIzin(id: string): Promise<Izin> {
  const respons = await klienApi.put<ResponsApi<Izin>>(`/admin/izin/${id}/tolak`);
  return respons.data.data;
}

// ===== MANAJEMEN LOKASI =====

/** Mengambil semua lokasi kantor */
export async function ambilDaftarLokasi(): Promise<LokasiKantor[]> {
  const respons = await klienApi.get<ResponsApi<LokasiKantor[]>>('/admin/lokasi');
  return respons.data.data;
}

/** Membuat lokasi kantor baru */
export async function buatLokasi(data: LokasiKantorBody): Promise<LokasiKantor> {
  const respons = await klienApi.post<ResponsApi<LokasiKantor>>('/admin/lokasi', data);
  return respons.data.data;
}

/** Memperbarui lokasi kantor */
export async function perbaruiLokasi(id: string, data: Partial<LokasiKantorBody>): Promise<LokasiKantor> {
  const respons = await klienApi.put<ResponsApi<LokasiKantor>>(`/admin/lokasi/${id}`, data);
  return respons.data.data;
}

/** Menghapus lokasi kantor */
export async function hapusLokasi(id: string): Promise<void> {
  await klienApi.delete(`/admin/lokasi/${id}`);
}

// ===== EKSPOR DATA =====

/** Mengunduh rekap absensi sebagai file Excel */
export async function eksporExcel(filter: FilterEkspor): Promise<Blob> {
  const respons = await klienApi.get('/admin/ekspor/excel', {
    params: filter,
    responseType: 'blob',
  });
  return respons.data;
}

/** Mengunduh rekap absensi sebagai file PDF */
export async function eksporPDF(filter: FilterEkspor): Promise<Blob> {
  const respons = await klienApi.get('/admin/ekspor/pdf', {
    params: filter,
    responseType: 'blob',
  });
  return respons.data;
}

/** Memicu unduhan file di browser */
export function unduhFile(blob: Blob, namaFile: string) {
  const url = URL.createObjectURL(blob);
  const tautan = document.createElement('a');
  tautan.href = url;
  tautan.download = namaFile;
  document.body.appendChild(tautan);
  tautan.click();
  document.body.removeChild(tautan);
  URL.revokeObjectURL(url);
}
