import { useState, useEffect, useCallback } from 'react';
import { ambilDaftarLokasi, buatLokasi, perbaruiLokasi, hapusLokasi } from '../api/adminApi';
import type { LokasiKantor, LokasiKantorBody } from '@/tipe/lokasi';
import { ambilPesanError } from '@/api/klien';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';

/** Hook untuk mengelola lokasi kantor */
export function gunakanManajemenLokasi() {
  const [daftarLokasi, setDaftarLokasi] = useState<LokasiKantor[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const { sukses, gagal } = gunakanNotifikasi();

  const muatData = useCallback(async () => {
    setSedangMemuat(true);
    try {
      const data = await ambilDaftarLokasi();
      setDaftarLokasi(
        data.map((item) => ({
          ...item,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          radius: Number(item.radius),
        })),
      );;
    } catch (err) {
      gagal('Gagal memuat lokasi', ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }, [gagal]);

  useEffect(() => { muatData(); }, [muatData]);

  async function tanganibuatLokasi(data: LokasiKantorBody): Promise<boolean> {
    await buatLokasi(data);
    sukses('Lokasi berhasil ditambahkan');
    muatData();
    return true;
  }

  async function tanganiPerbaruiLokasi(id: string, data: Partial<LokasiKantorBody>): Promise<boolean> {
    await perbaruiLokasi(id, data);
    sukses('Lokasi berhasil diperbarui');
    muatData();
    return true;
  }

  async function tanganiHapusLokasi(id: string): Promise<boolean> {
    try {
      await hapusLokasi(id);
      sukses('Lokasi berhasil dihapus');
      muatData();
      return true;
    } catch (err) {
      gagal('Gagal menghapus lokasi', ambilPesanError(err));
      return false;
    }
  }

  return {
    daftarLokasi,
    sedangMemuat,
    muatData,
    tanganibuatLokasi,
    tanganiPerbaruiLokasi,
    tanganiHapusLokasi,
  };
}
