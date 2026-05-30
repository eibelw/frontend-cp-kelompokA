import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import KartuStatusHariIni from '../komponen/KartuStatusHariIni';
import FormAbsensiMasuk from '../komponen/FormAbsensiMasuk';
import FormAbsensiKeluar from '../komponen/FormAbsensiKeluar';
import TabelRiwayatAbsensi from '../komponen/TabelRiwayatAbsensi';
import { gunakanAbsensiHariIni, gunakanRiwayatAbsensi } from '../hooks/gunakanAbsensi';

/** Halaman utama dasbor pegawai */
function HalamanDasbor() {
  const [modalMasukTerbuka, setModalMasukTerbuka] = useState(false);
  const [modalKeluarTerbuka, setModalKeluarTerbuka] = useState(false);

  const { absensiHariIni, sedangMemuat: memuatHariIni, muatUlang } = gunakanAbsensiHariIni();
  const {
    daftarAbsensi,
    sedangMemuat: memuatRiwayat,
    filter,
    totalHalaman,
    gantiHalaman,
  } = gunakanRiwayatAbsensi({ batas: 5 }); // Tampilkan 5 data terbaru di dasbor

  /** Muat ulang data setelah check-in/out berhasil */
  function setelahAbsenBerhasil() {
    muatUlang();
  }

  return (
    <div className="space-y-6 animate-masuk-bawah">
      {/* Kartu status absensi hari ini */}
      <KartuStatusHariIni
        absensi={absensiHariIni}
        sedangMemuat={memuatHariIni}
        padaAbsenMasuk={() => setModalMasukTerbuka(true)}
        padaAbsenKeluar={() => setModalKeluarTerbuka(true)}
      />

      {/* Riwayat terbaru */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Riwayat Terbaru</h2>
          <Link
            to="/absensi"
            className="text-xs text-primer-600 hover:underline flex items-center gap-1"
          >
            Lihat semua <ChevronRight size={14} />
          </Link>
        </div>

        <TabelRiwayatAbsensi
          daftarAbsensi={daftarAbsensi}
          sedangMemuat={memuatRiwayat}
          halamanAktif={filter.halaman ?? 1}
          totalHalaman={totalHalaman}
          padaGantiHalaman={gantiHalaman}
        />
      </div>

      {/* Modal check-in */}
      <FormAbsensiMasuk
        terbuka={modalMasukTerbuka}
        padaTutup={() => setModalMasukTerbuka(false)}
        padaBerhasil={setelahAbsenBerhasil}
      />

      {/* Modal check-out */}
      <FormAbsensiKeluar
        terbuka={modalKeluarTerbuka}
        padaTutup={() => setModalKeluarTerbuka(false)}
        padaBerhasil={setelahAbsenBerhasil}
      />
    </div>
  );
}

export default HalamanDasbor;
