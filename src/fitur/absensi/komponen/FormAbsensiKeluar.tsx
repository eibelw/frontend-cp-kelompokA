import { useState, useCallback, useEffect } from 'react';
import { LogOut, MapPin, Clock } from 'lucide-react';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import LokasiGPS from './LokasiGPS';
import { absenKeluar } from '../api/absensiApi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import type { KoordinatGPS } from '@/tipe/lokasi';

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

interface PropsFormAbsensiKeluar {
  terbuka: boolean;
  padaTutup: () => void;
  /** Dipanggil setelah check-out berhasil */
  padaBerhasil: () => void;
}

/** Modal form check-out dengan verifikasi GPS */
function FormAbsensiKeluar({ terbuka, padaTutup, padaBerhasil }: PropsFormAbsensiKeluar) {
  const [koordinat, setKoordinat] = useState<KoordinatGPS | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState('');

  const { sukses, gagal } = gunakanNotifikasi();

  /** Menyimpan koordinat GPS yang diambil */
  const tanganiTerimaLokasi = useCallback((koord: KoordinatGPS) => {
    setKoordinat(koord);
  }, []);

  /** Mengirim data check-out ke API */
  async function kirimAbsenKeluar() {
    if (!koordinat) {
      setPesanError('Mohon aktifkan GPS dan ambil lokasi terlebih dahulu');
      return;
    }

    setSedangMemuat(true);
    setPesanError('');

    try {
      await absenKeluar(koordinat.latitude, koordinat.longitude);
      sukses('Absen keluar berhasil!', 'Selamat beristirahat.');
      padaBerhasil();
      tutupDanReset();
    } catch (error) {
      const pesan = ambilPesanError(error);
      setPesanError(pesan);
      gagal('Absen keluar gagal', pesan);
    } finally {
      setSedangMemuat(false);
    }
  }

  /** Reset state dan tutup modal */
  function tutupDanReset() {
    setKoordinat(null);
    setPesanError('');
    padaTutup();
  }

  return (
    <Modal
      terbuka={terbuka}
      padaTutup={tutupDanReset}
      judul="Absen Keluar"
      deskripsi="Aktifkan GPS untuk konfirmasi absen keluar"
      ukuran="kecil"
    >
      <div className="space-y-4">
        {/* Jam live */}
        <JamLive />

        {pesanError && (
          <Peringatan varian="gagal">{pesanError}</Peringatan>
        )}

        {/* Peringatan waktu */}
        <Peringatan varian="info">
          Absen keluar tersedia mulai pukul <strong>16:00</strong>. Pastikan Anda berada di area kantor.
        </Peringatan>

        {/* Lokasi GPS */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <MapPin size={16} />
            Lokasi Anda
          </p>
          <LokasiGPS padaLokasiTerambil={tanganiTerimaLokasi} />
        </div>
      </div>

      <FooterModal>
        <Tombol varian="sekunder" onClick={tutupDanReset} disabled={sedangMemuat}>
          Batal
        </Tombol>
        <Tombol
          onClick={kirimAbsenKeluar}
          disabled={!koordinat}
          sedangMemuat={sedangMemuat}
        >
          <LogOut size={16} />
          Konfirmasi Keluar
        </Tombol>
      </FooterModal>
    </Modal>
  );
}

export default FormAbsensiKeluar;
