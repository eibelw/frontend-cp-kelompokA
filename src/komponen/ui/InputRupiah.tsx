import { useState, useRef } from 'react';
import * as Label from '@radix-ui/react-label';
import { cn } from '@/utils/pembantu';

interface PropsInputRupiah {
  label?: string;
  nilai: number | string;
  onUbah: (nilai: number) => void;
  pesanError?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function formatRibu(n: number): string {
  if (isNaN(n) || n === 0) return '';
  return new Intl.NumberFormat('id-ID').format(n);
}

/** Input angka dengan format pemisah ribuan (titik) untuk nilai Rupiah */
function InputRupiah({ label, nilai, onUbah, pesanError, required, disabled, className }: PropsInputRupiah) {
  const angka = typeof nilai === 'string' ? (parseFloat(nilai) || 0) : nilai;
  const [sedangFokus, setSedangFokus] = useState(false);
  const [teksInput, setTeksInput] = useState('');
  const idInput = useRef(`rupiah-${Math.random().toString(36).slice(2)}`).current;

  function tanganiPadam() {
    setSedangFokus(true);
    setTeksInput(angka > 0 ? String(angka) : '');
  }

  function tanganiUbah(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setTeksInput(raw);
    onUbah(raw ? parseInt(raw, 10) : 0);
  }

  function tanganiBlur() {
    setSedangFokus(false);
  }

  const tampilan = sedangFokus ? teksInput : (angka > 0 ? formatRibu(angka) : '');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label.Root htmlFor={idInput} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label.Root>
      )}
      <input
        id={idInput}
        type="text"
        inputMode="numeric"
        value={tampilan}
        onFocus={tanganiPadam}
        onChange={tanganiUbah}
        onBlur={tanganiBlur}
        disabled={disabled}
        placeholder="0"
        className={cn(
          'flex h-10 w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2',
          'text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primer-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500',
          pesanError
            ? 'border-red-400'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500',
          className
        )}
      />
      {pesanError && <p className="text-xs text-red-600">{pesanError}</p>}
    </div>
  );
}

export default InputRupiah;
