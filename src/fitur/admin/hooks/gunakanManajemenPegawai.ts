import { useState, useEffect, useCallback } from 'react';
import { ambilDaftarPegawai, buatPegawai, perbaruiPegawai, nonaktifkanPegawai } from '../api/adminApi';
import type { Pengguna, BuatPengguna, PerbaruiPengguna, FilterPengguna } from '@/tipe/pengguna';
import { ambilPesanError } from '@/api/klien';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { gunakanDebounce } from '@/hooks/gunakanDebounce';

/** Hook untuk mengelola data pegawai di halaman admin */
export function gunakanManajemenPegawai() {
  const [daftarPegawai, setDaftarPegawai] = useState<Pengguna[]>([]);
  const [totalHalaman, setTotalHalaman] = useState(1);
  const [total, setTotal] = useState(0);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pencarianTeks, setPencarianTeks] = useState('');
  const [filter, setFilter] = useState<FilterPengguna>({ halaman: 1, batas: 10 });

  const { sukses, gagal } = gunakanNotifikasi();
  const pencarianTertunda = gunakanDebounce(pencarianTeks, 400);

  /** Mengambil data pegawai dari API */
  const muatData = useCallback(async (filterBaru: FilterPengguna) => {
    setSedangMemuat(true);
    try {
      const data = await ambilDaftarPegawai(filterBaru);
      setDaftarPegawai(data.baris ?? []);
      setTotal(data.total);
      setTotalHalaman(data.totalHalaman);
    } catch (err) {
      gagal('Gagal memuat data', ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }, [gagal]);

  /** Memuat ulang saat filter atau pencarian berubah */
  useEffect(() => {
    muatData({ ...filter, cari: pencarianTertunda || undefined });
  }, [filter, pencarianTertunda, muatData]);

  /** Membuat pegawai baru */
  async function tanganibuatPegawai(data: BuatPengguna): Promise<boolean> {
    await buatPegawai(data);
    sukses('Pegawai berhasil dibuat');
    muatData({ ...filter, cari: pencarianTertunda || undefined });
    return true;
  }

  /** Memperbarui data pegawai */
  async function tanganiPerbaruiPegawai(id: string, data: PerbaruiPengguna): Promise<boolean> {
    await perbaruiPegawai(id, data);
    sukses('Data pegawai berhasil diperbarui');
    muatData({ ...filter, cari: pencarianTertunda || undefined });
    return true;
  }

  /** Menonaktifkan akun pegawai */
  async function tanganiNonaktifkan(id: string): Promise<boolean> {
    try {
      await nonaktifkanPegawai(id);
      sukses('Akun pegawai dinonaktifkan');
      muatData({ ...filter, cari: pencarianTertunda || undefined });
      return true;
    } catch (err) {
      gagal('Gagal menonaktifkan', ambilPesanError(err));
      return false;
    }
  }

  function gantiHalaman(halaman: number) {
    setFilter((prev) => ({ ...prev, halaman }));
  }

  return {
    daftarPegawai,
    totalHalaman,
    total,
    sedangMemuat,
    pencarianTeks,
    filter,
    setPencarianTeks,
    gantiHalaman,
    tanganibuatPegawai,
    tanganiPerbaruiPegawai,
    tanganiNonaktifkan,
    muatData,
  };
}
