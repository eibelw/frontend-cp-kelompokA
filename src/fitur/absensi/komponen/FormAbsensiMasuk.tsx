import { useState, useCallback, useEffect } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import KameraAbsensi from './KameraAbsensi';
import LokasiGPS from './LokasiGPS';
import { absenMasuk } from '../api/absensiApi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import type { KoordinatGPS } from '@/tipe/lokasi';

/** Jam digital yang update setiap detik */
function JamLive() {
  const [waktu, setWaktu] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setWaktu(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const format = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center justify-center gap-2 py-3 bg-primer-50 dark:bg-primer-900/20 rounded-xl border border-primer-100 dark:border-primer-800">
      <Clock size={16} className="text-primer-600 dark:text-primer-400" />
      <span className="text-2xl font-bold font-mono text-primer-700 dark:text-primer-300 tabular-nums">
        {format(waktu.getHours())}:{format(waktu.getMinutes())}:{format(waktu.getSeconds())}
      </span>
    </div>
  );
}

interface PropsFormAbsensiMasuk {
  terbuka: boolean;
  padaTutup: () => void;
  /** Dipanggil setelah check-in berhasil */
  padaBerhasil: () => void;
}

/** Modal form check-in dengan kamera selfie dan GPS */
function FormAbsensiMasuk({ terbuka, padaTutup, padaBerhasil }: PropsFormAbsensiMasuk) {
  const [foto, setFoto] = useState<File | null>(null);
  const [koordinat, setKoordinat] = useState<KoordinatGPS | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState('');

  const { sukses, gagal } = gunakanNotifikasi();

  /** Menyimpan foto yang diambil dari kamera */
  const tanganiTerimaFoto = useCallback((fileFoto: File) => {
    setFoto(fileFoto);
  }, []);

  /** Menyimpan koordinat GPS yang diambil */
  const tanganiTerimaLokasi = useCallback((koord: KoordinatGPS) => {
    setKoordinat(koord);
  }, []);

  /** Mengirim data check-in ke API */
  async function kirimAbsenMasuk() {
    if (!foto) {
      setPesanError('Mohon ambil foto selfie terlebih dahulu');
      return;
    }
    if (!koordinat) {
      setPesanError('Mohon aktifkan GPS dan ambil lokasi terlebih dahulu');
      return;
    }

    setSedangMemuat(true);
    setPesanError('');

    try {
      await absenMasuk(koordinat.latitude, koordinat.longitude, foto);
      sukses('Absen masuk berhasil!', 'Selamat bekerja hari ini.');
      padaBerhasil();
      tutupDanReset();
    } catch (error) {
      const pesan = ambilPesanError(error);
      setPesanError(pesan);
      gagal('Absen masuk gagal', pesan);
    } finally {
      setSedangMemuat(false);
    }
  }

  /** Reset semua state dan tutup modal */
  function tutupDanReset() {
    setFoto(null);
    setKoordinat(null);
    setPesanError('');
    padaTutup();
  }

  const siapKirim = foto !== null && koordinat !== null;

  return (
    <Modal
      terbuka={terbuka}
      padaTutup={tutupDanReset}
      judul="Absen Masuk"
      deskripsi="Ambil foto selfie dan aktifkan GPS untuk absen masuk"
      ukuran="sedang"
    >
      <div className="space-y-5">
        {/* Jam live */}
        <JamLive />

        {pesanError && (
          <Peringatan varian="gagal">{pesanError}</Peringatan>
        )}

        {/* Step 1: Foto Selfie */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            1. Foto Selfie
          </p>
          <KameraAbsensi padaFotoTerambil={tanganiTerimaFoto} />
        </div>

        {/* Step 2: Lokasi GPS */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            2. Lokasi GPS
          </p>
          <LokasiGPS padaLokasiTerambil={tanganiTerimaLokasi} />
        </div>

        {/* Indikator siap */}
        {siapKirim && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <p className="text-sm text-emerald-700 font-medium">
              Semua data lengkap. Siap absen!
            </p>
          </div>
        )}
      </div>

      <FooterModal>
        <Tombol varian="sekunder" onClick={tutupDanReset} disabled={sedangMemuat}>
          Batal
        </Tombol>
        <Tombol
          onClick={kirimAbsenMasuk}
          disabled={!siapKirim}
          sedangMemuat={sedangMemuat}
        >
          Konfirmasi Absen Masuk
        </Tombol>
      </FooterModal>
    </Modal>
  );
}

export default FormAbsensiMasuk;
