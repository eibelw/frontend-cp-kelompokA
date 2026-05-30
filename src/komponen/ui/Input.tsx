import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import * as Label from '@radix-ui/react-label';
import { cn } from '@/utils/pembantu';

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  /** Label yang ditampilkan di atas input */
  label?: string;
  /** Pesan error di bawah input */
  pesanError?: string;
  /** Teks bantuan di bawah input */
  bantuanTeks?: string;
  /** Ikon atau elemen di sisi kiri input */
  ikonKiri?: ReactNode;
  /** Ikon atau elemen di sisi kanan input */
  ikonKanan?: ReactNode;
  /** Memenuhi lebar kontainer */
  penuh?: boolean;
}

/** Komponen input teks universal dengan dukungan label, error, dan ikon */
const Input = forwardRef<HTMLInputElement, PropsInput>(
  (
    {
      label,
      pesanError,
      bantuanTeks,
      ikonKiri,
      ikonKanan,
      penuh = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const idInput = id ?? `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', penuh && 'w-full')}>
        {label && (
          <Label.Root
            htmlFor={idInput}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </Label.Root>
        )}

        <div className="relative">
          {ikonKiri && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {ikonKiri}
            </span>
          )}

          <input
            ref={ref}
            id={idInput}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2',
              'text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primer-500 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500',
              pesanError
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500',
              ikonKiri ? 'pl-10' : undefined,
              ikonKanan ? 'pr-10' : undefined,
              className
            )}
            aria-describedby={pesanError ? `${idInput}-error` : bantuanTeks ? `${idInput}-bantuan` : undefined}
            aria-invalid={pesanError ? 'true' : 'false'}
            {...props}
          />

          {ikonKanan && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {ikonKanan}
            </span>
          )}
        </div>

        {pesanError && (
          <p id={`${idInput}-error`} className="text-xs text-red-600 flex items-center gap-1">
            {pesanError}
          </p>
        )}

        {!pesanError && bantuanTeks && (
          <p id={`${idInput}-bantuan`} className="text-xs text-slate-500">
            {bantuanTeks}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
