import type { LucideIcon } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import { cn } from '@/utils/pembantu';

interface PropsKartuStatistik {
  judul: string;
  nilai: number | string;
  ikon: LucideIcon;
  warnaIkon?: string;
  warnaLatar?: string;
  keterangan?: string;
  sedangMemuat?: boolean;
  onClick?: () => void;
}

/** Kartu statistik untuk dasbor admin */
function KartuStatistik({
  judul,
  nilai,
  ikon: Ikon,
  warnaIkon = 'text-primer-600',
  warnaLatar = 'bg-primer-50',
  keterangan,
  sedangMemuat,
  onClick,
}: PropsKartuStatistik) {
  if (sedangMemuat) return <SkeletonKartu />;

  return (
    <Kartu
      hoverBayangan
      onClick={onClick}
      className={onClick ? 'cursor-pointer hover:ring-2 hover:ring-primer-200 transition-all' : undefined}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{judul}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{nilai}</p>
          {keterangan && (
            <p className="text-xs text-slate-400 mt-1">{keterangan}</p>
          )}
        </div>

        {/* Ikon */}
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', warnaLatar)}>
          <Ikon size={20} className={warnaIkon} />
        </div>
      </div>
    </Kartu>
  );
}

export default KartuStatistik;
