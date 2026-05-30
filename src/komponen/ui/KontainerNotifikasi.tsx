import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/pembantu';
import { gunakanNotifikasi, type TipeNotifikasi } from '@/konteks/KonteksNotifikasi';

const konfigurasi: Record<TipeNotifikasi, {
  kelas: string;
  ikon: React.ElementType;
}> = {
  sukses: { kelas: 'bg-white border-emerald-400 text-emerald-700', ikon: CheckCircle2 },
  gagal: { kelas: 'bg-white border-red-400 text-red-700', ikon: AlertCircle },
  info: { kelas: 'bg-white border-blue-400 text-blue-700', ikon: Info },
  peringatan: { kelas: 'bg-white border-amber-400 text-amber-700', ikon: AlertTriangle },
};

/** Komponen yang merender semua notifikasi toast di pojok kanan atas */
function KontainerNotifikasi() {
  const { notifikasi, sembunyikanNotifikasi } = gunakanNotifikasi();

  if (notifikasi.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifikasi"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
    >
      {notifikasi.map((item) => {
        const { kelas, ikon: Ikon } = konfigurasi[item.tipe];

        return (
          <div
            key={item.id}
            role="alert"
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg',
              'animate-masuk-atas',
              kelas
            )}
          >
            <Ikon size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900">{item.judul}</p>
              {item.pesan && (
                <p className="text-xs text-slate-500 mt-0.5">{item.pesan}</p>
              )}
            </div>

            <button
              onClick={() => sembunyikanNotifikasi(item.id)}
              className="flex-shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default KontainerNotifikasi;
