import { forwardRef, type SelectHTMLAttributes } from 'react';
import * as Label from '@radix-ui/react-label';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/pembantu';
import type { OpsiPilihan } from '@/tipe/umum';

interface PropsPilihan extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  opsi: OpsiPilihan[];
  pesanError?: string;
  bantuanTeks?: string;
  tempatPenampung?: string;
  penuh?: boolean;
}

/** Komponen select/dropdown universal */
const Pilihan = forwardRef<HTMLSelectElement, PropsPilihan>(
  ({ label, opsi, pesanError, bantuanTeks, tempatPenampung, penuh = true, className, id, ...props }, ref) => {
    const idPilihan = id ?? `pilihan-${Math.random().toString(36).slice(2)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', penuh && 'w-full')}>
        {label && (
          <Label.Root htmlFor={idPilihan} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </Label.Root>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={idPilihan}
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 pr-8',
              'text-sm text-slate-900 dark:text-slate-100',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primer-500 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500',
              pesanError
                ? 'border-red-400'
                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500',
              className
            )}
            {...props}
          >
            {tempatPenampung && (
              <option value="" disabled>
                {tempatPenampung}
              </option>
            )}
            {opsi.map((opsi) => (
              <option key={opsi.nilai} value={opsi.nilai}>
                {opsi.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {pesanError && <p className="text-xs text-red-600">{pesanError}</p>}
        {!pesanError && bantuanTeks && <p className="text-xs text-slate-500 dark:text-slate-400">{bantuanTeks}</p>}
      </div>
    );
  }
);

Pilihan.displayName = 'Pilihan';

export default Pilihan;
