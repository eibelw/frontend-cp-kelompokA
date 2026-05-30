import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/pembantu';

interface PropsKartu extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Tambahkan bayangan hover */
  hoverBayangan?: boolean;
  /** Hapus padding default */
  tanpaPadding?: boolean;
}

/** Komponen kartu (card) container universal */
function Kartu({ children, hoverBayangan, tanpaPadding, className, ...props }: PropsKartu) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-kartu',
        !tanpaPadding && 'p-5',
        hoverBayangan && 'transition-shadow duration-200 hover:shadow-kartu-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Header kartu dengan judul dan aksi opsional */
function HeaderKartu({
  judul,
  subJudul,
  aksi,
  className,
}: {
  judul: string;
  subJudul?: string;
  aksi?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{judul}</h3>
        {subJudul && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subJudul}</p>}
      </div>
      {aksi && <div className="flex items-center gap-2">{aksi}</div>}
    </div>
  );
}

/** Divider di dalam kartu */
function PemisahKartu({ className }: { className?: string }) {
  return <hr className={cn('border-slate-200 dark:border-slate-700 my-4', className)} />;
}

export { Kartu, HeaderKartu, PemisahKartu };
export default Kartu;
