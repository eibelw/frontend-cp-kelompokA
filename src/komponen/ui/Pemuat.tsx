import { cn } from '@/utils/pembantu';

type UkuranPemuat = 'kecil' | 'sedang' | 'besar';

interface PropsPemuat {
  ukuran?: UkuranPemuat;
  className?: string;
  /** Label aksesibilitas */
  ariaLabel?: string;
}

const kelasUkuran: Record<UkuranPemuat, string> = {
  kecil: 'w-4 h-4 border-2',
  sedang: 'w-8 h-8 border-2',
  besar: 'w-12 h-12 border-3',
};

/** Komponen spinner loading */
function Pemuat({ ukuran = 'sedang', className, ariaLabel = 'Memuat...' }: PropsPemuat) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border-primer-200 border-t-primer-600 animate-putar',
        kelasUkuran[ukuran],
        className
      )}
      role="status"
      aria-label={ariaLabel}
    />
  );
}

/** Halaman penuh loading overlay */
function PemuatHalaman({ pesan = 'Memuat...' }: { pesan?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Pemuat ukuran="besar" />
        <p className="text-sm text-slate-500">{pesan}</p>
      </div>
    </div>
  );
}

/** Loading skeleton untuk teks */
function SkeletonTeks({ lebar = 'w-full', className }: { lebar?: string; className?: string }) {
  return (
    <div
      className={cn('h-4 bg-slate-200 rounded animate-denyut', lebar, className)}
      aria-hidden="true"
    />
  );
}

/** Loading skeleton untuk kartu */
function SkeletonKartu({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-5 space-y-3', className)}>
      <SkeletonTeks lebar="w-1/3" />
      <SkeletonTeks lebar="w-full" />
      <SkeletonTeks lebar="w-2/3" />
    </div>
  );
}

export { Pemuat, PemuatHalaman, SkeletonTeks, SkeletonKartu };
export default Pemuat;
