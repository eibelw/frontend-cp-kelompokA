import { forwardRef, type TextareaHTMLAttributes } from 'react';
import * as Label from '@radix-ui/react-label';
import { cn } from '@/utils/pembantu';

interface PropsTeksArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  pesanError?: string;
  bantuanTeks?: string;
  penuh?: boolean;
}

/** Komponen textarea universal dengan label dan error */
const TeksArea = forwardRef<HTMLTextAreaElement, PropsTeksArea>(
  ({ label, pesanError, bantuanTeks, penuh = true, className, id, ...props }, ref) => {
    const idArea = id ?? `area-${Math.random().toString(36).slice(2)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', penuh && 'w-full')}>
        {label && (
          <Label.Root htmlFor={idArea} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </Label.Root>
        )}

        <textarea
          ref={ref}
          id={idArea}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2',
            'text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'resize-y transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primer-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500',
            pesanError
              ? 'border-red-400 focus:ring-red-400'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500',
            className
          )}
          {...props}
        />

        {pesanError && <p className="text-xs text-red-600">{pesanError}</p>}
        {!pesanError && bantuanTeks && <p className="text-xs text-slate-500 dark:text-slate-400">{bantuanTeks}</p>}
      </div>
    );
  }
);

TeksArea.displayName = 'TeksArea';

export default TeksArea;
