import { type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/pembantu';

type VarianPeringatan = 'sukses' | 'gagal' | 'info' | 'peringatan';

interface PropsPeringatan {
  varian: VarianPeringatan;
  judul?: string;
  children: ReactNode;
  /** Callback jika ingin ada tombol tutup */
  padaTutup?: () => void;
  className?: string;
}

const konfigurasi: Record<VarianPeringatan, {
  kelas: string;
  ikon: React.ElementType;
}> = {
  sukses: {
    kelas: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
    ikon: CheckCircle2,
  },
  gagal: {
    kelas: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    ikon: AlertCircle,
  },
  info: {
    kelas: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    ikon: Info,
  },
  peringatan: {
    kelas: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    ikon: AlertTriangle,
  },
};

/** Komponen peringatan/alert universal */
function Peringatan({ varian, judul, children, padaTutup, className }: PropsPeringatan) {
  const { kelas, ikon: Ikon } = konfigurasi[varian];

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 p-4 rounded-lg border text-sm',
        kelas,
        className
      )}
    >
      <Ikon size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />

      <div className="flex-1 min-w-0">
        {judul && <p className="font-semibold mb-1">{judul}</p>}
        <div>{children}</div>
      </div>

      {padaTutup && (
        <button
          onClick={padaTutup}
          className="flex-shrink-0 -mt-0.5 -mr-0.5 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Tutup peringatan"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default Peringatan;
