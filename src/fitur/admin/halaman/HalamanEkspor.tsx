import { useState } from 'react';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import Input from '@/komponen/ui/Input';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import { eksporExcel, eksporPDF, unduhFile } from '../api/adminApi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import { formatUntukInput } from '@/utils/formatTanggal';
import type { FilterEkspor } from '@/tipe/absensi';

/** Halaman ekspor data absensi (admin) */
function HalamanEkspor() {
  // Default: bulan berjalan
  const sekarang = new Date();
  const awalBulan = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);

  const [tanggalMulai, setTanggalMulai] = useState(formatUntukInput(awalBulan));
  const [tanggalSelesai, setTanggalSelesai] = useState(formatUntukInput(sekarang));
  const [sedangEksporExcel, setSedangEksporExcel] = useState(false);
  const [sedangEksporPDF, setSedangEksporPDF] = useState(false);
  const [pesanError, setPesanError] = useState('');

  const { sukses } = gunakanNotifikasi();

  function validasi(): boolean {
    if (!tanggalMulai) { setPesanError('Tanggal mulai harus diisi'); return false; }
    if (!tanggalSelesai) { setPesanError('Tanggal selesai harus diisi'); return false; }
    if (tanggalSelesai < tanggalMulai) { setPesanError('Tanggal selesai tidak boleh sebelum tanggal mulai'); return false; }
    setPesanError('');
    return true;
  }

  function buatFilter(): FilterEkspor {
    return { tanggalMulai, tanggalSelesai };
  }

  /** Mengunduh rekap sebagai Excel */
  async function unduhExcel() {
    if (!validasi()) return;
    setSedangEksporExcel(true);
    try {
      const blob = await eksporExcel(buatFilter());
      unduhFile(blob, `rekap-absensi-${tanggalMulai}-${tanggalSelesai}.xlsx`);
      sukses('Unduhan dimulai', 'File Excel sedang diunduh');
    } catch (err) {
      setPesanError(ambilPesanError(err));
    } finally {
      setSedangEksporExcel(false);
    }
  }

  /** Mengunduh rekap sebagai PDF */
  async function unduhPDF() {
    if (!validasi()) return;
    setSedangEksporPDF(true);
    try {
      const blob = await eksporPDF(buatFilter());
      unduhFile(blob, `rekap-absensi-${tanggalMulai}-${tanggalSelesai}.pdf`);
      sukses('Unduhan dimulai', 'File PDF sedang diunduh');
    } catch (err) {
      setPesanError(ambilPesanError(err));
    } finally {
      setSedangEksporPDF(false);
    }
  }

  return (
    <div className="space-y-5 animate-masuk-bawah">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ekspor Data</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Unduh rekap absensi dalam format Excel atau PDF</p>
      </div>

      <Kartu>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Filter Periode</h3>

        {pesanError && (
          <div className="mb-4">
            <Peringatan varian="gagal">{pesanError}</Peringatan>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input
            label="Dari Tanggal"
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            required
          />
          <Input
            label="Sampai Tanggal"
            type="date"
            value={tanggalSelesai}
            min={tanggalMulai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            required
          />
        </div>

        {/* Tombol ekspor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Ekspor Excel */}
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <div className="flex items-center gap-3">
              {/* Ganti dengan ikon Excel dari src/aset/gambar/excel-icon.svg */}
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
                <FileSpreadsheet size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Excel</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Format .xlsx</p>
              </div>
            </div>
            <Tombol
              onClick={unduhExcel}
              sedangMemuat={sedangEksporExcel}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download size={16} />
              Unduh Excel
            </Tombol>
          </div>

          {/* Ekspor PDF */}
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              {/* Ganti dengan ikon PDF dari src/aset/gambar/pdf-icon.svg */}
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-800/50 flex items-center justify-center">
                <FileText size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">PDF</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Format .pdf</p>
              </div>
            </div>
            <Tombol
              onClick={unduhPDF}
              sedangMemuat={sedangEksporPDF}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Download size={16} />
              Unduh PDF
            </Tombol>
          </div>
        </div>
      </Kartu>
    </div>
  );
}

export default HalamanEkspor;
