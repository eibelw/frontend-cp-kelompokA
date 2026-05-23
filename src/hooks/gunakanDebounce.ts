import { useState, useEffect } from 'react';

/**
 * Menunda pembaruan nilai hingga tidak ada perubahan dalam `tundaan` milidetik.
 * Berguna untuk pencarian yang tidak ingin memicu API setiap ketikan.
 */
export function gunakanDebounce<T>(nilai: T, tundaan: number = 300): T {
  const [nilaiTertunda, setNilaiTertunda] = useState<T>(nilai);

  useEffect(() => {
    const penghitung = setTimeout(() => {
      setNilaiTertunda(nilai);
    }, tundaan);

    return () => clearTimeout(penghitung);
  }, [nilai, tundaan]);

  return nilaiTertunda;
}
