import { useState, useEffect, useCallback } from 'react';
import { ambilSemuaIzin, setujuiIzin, tolakIzin } from '../api/adminApi';
import type { Izin, FilterIzin } from '@/tipe/izin';
import { ambilPesanError } from '@/api/klien';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';

/** Hook untuk mengelola pengajuan izin di halaman admin */
export function gunakanManajemenIzin() {
  const [daftarIzin, setDaftarIzin] = useState<Izin[]>([]);
  const [totalHalaman, setTotalHalaman] = useState(1);
  const [total, setTotal] = useState(0);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [filter, setFilter] = useState<FilterIzin>({ halaman: 1, batas: 10 });

  const { sukses, gagal } = gunakanNotifikasi();

  const muatData = useCallback(async (filterBaru: FilterIzin) => {
    setSedangMemuat(true);
    try {
      const data = await ambilSemuaIzin(filterBaru);
      setDaftarIzin(data.baris ?? []);
      setTotal(data.total);
      setTotalHalaman(data.totalHalaman);
    } catch (err) {
      gagal('Gagal memuat data', ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }, [gagal]);

  useEffect(() => {
    muatData(filter);
  }, [filter, muatData]);

  /** Menyetujui pengajuan izin */
  async function tanganiSetujui(id: string): Promise<boolean> {
    try {
      await setujuiIzin(id);
      sukses('Izin disetujui');
      muatData(filter);
      return true;
    } catch (err) {
      gagal('Gagal menyetujui', ambilPesanError(err));
      return false;
    }
  }

  /** Menolak pengajuan izin */
  async function tanganiTolak(id: string): Promise<boolean> {
    try {
      await tolakIzin(id);
      sukses('Izin ditolak');
      muatData(filter);
      return true;
    } catch (err) {
      gagal('Gagal menolak', ambilPesanError(err));
      return false;
    }
  }

  function gantiHalaman(halaman: number) {
    setFilter((prev) => ({ ...prev, halaman }));
  }

  function terapkanFilter(filterBaru: Partial<FilterIzin>) {
    setFilter((prev) => ({ ...prev, ...filterBaru, halaman: 1 }));
  }

  return {
    daftarIzin,
    totalHalaman,
    total,
    sedangMemuat,
    filter,
    gantiHalaman,
    terapkanFilter,
    tanganiSetujui,
    tanganiTolak,
  };
}
