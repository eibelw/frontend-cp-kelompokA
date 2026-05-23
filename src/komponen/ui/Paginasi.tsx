import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/pembantu';

interface PropsPaginasi {
  /** Halaman yang aktif saat ini (mulai dari 1) */
  halamanAktif: number;
  /** Total halaman */
  totalHalaman: number;
  /** Callback saat halaman berubah */
  padaGantiHalaman: (halaman: number) => void;
  /** Kelas CSS tambahan */
  className?: string;
}

/** Komponen paginasi universal */
function Paginasi({ halamanAktif, totalHalaman, padaGantiHalaman, className }: PropsPaginasi) {
  if (totalHalaman <= 1) return null;

  /** Menghasilkan array nomor halaman yang ditampilkan */
  function buatDaftarHalaman(): (number | '...')[] {
    const daftar: (number | '...')[] = [];
    const rentang = 2;

    for (let i = 1; i <= totalHalaman; i++) {
      if (
        i === 1 ||
        i === totalHalaman ||
        (i >= halamanAktif - rentang && i <= halamanAktif + rentang)
      ) {
        daftar.push(i);
      } else if (
        (i === halamanAktif - rentang - 1 && i > 1) ||
        (i === halamanAktif + rentang + 1 && i < totalHalaman)
      ) {
        daftar.push('...');
      }
    }

    return daftar;
  }

  const daftarHalaman = buatDaftarHalaman();

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {/* Tombol sebelumnya */}
      <button
        onClick={() => padaGantiHalaman(halamanAktif - 1)}
        disabled={halamanAktif === 1}
        className="flex items-center justify-center w-8 h-8 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Nomor halaman */}
      {daftarHalaman.map((item, indeks) =>
        item === '...' ? (
          <span key={`ellipsis-${indeks}`} className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => padaGantiHalaman(item as number)}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors',
              halamanAktif === item
                ? 'bg-primer-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            )}
            aria-current={halamanAktif === item ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      {/* Tombol berikutnya */}
      <button
        onClick={() => padaGantiHalaman(halamanAktif + 1)}
        disabled={halamanAktif === totalHalaman}
        className="flex items-center justify-center w-8 h-8 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Paginasi;
