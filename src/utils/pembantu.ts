/** Menggabungkan class Tailwind dengan aman */
export function cn(...kelas: (string | undefined | null | boolean)[]): string {
  return kelas.filter(Boolean).join(' ');
}

/** Memotong teks jika melebihi panjang maksimum */
export function potongTeks(teks: string, maks: number): string {
  if (teks.length <= maks) return teks;
  return teks.slice(0, maks) + '...';
}

/** Mengambil inisial nama (mis: "Budi Santoso" -> "BS") */
export function ambilInisial(nama: string): string {
  return nama
    .split(' ')
    .slice(0, 2)
    .map((kata) => kata.charAt(0).toUpperCase())
    .join('');
}

/** Format angka ke format Rupiah */
export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}

/** Menghitung jarak dua koordinat GPS menggunakan rumus Haversine (dalam meter) */
export function hitungJarakGPS(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Radius bumi dalam meter
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Membuat delay (promise yang resolve setelah ms milidetik) */
export function tunggu(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Mengecek apakah nilai adalah object kosong */
export function adalaObjekKosong(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/** Mengubah file ke base64 string */
export function fileKeBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const pembaca = new FileReader();
    pembaca.onload = () => resolve(pembaca.result as string);
    pembaca.onerror = reject;
    pembaca.readAsDataURL(file);
  });
}
