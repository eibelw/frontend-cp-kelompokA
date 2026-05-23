import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/pembantu';

type VarianTombol = 'primer' | 'sekunder' | 'bahaya' | 'hantu' | 'tautan';
type UkuranTombol = 'kecil' | 'sedang' | 'besar';

interface PropsTombol extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Gaya visual tombol */
  varian?: VarianTombol;
  /** Ukuran tombol */
  ukuran?: UkuranTombol;
  /** Tampilkan spinner loading dan nonaktifkan tombol */
  sedangMemuat?: boolean;
  /** Jika true, render anak sebagai komponen (menggunakan Radix Slot) */
  sebagaiAnak?: boolean;
  children?: ReactNode;
}

const kelasVarian: Record<VarianTombol, string> = {
  primer: 'bg-primer-600 text-white hover:bg-primer-700 active:bg-primer-800 shadow-sm',
  sekunder: 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 active:bg-slate-100 dark:active:bg-slate-500',
  bahaya: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  hantu: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600',
  tautan: 'bg-transparent text-primer-600 dark:text-primer-400 hover:underline p-0 h-auto',
};

const kelasUkuran: Record<UkuranTombol, string> = {
  kecil: 'h-8 px-3 text-xs rounded-md',
  sedang: 'h-10 px-4 text-sm rounded-lg',
  besar: 'h-12 px-6 text-base rounded-lg',
};

/** Komponen tombol universal dengan berbagai varian dan ukuran */
const Tombol = forwardRef<HTMLButtonElement, PropsTombol>(
  (
    {
      varian = 'primer',
      ukuran = 'sedang',
      sedangMemuat = false,
      sebagaiAnak = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Komponen = sebagaiAnak ? Slot : 'button';
    const aktifDisabled = disabled || sedangMemuat;

    return (
      <Komponen
        ref={ref}
        disabled={aktifDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium',
          'transition-colors duration-150 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-primer-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800',
          'disabled:pointer-events-none disabled:opacity-50',
          kelasVarian[varian],
          kelasUkuran[ukuran],
          className
        )}
        {...props}
      >
        {sedangMemuat && (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-putar"
            aria-hidden="true"
          />
        )}
        {children}
      </Komponen>
    );
  }
);

Tombol.displayName = 'Tombol';

export default Tombol;
