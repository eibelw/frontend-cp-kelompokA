import { type ReactNode, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import { cn } from '@/utils/pembantu';

/** Wrapper tabel dengan scroll horizontal otomatis */
function Tabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className={cn('w-full border-collapse text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

/** Header tabel */
function HeaderTabel({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
      {children}
    </thead>
  );
}

/** Body tabel */
function BagiTabel({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-100 dark:divide-slate-700">{children}</tbody>;
}

/** Baris tabel */
function BarisTabel({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { children: ReactNode }) {
  return (
    <tr
      className={cn(
        'transition-colors duration-100',
        'hover:bg-slate-50 dark:hover:bg-slate-700/30',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

/** Sel header tabel */
function SelHeader({
  children,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

/** Sel data tabel */
function SelData({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td
      className={cn('px-4 py-3 text-slate-700 dark:text-slate-300', className)}
      {...props}
    >
      {children}
    </td>
  );
}

/** Status tabel kosong */
function TabelKosong({
  pesan = 'Tidak ada data',
  kolomSpan = 1,
}: {
  pesan?: string;
  kolomSpan?: number;
}) {
  return (
    <tr>
      <td colSpan={kolomSpan} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400 text-sm">
        {pesan}
      </td>
    </tr>
  );
}

export { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong };
export default Tabel;
