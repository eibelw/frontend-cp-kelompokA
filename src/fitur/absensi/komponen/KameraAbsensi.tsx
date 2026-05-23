import { useRef, useEffect } from 'react';
import { Camera, RotateCcw, AlertCircle } from 'lucide-react';
import { gunakanKamera } from '../hooks/gunakanKamera';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import { Pemuat } from '@/komponen/ui/Pemuat';

interface PropsKameraAbsensi {
  /** Dipanggil saat foto berhasil diambil */
  padaFotoTerambil: (foto: File) => void;
}

/** Komponen kamera selfie untuk absensi masuk */
function KameraAbsensi({ padaFotoTerambil }: PropsKameraAbsensi) {
  const refVideo = useRef<HTMLVideoElement>(null);
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

  /** Menghubungkan stream video ke elemen <video> */
  useEffect(() => {
    if (streamVideo && refVideo.current) {
      refVideo.current.srcObject = streamVideo;
    }
  }, [streamVideo]);

  /** Mengirimkan foto ke komponen induk saat foto berhasil diambil */
  useEffect(() => {
    if (fotoTerambil) {
      padaFotoTerambil(fotoTerambil);
    }
  }, [fotoTerambil, padaFotoTerambil]);

  /** Mengambil foto dari frame video yang sedang aktif */
  function tanganiAmbilFoto() {
    if (refVideo.current) {
      ambilFoto(refVideo.current);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Area kamera */}
      <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-slate-900">
        {/* State: Menunggu - belum mulai kamera */}
        {stateKamera === 'menunggu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
            {/* Ganti dengan ikon kamera dari src/aset/gambar/kamera-icon.svg */}
            <Camera size={48} className="text-slate-400" />
            <p className="text-sm text-slate-400 text-center px-4">
              Tekan tombol di bawah untuk mengaktifkan kamera
            </p>
          </div>
        )}

        {/* State: Memuat - menunggu izin kamera */}
        {stateKamera === 'aktif' && !streamVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Pemuat ukuran="besar" ariaLabel="Mengaktifkan kamera..." />
          </div>
        )}

        {/* State: Kamera aktif - tampilkan preview video */}
        {stateKamera === 'aktif' && (
          <video
            ref={refVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror kamera depan
          />
        )}

        {/* State: Foto diambil - tampilkan pratinjau */}
        {stateKamera === 'diambil' && urlPratinjau && (
          <img
            src={urlPratinjau}
            alt="Foto selfie untuk absensi"
            className="w-full h-full object-cover"
          />
        )}

        {/* State: Error - tampilkan pesan */}
        {stateKamera === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white p-4">
            <AlertCircle size={32} className="text-red-400" />
            <p className="text-sm text-red-400 text-center">{pesanError}</p>
          </div>
        )}

        {/* Indikator foto sudah diambil */}
        {stateKamera === 'diambil' && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Foto OK
          </div>
        )}
      </div>

      {/* Error detail */}
      {stateKamera === 'error' && pesanError && (
        <Peringatan varian="gagal" className="w-full max-w-xs">
          {pesanError}
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
          <Tombol varian="sekunder" onClick={ulangiAmbilFoto} ukuran="sedang">
            <RotateCcw size={16} />
            Ulangi
          </Tombol>
        )}
      </div>
    </div>
  );
}

export default KameraAbsensi;
