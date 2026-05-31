import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import { BadgeStatusAbsensi } from '@/komponen/ui/Badge';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import Tombol from '@/komponen/ui/Tombol';
import type { Absensi } from '@/tipe/absensi';
import { formatWaktu, formatTanggal } from '@/utils/formatTanggal';

interface PropsKartuStatus {
  absensi: Absensi | null;
  sedangMemuat: boolean;
  /** Callback saat tombol Absen Masuk ditekan */
  padaAbsenMasuk: () => void;
  /** Callback saat tombol Absen Keluar ditekan */
  padaAbsenKeluar: () => void;
}

/** Kartu yang menampilkan status absensi hari ini beserta tombol aksi */
function KartuStatusHariIni({
  absensi,
  sedangMemuat,
  padaAbsenMasuk,
  padaAbsenKeluar,
}: PropsKartuStatus) {
  if (sedangMemuat) {
    return <SkeletonKartu />;
  }

  const sudahMasuk = absensi?.waktuMasuk != null;
  const sudahKeluar = absensi?.waktuKeluar != null;
  const tanggalHariIni = formatTanggal(new Date());

  return (
    <Kartu className="overflow-hidden">
      {/* Header berwarna */}
      <div className="bg-gradient-to-r from-primer-600 to-primer-700 -mx-5 -mt-5 px-5 pt-5 pb-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primer-200 text-xs font-medium">Status Hari Ini</p>
            <p className="text-white text-sm font-semibold mt-0.5 flex items-center gap-2">
              <Calendar size={14} />
              {tanggalHariIni}
            </p>
          </div>
          {absensi && <BadgeStatusAbsensi status={absensi.status} />}
        </div>
      </div>

      {/* Info waktu masuk & keluar */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Waktu masuk */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <LogIn size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Masuk</p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {absensi?.waktuMasuk ? formatWaktu(absensi.waktuMasuk) : '--:--'}
            </p>
          </div>
        </div>

        {/* Waktu keluar */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <LogOut size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Keluar</p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {absensi?.waktuKeluar ? formatWaktu(absensi.waktuKeluar) : '--:--'}
            </p>
          </div>
        </div>
      </div>

      {/* Foto selfie (jika ada) */}
      {absensi?.urlFoto && (
        <div className="mb-4">
          <img
            src={absensi.urlFoto}
            alt="Foto absensi masuk"
            className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow"
            onError={(e) => {
              // Fallback jika foto tidak ditemukan
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Tombol aksi */}
      <div className="flex gap-3">
        {!sudahMasuk && (
          <Tombol onClick={padaAbsenMasuk} className="flex-1">
            <LogIn size={16} />
            Absen Masuk
          </Tombol>
        )}

        {sudahMasuk && !sudahKeluar && (
          <Tombol varian="sekunder" onClick={padaAbsenKeluar} className="flex-1">
            <LogOut size={16} />
            Absen Keluar
          </Tombol>
        )}

        {sudahMasuk && sudahKeluar && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <Clock size={16} />
            Absensi hari ini sudah selesai
          </div>
        )}
      </div>
    </Kartu>
  );
}

export default KartuStatusHariIni;
