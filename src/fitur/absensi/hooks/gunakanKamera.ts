import { useState, useRef, useCallback, useEffect } from 'react';

export type StateKamera = 'menunggu' | 'aktif' | 'diambil' | 'error';

interface HasilGunakanKamera {
  stateKamera: StateKamera;
  streamVideo: MediaStream | null;
  fotoTerambil: File | null;
  urlPratinjau: string | null;
  pesanError: string;
  mulaiKamera: () => Promise<void>;
  ambilFoto: (videoEl: HTMLVideoElement) => void;
  ulangiAmbilFoto: () => void;
  hentikanKamera: () => void;
}

/** Hook untuk mengelola akses kamera browser dan pengambilan foto selfie */
export function gunakanKamera(): HasilGunakanKamera {
  const [stateKamera, setStateKamera] = useState<StateKamera>('menunggu');
  const [streamVideo, setStreamVideo] = useState<MediaStream | null>(null);
  const [fotoTerambil, setFotoTerambil] = useState<File | null>(null);
  const [urlPratinjau, setUrlPratinjau] = useState<string | null>(null);
  const [pesanError, setPesanError] = useState('');

  /** Menghentikan kamera dan membersihkan sampah */
  const hentikanKamera = useCallback(() => {
    if (streamVideo) {
      streamVideo.getTracks().forEach((track) => track.stop());
      setStreamVideo(null);
    }
  }, [streamVideo]);

  /** Membersihkan saat komponen tidak terpakai */
  useEffect(() => {
    return () => {
      if (streamVideo) {
        streamVideo.getTracks().forEach((track) => track.stop());
      }
      if (urlPratinjau) {
        URL.revokeObjectURL(urlPratinjau);
      }
    };
  }, [streamVideo, urlPratinjau]);

  /** Meminta izin dan memulai kamera depan */
  const mulaiKamera = useCallback(async () => {
    setPesanError('');
    setStateKamera('menunggu');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Kamera depan (selfie)
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      setStreamVideo(stream);
      setStateKamera('aktif');
    } catch (err) {
      const error = err as Error;
      let pesan = 'Tidak dapat mengakses kamera';

      if (error.name === 'NotAllowedError') {
        pesan = 'Izin kamera ditolak. Mohon izinkan akses kamera di pengaturan browser.';
      } else if (error.name === 'NotFoundError') {
        pesan = 'Kamera tidak ditemukan pada perangkat ini.';
      } else if (error.name === 'NotReadableError') {
        pesan = 'Kamera sedang digunakan aplikasi lain.';
      }

      setPesanError(pesan);
      setStateKamera('error');
    }
  }, []);

  /** Mengambil tangkapan layar menjadi File */
  const ambilFoto = useCallback((videoEl: HTMLVideoElement) => {
    const kanvas = document.createElement('canvas');
    kanvas.width = videoEl.videoWidth;
    kanvas.height = videoEl.videoHeight;

    const konteks = kanvas.getContext('2d');
    if (!konteks) return;

    // Mirror foto karena kamera depan perlu di-flip
    konteks.translate(kanvas.width, 0);
    konteks.scale(-1, 1);
    konteks.drawImage(videoEl, 0, 0, kanvas.width, kanvas.height);

    kanvas.toBlob(
      (blob) => {
        if (!blob) return;

        // Buat URL pratinjau dan File object
        const urlBaru = URL.createObjectURL(blob);
        const namaFile = `selfie-${Date.now()}.jpg`;
        const file = new File([blob], namaFile, { type: 'image/jpeg' });

        setUrlPratinjau(urlBaru);
        setFotoTerambil(file);
        setStateKamera('diambil');

        // Hentikan setelah foto diambil
        if (streamVideo) {
          streamVideo.getTracks().forEach((track) => track.stop());
          setStreamVideo(null);
        }
      },
      'image/jpeg',
      0.85
    );
  }, [streamVideo]);

  /** Mengulang proses pengambilan foto */
  const ulangiAmbilFoto = useCallback(() => {
    if (urlPratinjau) {
      URL.revokeObjectURL(urlPratinjau);
    }
    setUrlPratinjau(null);
    setFotoTerambil(null);
    setStateKamera('menunggu');
    mulaiKamera();
  }, [urlPratinjau, mulaiKamera]);

  return {
    stateKamera,
    streamVideo,
    fotoTerambil,
    urlPratinjau,
    pesanError,
    mulaiKamera,
    ambilFoto,
    ulangiAmbilFoto,
    hentikanKamera,
  };
}
