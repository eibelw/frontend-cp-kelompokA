import { type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/utils/pembantu';

type UkuranModal = 'kecil' | 'sedang' | 'besar' | 'penuh';

interface PropsModal {
  /** Kontrol buka/tutup modal dari luar */
  terbuka: boolean;
  /** Callback saat modal ditutup */
  padaTutup: () => void;
  /** Judul modal */
  judul?: string;
  /** Deskripsi modal (untuk accessibility) */
  deskripsi?: string;
  /** Konten modal */
  children: ReactNode;
  /** Ukuran modal */
  ukuran?: UkuranModal;
  /** Sembunyikan tombol tutup */
  sembunyikanTombolTutup?: boolean;
}

const kelasUkuran: Record<UkuranModal, string> = {
  kecil: 'max-w-sm',
  sedang: 'max-w-lg',
  besar: 'max-w-2xl',
  penuh: 'max-w-4xl',
};

/** Komponen modal/dialog universal menggunakan Radix UI */
function Modal({
  terbuka,
  padaTutup,
  judul,
  deskripsi,
  children,
  ukuran = 'sedang',
  sembunyikanTombolTutup = false,
}: PropsModal) {
  return (
    <Dialog.Root open={terbuka} onOpenChange={(buka) => !buka && padaTutup()}>
      <Dialog.Portal>
        {/* Overlay gelap di belakang modal */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-masuk-atas" />

        {/* Konten modal */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl',
            'data-[state=open]:animate-masuk-bawah',
            'focus:outline-none',
            'max-h-[90vh] overflow-y-auto',
            kelasUkuran[ukuran],
            'mx-4'
          )}
        >
          {/* Header modal */}
          {(judul || !sembunyikanTombolTutup) && (
            <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <div>
                {judul && (
                  <Dialog.Title className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {judul}
                  </Dialog.Title>
                )}
                {deskripsi && (
                  <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {deskripsi}
                  </Dialog.Description>
                )}
              </div>

              {!sembunyikanTombolTutup && (
                <Dialog.Close
                  className="ml-4 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Tutup modal"
                >
                  <X size={18} />
                </Dialog.Close>
              )}
            </div>
          )}

          {/* Isi konten */}
          <div className="p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Footer modal dengan tombol aksi */
export function FooterModal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-end gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-700', className)}>
      {children}
    </div>
  );
}

export default Modal;
