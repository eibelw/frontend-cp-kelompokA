import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/pembantu';
import type { StatusAbsensi } from '@/tipe/absensi';
import type { StatusIzin, JenisIzin } from '@/tipe/izin';

type VarianBadge = 'hijau' | 'kuning' | 'biru' | 'merah' | 'abu' | 'ungu';

interface PropsBadge extends HTMLAttributes<HTMLSpanElement> {
  varian?: VarianBadge;
  children: React.ReactNode;
}

const kelasVarian: Record<VarianBadge, string> = {
  hijau: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  kuning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  biru: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  merah: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  abu: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  ungu: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
};

/** Komponen badge/label status universal */
function Badge({ varian = 'abu', children, className, ...props }: PropsBadge) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        kelasVarian[varian],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Badge khusus untuk status kehadiran */
export function BadgeStatusAbsensi({ status }: { status: StatusAbsensi }) {
  const konfigurasi: Record<StatusAbsensi, { varian: VarianBadge; label: string }> = {
    hadir: { varian: 'hijau', label: 'Hadir' },
    izin: { varian: 'kuning', label: 'Izin' },
    sakit: { varian: 'biru', label: 'Sakit' },
    alpa: { varian: 'merah', label: 'Alpa' },
    cuti: { varian: 'abu', label: 'Cuti' },
  };

  const { varian, label } = konfigurasi[status];
  return <Badge varian={varian}>{label}</Badge>;
}

/** Badge khusus untuk status pengajuan izin */
export function BadgeStatusIzin({ status }: { status: StatusIzin }) {
  const konfigurasi: Record<StatusIzin, { varian: VarianBadge; label: string }> = {
    menunggu: { varian: 'kuning', label: 'Menunggu' },
    disetujui: { varian: 'hijau', label: 'Disetujui' },
    ditolak: { varian: 'merah', label: 'Ditolak' },
  };

  const { varian, label } = konfigurasi[status];
  return <Badge varian={varian}>{label}</Badge>;
}

/** Badge khusus untuk jenis izin */
export function BadgeJenisIzin({ jenis }: { jenis: JenisIzin }) {
  const konfigurasi: Record<JenisIzin, { varian: VarianBadge; label: string }> = {
    izin: { varian: 'ungu', label: 'Izin' },
    sakit: { varian: 'biru', label: 'Sakit' },
    cuti: { varian: 'hijau', label: 'Cuti' },
  };
  const { varian, label } = konfigurasi[jenis] ?? { varian: 'abu', label: jenis };
  return <Badge varian={varian}>{label}</Badge>;
}

export default Badge;
