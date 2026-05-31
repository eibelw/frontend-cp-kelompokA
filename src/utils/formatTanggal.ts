/** Parse string tanggal ke Date.
 *  - YYYY-MM-DD          → lokal (tanpa jam)
 *  - datetime string     → selalu UTC (tambahkan Z jika tidak ada timezone)
 */
function parseDate(tanggal: string | Date): Date {
  if (tanggal instanceof Date) return tanggal;
  // Format tanggal saja (YYYY-MM-DD) → perlakukan sebagai lokal agar tidak bergeser hari
  if (/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    const [y, m, d] = tanggal.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  // Datetime string tanpa info timezone → anggap UTC (tambah Z)
  if (!/[Zz]$/.test(tanggal) && !/[+-]\d{2}:?\d{2}$/.test(tanggal)) {
    return new Date(tanggal + 'Z');
  }
  return new Date(tanggal);
}

/** Format tanggal ke tampilan standar Indonesia (mis: 20 Mei 2026) */
export function formatTanggal(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(parseDate(tanggal));
}

/** Format tanggal ke format pendek (mis: 20 Mei) */
export function formatTanggalPendek(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short',
  }).format(parseDate(tanggal));
}

/** Format waktu ke HH:mm (mis: 08:30) — selalu dalam WIB */
export function formatWaktu(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(parseDate(tanggal));
}

/** Format waktu lengkap dengan tanggal (mis: 20 Mei 2026, 08:30) — selalu dalam WIB */
export function formatWaktuLengkap(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(parseDate(tanggal));
}

/** Format tanggal relatif (mis: "Hari ini", "Kemarin", "3 hari lalu") */
export function formatRelatif(tanggal: string | Date): string {
  const tgl = parseDate(tanggal);
  const now = new Date();
  if (tgl.toDateString() === now.toDateString()) return 'Hari ini';
  const kemarin = new Date(now);
  kemarin.setDate(now.getDate() - 1);
  if (tgl.toDateString() === kemarin.toDateString()) return 'Kemarin';
  const diffHari = Math.floor((now.getTime() - tgl.getTime()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });
  if (diffHari < 30) return rtf.format(-diffHari, 'day');
  if (diffHari < 365) return rtf.format(-Math.floor(diffHari / 30), 'month');
  return rtf.format(-Math.floor(diffHari / 365), 'year');
}

/** Format tanggal untuk input type="date" (YYYY-MM-DD) */
export function formatUntukInput(tanggal: string | Date): string {
  const tgl = parseDate(tanggal);
  const y = tgl.getFullYear();
  const m = String(tgl.getMonth() + 1).padStart(2, '0');
  const d = String(tgl.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format hari dalam seminggu (mis: Senin) */
export function formatHari(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(parseDate(tanggal));
}

/** Kembalikan tanggal Senin minggu berjalan (lokal, jam 00:00:00) */
export function seninMingguIni(): Date {
  const today = new Date();
  const hari = today.getDay(); // 0=Minggu, 1=Senin, ...
  const selisih = hari === 0 ? -6 : 1 - hari;
  const senin = new Date(today.getFullYear(), today.getMonth(), today.getDate() + selisih);
  return senin;
}

/** Kembalikan tanggal Minggu minggu berjalan (lokal, jam 00:00:00) */
export function mingguMingguIni(): Date {
  const senin = seninMingguIni();
  return new Date(senin.getFullYear(), senin.getMonth(), senin.getDate() + 6);
}
