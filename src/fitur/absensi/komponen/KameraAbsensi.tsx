import { useRef, useEffect, useState } from 'react';
import { Camera, RotateCcw, AlertCircle, CheckCircle2, UserX, Loader2 } from 'lucide-react';
import { gunakanKamera } from '../hooks/gunakanKamera';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import { Pemuat } from '@/komponen/ui/Pemuat';

type StatusWajah = 'memeriksa' | 'terdeteksi' | 'tidak_terdeteksi' | null;

interface PropsKameraAbsensi {
  /** Dipanggil hanya jika foto diambil DAN wajah terdeteksi */
  padaFotoTerambil: (foto: File) => void;
}

/** Komponen kamera selfie untuk absensi masuk dengan validasi wajah */
function KameraAbsensi({ padaFotoTerambil }: PropsKameraAbsensi) {
  const refVideo = useRef<HTMLVideoElement>(null);
  const [statusWajah, setStatusWajah] = useState<StatusWajah>(null);

  const {
    stateKamera,
    streamVideo,
    fotoTerambil,
    urlPratinjau,
    pesanError,
    mulaiKamera,
    ambilFoto,
    ulangiAmbilFoto,
  } = gunakanKamera();

  useEffect(() => {
    if (streamVideo && refVideo.current) {
      refVideo.current.srcObject = streamVideo;
    }
  }, [streamVideo]);

  /** Deteksi wajah setelah foto diambil */
  useEffect(() => {
    if (!fotoTerambil) {
      setStatusWajah(null);
      return;
    }

    async function deteksiWajah() {
      setStatusWajah('memeriksa');

      // Jika browser tidak support FaceDetector, langsung loloskan
      if (!('FaceDetector' in window)) {
        setStatusWajah('terdeteksi');
        padaFotoTerambil(fotoTerambil!);
        return;
      }

      try {
        const bitmap = await createImageBitmap(fotoTerambil!);
        const detector = new (window as any).FaceDetector({ fastMode: true });
        const faces: unknown[] = await detector.detect(bitmap);

        if (faces.length > 0) {
          setStatusWajah('terdeteksi');
          padaFotoTerambil(fotoTerambil!);
        } else {
          setStatusWajah('tidak_terdeteksi');
          // Tidak memanggil padaFotoTerambil → tombol kirim tetap disabled
        }
      } catch {
        // Jika deteksi error, loloskan (graceful degradation)
        setStatusWajah('terdeteksi');
        padaFotoTerambil(fotoTerambil!);
      }
    }

    deteksiWajah();
  }, [fotoTerambil, padaFotoTerambil]);

  function tanganiAmbilFoto() {
    if (refVideo.current) {
      ambilFoto(refVideo.current);
    }
  }

  function tanganiUlangi() {
    setStatusWajah(null);
    ulangiAmbilFoto();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Area kamera */}
      <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-slate-900">

        {stateKamera === 'menunggu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
            <Camera size={48} className="text-slate-400" />
            <p className="text-sm text-slate-400 text-center px-4">
              Tekan tombol di bawah untuk mengaktifkan kamera
            </p>
          </div>
        )}

        {stateKamera === 'aktif' && !streamVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Pemuat ukuran="besar" ariaLabel="Mengaktifkan kamera..." />
          </div>
        )}

        {stateKamera === 'aktif' && (
          <video
            ref={refVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}

        {stateKamera === 'diambil' && urlPratinjau && (
          <img
            src={urlPratinjau}
            alt="Foto selfie untuk absensi"
            className="w-full h-full object-cover"
          />
        )}

        {stateKamera === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white p-4">
            <AlertCircle size={32} className="text-red-400" />
            <p className="text-sm text-red-400 text-center">{pesanError}</p>
          </div>
        )}

        {/* Badge status wajah */}
        {stateKamera === 'diambil' && statusWajah === 'memeriksa' && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <Loader2 size={11} className="animate-spin" />
            Memeriksa...
          </div>
        )}
        {stateKamera === 'diambil' && statusWajah === 'terdeteksi' && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <CheckCircle2 size={11} />
            Wajah OK
          </div>
        )}
        {stateKamera === 'diambil' && statusWajah === 'tidak_terdeteksi' && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <UserX size={11} />
            Wajah tidak terdeteksi
          </div>
        )}
      </div>

      {/* Error kamera */}
      {stateKamera === 'error' && pesanError && (
        <Peringatan varian="gagal" className="w-full max-w-xs">
          {pesanError}
        </Peringatan>
      )}

      {/* Peringatan wajah tidak terdeteksi */}
      {statusWajah === 'tidak_terdeteksi' && (
        <Peringatan varian="gagal" className="w-full max-w-xs">
          Wajah tidak terdeteksi. Pastikan wajah terlihat jelas, pencahayaan cukup, lalu ulangi foto.
        </Peringatan>
      )}

      {/* Tombol aksi */}
      <div className="flex gap-3">
        {(stateKamera === 'menunggu' || stateKamera === 'error') && (
          <Tombol onClick={mulaiKamera} ukuran="sedang">
            <Camera size={16} />
            Aktifkan Kamera
          </Tombol>
        )}

        {stateKamera === 'aktif' && (
          <Tombol onClick={tanganiAmbilFoto} ukuran="besar">
            <Camera size={18} />
            Ambil Foto
          </Tombol>
        )}

        {stateKamera === 'diambil' && (
          <Tombol
            varian="sekunder"
            onClick={tanganiUlangi}
            ukuran="sedang"
            disabled={statusWajah === 'memeriksa'}
          >
            <RotateCcw size={16} />
            Ulangi
          </Tombol>
        )}
      </div>
    </div>
  );
}

export default KameraAbsensi;
