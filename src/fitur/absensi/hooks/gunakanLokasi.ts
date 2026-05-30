import { useState, useCallback } from 'react';
import type { KoordinatGPS } from '@/tipe/lokasi';

export type StateLokasi = 'menunggu' | 'memuat' | 'berhasil' | 'error';

interface HasilGunakanLokasi {
  stateLokasi: StateLokasi;
  koordinat: KoordinatGPS | null;
  pesanError: string;
  ambilLokasi: () => Promise<void>;
  resetLokasi: () => void;
}

/** Hook untuk mengambil koordinat GPS dari browser Geolocation API */
export function gunakanLokasi(): HasilGunakanLokasi {
  const [stateLokasi, setStateLokasi] = useState<StateLokasi>('menunggu');
  const [koordinat, setKoordinat] = useState<KoordinatGPS | null>(null);
  const [pesanError, setPesanError] = useState('');

  /** Meminta izin dan mengambil koordinat GPS saat ini */
  const ambilLokasi = useCallback(async () => {
    if (!navigator.geolocation) {
      setPesanError('Browser tidak mendukung GPS/Geolocation');
      setStateLokasi('error');
      return;
    }

    setStateLokasi('memuat');
    setPesanError('');

    return new Promise<void>((selesai) => {
      navigator.geolocation.getCurrentPosition(
        (posisi) => {
          setKoordinat({
            latitude: posisi.coords.latitude,
            longitude: posisi.coords.longitude,
            akurasi: posisi.coords.accuracy,
          });
          setStateLokasi('berhasil');
          selesai();
        },
        (error) => {
          let pesan = 'Tidak dapat mengambil lokasi';

          switch (error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              pesan = 'Izin lokasi ditolak. Mohon izinkan akses lokasi di browser.';
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              pesan = 'Informasi lokasi tidak tersedia saat ini.';
              break;
            case GeolocationPositionError.TIMEOUT:
              pesan = 'Waktu pengambilan lokasi habis. Coba lagi.';
              break;
          }

          setPesanError(pesan);
          setStateLokasi('error');
          selesai();
        },
        {
          enableHighAccuracy: true, // Akurasi tinggi (GPS hardware)
          timeout: 15000,           // Timeout 15 detik
          maximumAge: 30000,        // Cache 30 detik
        }
      );
    });
  }, []);

  /** Mereset state lokasi */
  const resetLokasi = useCallback(() => {
    setStateLokasi('menunggu');
    setKoordinat(null);
    setPesanError('');
  }, []);

  return {
    stateLokasi,
    koordinat,
    pesanError,
    ambilLokasi,
    resetLokasi,
  };
}
