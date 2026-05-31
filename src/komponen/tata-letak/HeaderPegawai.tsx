import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { gunakanTema } from '@/konteks/KonteksTema';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import Tombol from '@/komponen/ui/Tombol';
import { formatTanggal } from '@/utils/formatTanggal';

interface PropsHeader {
  judulHalaman?: string;
}

/** Header atas untuk halaman pegawai */
function HeaderPegawai({ judulHalaman }: PropsHeader) {
  const { pengguna, keluar } = gunakanOtentikasi();
  const { sukses } = gunakanNotifikasi();
  const { tema, gantiTema } = gunakanTema();
  const navigasi = useNavigate();
  const tanggalSekarang = formatTanggal(new Date());
  const [dropdownTerbuka, setDropdownTerbuka] = useState(false);
  const [konfirmasiTerbuka, setKonfirmasiTerbuka] = useState(false);
  const refDropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function tutupJikaLuar(e: MouseEvent) {
      if (refDropdown.current && !refDropdown.current.contains(e.target as Node)) {
        setDropdownTerbuka(false);
      }
    }
    document.addEventListener('mousedown', tutupJikaLuar);
    return () => document.removeEventListener('mousedown', tutupJikaLuar);
  }, []);

  function tanganiKeluar() {
    setDropdownTerbuka(false);
    setKonfirmasiTerbuka(true);
  }

  function tanganiKonfirmasiKeluar() {
    keluar();
    sukses('Berhasil keluar', 'Sampai jumpa kembali!');
    navigasi('/masuk');
  }

  return (
    <>
    <Modal
      terbuka={konfirmasiTerbuka}
      padaTutup={() => setKonfirmasiTerbuka(false)}
      judul="Konfirmasi Keluar"
      ukuran="kecil"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Apakah kamu yakin ingin keluar dari aplikasi?
      </p>
      <FooterModal>
        <Tombol varian="sekunder" onClick={() => setKonfirmasiTerbuka(false)}>
          Batal
        </Tombol>
        <Tombol varian="bahaya" onClick={tanganiKonfirmasiKeluar}>
          <LogOut size={15} />
          Keluar
        </Tombol>
      </FooterModal>
    </Modal>

    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div>
          {judulHalaman ? (
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">{judulHalaman}</h1>
          ) : (
            <>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tanggalSekarang}</p>
              <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Selamat {salamWaktu()}, {pengguna?.nama.split(' ')[0]}!
              </h1>
            </>
          )}
        </div>

        {/* Avatar + dropdown */}
        {pengguna && (
          <div className="relative" ref={refDropdown}>
            <button
              onClick={() => setDropdownTerbuka((v) => !v)}
              className="flex items-center gap-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primer-500 focus:ring-offset-2"
              aria-label="Menu profil"
            >
              <AvatarPengguna nama={pengguna.nama} />
              <ChevronDown
                size={14}
                className={`text-slate-500 transition-transform duration-150 ${dropdownTerbuka ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownTerbuka && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50 animate-masuk-atas">
                {/* Info pengguna */}
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{pengguna.nama}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{pengguna.email}</p>
                </div>

                <button
                  onClick={() => { navigasi('/profil'); setDropdownTerbuka(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <User size={15} className="text-slate-400" />
                  Profil Saya
                </button>

                <button
                  onClick={() => { gantiTema(); setDropdownTerbuka(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {tema === 'terang' ? <Moon size={15} className="text-slate-400" /> : <Sun size={15} className="text-slate-400" />}
                  {tema === 'terang' ? 'Mode Gelap' : 'Mode Terang'}
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 mt-1">
                  <button
                    onClick={tanganiKeluar}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={15} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
    </>
  );
}

/** Mengembalikan salam sesuai waktu saat ini */
function salamWaktu(): string {
  const jam = new Date().getHours();
  if (jam < 12) return 'pagi';
  if (jam < 15) return 'siang';
  if (jam < 18) return 'sore';
  return 'malam';
}

export default HeaderPegawai;
