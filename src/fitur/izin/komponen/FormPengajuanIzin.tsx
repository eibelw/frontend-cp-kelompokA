import { useState, type ChangeEvent } from 'react';
import { Upload, FileText } from 'lucide-react';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import Tombol from '@/komponen/ui/Tombol';
import Input from '@/komponen/ui/Input';
import Pilihan from '@/komponen/ui/Pilihan';
import TeksArea from '@/komponen/ui/TeksArea';
import Peringatan from '@/komponen/ui/Peringatan';
import { ajukanIzin } from '../api/izinApi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import type { OpsiPilihan } from '@/tipe/umum';

interface PropsFormPengajuan {
  terbuka: boolean;
  padaTutup: () => void;
  padaBerhasil: () => void;
}

const opsiJenis: OpsiPilihan[] = [
  { nilai: 'izin', label: 'Izin' },
  { nilai: 'sakit', label: 'Sakit' },
  { nilai: 'cuti', label: 'Cuti' },
];

/** Modal form pengajuan izin/sakit dengan upload dokumen opsional */
function FormPengajuanIzin({ terbuka, padaTutup, padaBerhasil }: PropsFormPengajuan) {
  const [jenisIzin, setJenisIzin] = useState<'izin' | 'sakit' | 'cuti'>('izin');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [alasan, setAlasan] = useState('');
  const [dokumen, setDokumen] = useState<File | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState('');

  const { sukses, gagal } = gunakanNotifikasi();

  /** Memvalidasi semua field sebelum submit */
  function validasiForm(): boolean {
    if (!tanggalMulai) { setPesanError('Tanggal mulai harus diisi'); return false; }
    if (!tanggalSelesai) { setPesanError('Tanggal selesai harus diisi'); return false; }
    if (tanggalSelesai < tanggalMulai) { setPesanError('Tanggal selesai tidak boleh sebelum tanggal mulai'); return false; }
    if (!alasan.trim()) { setPesanError('Alasan harus diisi'); return false; }
    return true;
  }

  /** Mengirim pengajuan izin ke API */
  async function kirimPengajuan() {
    if (!validasiForm()) return;

    setSedangMemuat(true);
    setPesanError('');

    try {
      await ajukanIzin(jenisIzin, tanggalMulai, tanggalSelesai, alasan, dokumen ?? undefined);
      sukses('Pengajuan terkirim', 'Pengajuan izin berhasil diajukan. Menunggu persetujuan admin.');
      padaBerhasil();
      resetForm();
    } catch (error) {
      const pesan = ambilPesanError(error);
      setPesanError(pesan);
      gagal('Gagal mengajukan', pesan);
    } finally {
      setSedangMemuat(false);
    }
  }

  /** Menangani perubahan file dokumen */
  function tanganiGantiDokumen(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setDokumen(file);
  }

  /** Reset semua state form */
  function resetForm() {
    setJenisIzin('izin');
    setTanggalMulai('');
    setTanggalSelesai('');
    setAlasan('');
    setDokumen(null);
    setPesanError('');
    padaTutup();
  }

  return (
    <Modal
      terbuka={terbuka}
      padaTutup={resetForm}
      judul="Ajukan Izin"
      deskripsi="Isi formulir pengajuan izin atau sakit"
    >
      <div className="space-y-4">
        {pesanError && <Peringatan varian="gagal">{pesanError}</Peringatan>}

        <Pilihan
          label="Jenis Izin"
          opsi={opsiJenis}
          value={jenisIzin}
          onChange={(e) => setJenisIzin(e.target.value as 'izin' | 'sakit' | 'cuti')}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Tanggal Mulai"
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            required
          />
          <Input
            label="Tanggal Selesai"
            type="date"
            value={tanggalSelesai}
            min={tanggalMulai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            required
          />
        </div>

        <TeksArea
          label="Alasan"
          placeholder="Jelaskan alasan izin Anda..."
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          rows={3}
          required
        />

        {/* Upload dokumen (opsional - untuk surat sakit/izin resmi) */}
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Dokumen Pendukung
            <span className="text-slate-400 font-normal ml-1">(opsional)</span>
          </p>

          <label className="flex items-center gap-3 p-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-primer-400 hover:bg-primer-50 dark:hover:bg-primer-900/20 transition-colors">
            {/* Ganti dengan ikon upload dari src/aset/gambar/upload-icon.svg */}
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Upload size={16} className="text-slate-500 dark:text-slate-400" />
            </div>
            <div>
              {dokumen ? (
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                  <FileText size={14} />
                  {dokumen.name}
                </p>
              ) : (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Upload surat dokter / izin resmi</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">JPG, PNG, atau PDF (maks 5MB)</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={tanganiGantiDokumen}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <FooterModal>
        <Tombol varian="sekunder" onClick={resetForm} disabled={sedangMemuat}>
          Batal
        </Tombol>
        <Tombol onClick={kirimPengajuan} sedangMemuat={sedangMemuat}>
          Ajukan Izin
        </Tombol>
      </FooterModal>
    </Modal>
  );
}

export default FormPengajuanIzin;
