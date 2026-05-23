import { MapPin, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { gunakanLokasi } from '../hooks/gunakanLokasi';
import Tombol from '@/komponen/ui/Tombol';
import type { KoordinatGPS } from '@/tipe/lokasi';

interface PropsLokasiGPS {
  /** Dipanggil saat koordinat berhasil diambil */
  padaLokasiTerambil: (koordinat: KoordinatGPS) => void;
}

/** Komponen untuk mengambil dan menampilkan status GPS pengguna */
function LokasiGPS({ padaLokasiTerambil }: PropsLokasiGPS) {
  const { stateLokasi, koordinat, pesanError, ambilLokasi } = gunakanLokasi();

  /** Memulai pengambilan lokasi dan meneruskan ke induk */
  async function tanganiAmbilLokasi() {
    await ambilLokasi();
  }

  // Teruskan koordinat ke parent saat berhasil diambil
  if (stateLokasi === 'berhasil' && koordinat) {
    padaLokasiTerambil(koordinat);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Kartu status lokasi */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${
        stateLokasi === 'berhasil'
          ? 'bg-emerald-50 border-emerald-200'
          : stateLokasi === 'error'
          ? 'bg-red-50 border-red-200'
          : 'bg-slate-50 border-slate-200'
      }`}>
        {/* Ikon status */}
        <div className={`mt-0.5 flex-shrink-0 ${
          stateLokasi === 'berhasil' ? 'text-emerald-600' :
          stateLokasi === 'error' ? 'text-red-600' :
          stateLokasi === 'memuat' ? 'text-primer-600' :
          'text-slate-400'
        }`}>
          {stateLokasi === 'berhasil' && <CheckCircle2 size={20} />}
          {stateLokasi === 'error' && <AlertCircle size={20} />}
          {stateLokasi === 'memuat' && <Loader2 size={20} className="animate-putar" />}
          {stateLokasi === 'menunggu' && <MapPin size={20} />}
        </div>

        {/* Info lokasi */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${
            stateLokasi === 'berhasil' ? 'text-emerald-700' :
            stateLokasi === 'error' ? 'text-red-700' :
            'text-slate-700'
          }`}>
            {stateLokasi === 'berhasil' && 'Lokasi berhasil diambil'}
            {stateLokasi === 'error' && 'Gagal mengambil lokasi'}
            {stateLokasi === 'memuat' && 'Mengambil lokasi...'}
            {stateLokasi === 'menunggu' && 'Lokasi belum diambil'}
          </p>

          {/* Detail koordinat */}
          {stateLokasi === 'berhasil' && koordinat && (
            <p className="text-xs text-emerald-600 mt-0.5 font-mono">
              {koordinat.latitude.toFixed(6)}, {koordinat.longitude.toFixed(6)}
              {koordinat.akurasi && (
                <span className="font-sans ml-2 text-emerald-500">
                  (±{koordinat.akurasi < 1000
                    ? `${Math.round(koordinat.akurasi)}m`
                    : `${(koordinat.akurasi / 1000).toFixed(2)}km`})
                </span>
              )}
            </p>
          )}

          {/* Pesan error */}
          {stateLokasi === 'error' && (
            <p className="text-xs text-red-600 mt-0.5">{pesanError}</p>
          )}
        </div>

        {/* Tombol refresh jika error */}
        {stateLokasi === 'error' && (
          <button
            onClick={tanganiAmbilLokasi}
            className="flex-shrink-0 p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
            aria-label="Coba lagi"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </div>

      {/* Tombol ambil lokasi (hanya jika belum pernah diambil) */}
      {stateLokasi === 'menunggu' && (
        <Tombol
          varian="sekunder"
          onClick={tanganiAmbilLokasi}
          className="w-full"
        >
          <MapPin size={16} />
          Ambil Lokasi GPS
        </Tombol>
      )}
    </div>
  );
}

export default LokasiGPS;
