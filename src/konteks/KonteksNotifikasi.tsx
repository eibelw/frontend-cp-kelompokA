import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';

export type TipeNotifikasi = 'sukses' | 'gagal' | 'info' | 'peringatan';

export interface ItemNotifikasi {
  id: string;
  tipe: TipeNotifikasi;
  judul: string;
  pesan?: string;
  durasi?: number;
}

interface KonteksNotifikasiTipe {
  notifikasi: ItemNotifikasi[];
  /** Menampilkan notifikasi baru */
  tampilkanNotifikasi: (item: Omit<ItemNotifikasi, 'id'>) => void;
  /** Menyembunyikan notifikasi berdasarkan ID */
  sembunyikanNotifikasi: (id: string) => void;
  /** Shortcut: notifikasi sukses */
  sukses: (judul: string, pesan?: string) => void;
  /** Shortcut: notifikasi error */
  gagal: (judul: string, pesan?: string) => void;
  /** Shortcut: notifikasi info */
  info: (judul: string, pesan?: string) => void;
  /** Shortcut: notifikasi peringatan */
  peringatan: (judul: string, pesan?: string) => void;
}

const KonteksNotifikasi = createContext<KonteksNotifikasiTipe | null>(null);

/** Provider untuk sistem notifikasi toast global */
export function PenyediaNotifikasi({ children }: { children: ReactNode }) {
  const [notifikasi, setNotifikasi] = useState<ItemNotifikasi[]>([]);

  /** Menambahkan notifikasi baru dan menghapus otomatis setelah durasi tertentu */
  const tampilkanNotifikasi = useCallback((item: Omit<ItemNotifikasi, 'id'>) => {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const durasi = item.durasi ?? 4000;

    setNotifikasi((sebelumnya) => [...sebelumnya, { ...item, id }]);

    if (durasi > 0) {
      setTimeout(() => {
        setNotifikasi((sebelumnya) => sebelumnya.filter((n) => n.id !== id));
      }, durasi);
    }
  }, []);

  /** Menghapus notifikasi berdasarkan ID */
  const sembunyikanNotifikasi = useCallback((id: string) => {
    setNotifikasi((sebelumnya) => sebelumnya.filter((n) => n.id !== id));
  }, []);

  const sukses = useCallback(
    (judul: string, pesan?: string) => tampilkanNotifikasi({ tipe: 'sukses', judul, pesan }),
    [tampilkanNotifikasi]
  );

  const gagal = useCallback(
    (judul: string, pesan?: string) => tampilkanNotifikasi({ tipe: 'gagal', judul, pesan }),
    [tampilkanNotifikasi]
  );

  const info = useCallback(
    (judul: string, pesan?: string) => tampilkanNotifikasi({ tipe: 'info', judul, pesan }),
    [tampilkanNotifikasi]
  );

  const peringatan = useCallback(
    (judul: string, pesan?: string) => tampilkanNotifikasi({ tipe: 'peringatan', judul, pesan }),
    [tampilkanNotifikasi]
  );

  return (
    <KonteksNotifikasi.Provider
      value={{ notifikasi, tampilkanNotifikasi, sembunyikanNotifikasi, sukses, gagal, info, peringatan }}
    >
      {children}
    </KonteksNotifikasi.Provider>
  );
}

/** Hook untuk menggunakan sistem notifikasi */
export function gunakanNotifikasi(): KonteksNotifikasiTipe {
  const konteks = useContext(KonteksNotifikasi);
  if (!konteks) {
    throw new Error('gunakanNotifikasi harus dipakai di dalam PenyediaNotifikasi');
  }
  return konteks;
}
