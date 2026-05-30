import { gunakanRiwayatAbsensi } from '../hooks/gunakanAbsensi';
import TabelRiwayatAbsensi from '../komponen/TabelRiwayatAbsensi';
import Pilihan from '@/komponen/ui/Pilihan';
import Input from '@/komponen/ui/Input';
import { Kartu } from '@/komponen/ui/Kartu';
import { formatUntukInput, seninMingguIni, mingguMingguIni } from '@/utils/formatTanggal';
import type { OpsiPilihan } from '@/tipe/umum';

const opsiStatus: OpsiPilihan[] = [
  { nilai: '', label: 'Semua Status' },
  { nilai: 'hadir', label: 'Hadir' },
  { nilai: 'izin', label: 'Izin' },
  { nilai: 'sakit', label: 'Sakit' },
  { nilai: 'alpa', label: 'Alpa' },
];

const defaultTanggalMulai = formatUntukInput(seninMingguIni());
const defaultTanggalSelesai = formatUntukInput(mingguMingguIni());

/** Halaman riwayat absensi lengkap dengan filter */
function HalamanRiwayatAbsensi() {
  const { daftarAbsensi, sedangMemuat, filter, totalHalaman, total, gantiHalaman, terapkanFilter } =
    gunakanRiwayatAbsensi({
      batas: 10,
      tanggalMulai: defaultTanggalMulai,
      tanggalSelesai: defaultTanggalSelesai,
    });

  return (
    <div className="space-y-5 animate-masuk-bawah">
      {/* Filter */}
      <Kartu>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input
            label="Dari Tanggal"
            type="date"
            value={filter.tanggalMulai ?? ''}
            onChange={(e) => terapkanFilter({ tanggalMulai: e.target.value || undefined })}
          />
          <Input
            label="Sampai Tanggal"
            type="date"
            value={filter.tanggalSelesai ?? ''}
            onChange={(e) => terapkanFilter({ tanggalSelesai: e.target.value || undefined })}
          />
        </div>
        <Pilihan
          label="Status"
          opsi={opsiStatus}
          value={filter.status ?? ''}
          onChange={(e) => terapkanFilter({ status: (e.target.value as any) || undefined })}
        />
      </Kartu>

      {/* Info total */}
      {!sedangMemuat && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span> data absensi ditemukan
        </p>
      )}

      {/* Tabel */}
      <TabelRiwayatAbsensi
        daftarAbsensi={daftarAbsensi}
        sedangMemuat={sedangMemuat}
        halamanAktif={filter.halaman ?? 1}
        totalHalaman={totalHalaman}
        padaGantiHalaman={gantiHalaman}
      />
    </div>
  );
}

export default HalamanRiwayatAbsensi;
