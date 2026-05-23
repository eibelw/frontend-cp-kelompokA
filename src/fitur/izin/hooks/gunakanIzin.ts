import { useState, useEffect, useCallback } from 'react';
import { ambilDaftarIzin, batalkanIzin } from '../api/izinApi';
import type { Izin, FilterIzin } from '@/tipe/izin';
import { ambilPesanError } from '@/api/klien';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';

/** Hook untuk mengelola daftar izin pegawai */
export function gunakanDaftarIzin(filterAwal?: FilterIzin) {
  const [daftarIzin, setDaftarIzin] = useState<Izin[]>([]);
  const [totalHalaman, setTotalHalaman] = useState(1);
  const [total, setTotal] = useState(0);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterIzin>({
    halaman: 1,
    batas: 10,
    ...filterAwal,
  });

  const { sukses, gagal } = gunakanNotifikasi();

  /** Mengambil data izin dari API */
  const muatData = useCallback(async (filterBaru: FilterIzin) => {
    setSedangMemuat(true);
    setError('');
    try {
      const { baris, total: jml, totalHalaman: jmlHalaman } = await ambilDaftarIzin(filterBaru);
      setDaftarIzin(baris ?? []);
      setTotal(jml);
      setTotalHalaman(jmlHalaman);
    } catch (err) {
      setError(ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatData(filter);
  }, [filter, muatData]);

  /** Membatalkan izin dan memuat ulang data */
  async function tanganiBetalkan(id: string) {
    try {
      await batalkanIzin(id);
      sukses('Izin dibatalkan', 'Pengajuan izin berhasil dibatalkan.');
      muatData(filter);
    } catch (err) {
      gagal('Gagal membatalkan', ambilPesanError(err));
    }
  }

  function gantiHalaman(halaman: number) {
    setFilter((prev) => ({ ...prev, halaman }));
  }

  function terapkanFilter(filterBaru: Partial<FilterIzin>) {
    setFilter((prev) => ({ ...prev, ...filterBaru, halaman: 1 }));
  }

  function muatUlang() {
    muatData(filter);
  }

  return {
    daftarIzin,
    totalHalaman,
    total,
    sedangMemuat,
    error,
    filter,
    gantiHalaman,
    terapkanFilter,
    tanganiBetalkan,
    muatUlang,
  };
}
