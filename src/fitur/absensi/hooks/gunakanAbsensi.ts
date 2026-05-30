import { useState, useEffect, useCallback } from 'react';
import { ambilAbsensiHariIni, ambilRiwayatAbsensi } from '../api/absensiApi';
import type { Absensi, FilterAbsensi } from '@/tipe/absensi';
import { ambilPesanError } from '@/api/klien';

/** Hook untuk mengambil data absensi hari ini */
export function gunakanAbsensiHariIni() {
  const [absensiHariIni, setAbsensiHariIni] = useState<Absensi | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [error, setError] = useState('');

  /** Mengambil data absensi hari ini dari API */
  const muatUlang = useCallback(async () => {
    setSedangMemuat(true);
    setError('');
    try {
      const data = await ambilAbsensiHariIni();
      setAbsensiHariIni(data);
    } catch (err) {
      setError(ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatUlang();
  }, [muatUlang]);

  return { absensiHariIni, sedangMemuat, error, muatUlang };
}

/** Hook untuk mengambil riwayat absensi dengan filter dan paginasi */
export function gunakanRiwayatAbsensi(filterAwal?: FilterAbsensi) {
  const [daftarAbsensi, setDaftarAbsensi] = useState<Absensi[]>([]);
  const [totalHalaman, setTotalHalaman] = useState(1);
  const [total, setTotal] = useState(0);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterAbsensi>({
    halaman: 1,
    batas: 10,
    ...filterAwal,
  });

  /** Mengambil data riwayat absensi dari API */
  const muatData = useCallback(async (filterBaru: FilterAbsensi) => {
    setSedangMemuat(true);
    setError('');
    try {
      const { baris, total: jml, totalHalaman: jmlHalaman } = await ambilRiwayatAbsensi(filterBaru);
      setDaftarAbsensi(baris ?? []);
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

  /** Mengubah halaman aktif */
  function gantiHalaman(halaman: number) {
    setFilter((prev) => ({ ...prev, halaman }));
  }

  /** Menerapkan filter baru dan kembali ke halaman 1 */
  function terapkanFilter(filterBaru: Partial<FilterAbsensi>) {
    setFilter((prev) => ({ ...prev, ...filterBaru, halaman: 1 }));
  }

  return {
    daftarAbsensi,
    totalHalaman,
    total,
    sedangMemuat,
    error,
    filter,
    gantiHalaman,
    terapkanFilter,
  };
}
