import { useState, useEffect, useCallback } from 'react';
import { Send, Eye, X, Plus, Pencil, Trash2, Clock, UserCog } from 'lucide-react';
import { Kartu, HeaderKartu } from '@/komponen/ui/Kartu';
import Pilihan from '@/komponen/ui/Pilihan';
import Input from '@/komponen/ui/Input';
import InputRupiah from '@/komponen/ui/InputRupiah';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import Paginasi from '@/komponen/ui/Paginasi';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import Badge from '@/komponen/ui/Badge';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import { ambilDaftarPegawai } from '../api/adminApi';
import {
  ambilPengaturanGaji, buatPengaturanGaji, perbaruiPengaturanGaji, hapusPengaturanGaji,
  generateSlipGaji, ambilSemuaSlipGaji, ambilSlipGajiPerId,
  ambilJadwalKirim, simpanJadwalKirim,
} from '../api/gajiApi';
import type { PengaturanGaji, PengaturanGajiBody, SlipGaji, FilterSlipGaji, JadwalKirimGaji } from '@/tipe/gaji';
import { NAMA_BULAN } from '@/tipe/gaji';
import type { OpsiPilihan } from '@/tipe/umum';
import type { Pengguna } from '@/tipe/pengguna';

function formatRupiah(nilai: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(nilai);
}

const tahunSekarang = new Date().getFullYear();
const opsiTahun: OpsiPilihan[] = Array.from({ length: 3 }, (_, i) => ({
  nilai: String(tahunSekarang - i), label: String(tahunSekarang - i),
}));
const opsiSemua: OpsiPilihan[] = [{ nilai: '', label: 'Semua Bulan' }];
const opsiBulan: OpsiPilihan[] = NAMA_BULAN.map((nama, i) => ({ nilai: String(i + 1), label: nama }));
const opsiTanggalKirim: OpsiPilihan[] = Array.from({ length: 28 }, (_, i) => ({
  nilai: String(i + 1), label: `Tanggal ${i + 1}`,
}));

// ===== Modal Pengaturan Gaji =====

interface ModalPengaturanProps {
  pengaturan: PengaturanGaji | null;
  daftarPegawai: Pengguna[];
  daftarPengaturan: PengaturanGaji[];
  onTutup: () => void;
  onSimpan: () => void;
}

type ModeInput = 'rupiah' | 'persen';

/** Field gaji dengan toggle Rupiah / Persentase dari gaji pokok */
function FieldGajiFleksibel({
  label, gajiPokok, nilaiRupiah, onUbahRupiah,
}: {
  label: string;
  gajiPokok: number;
  nilaiRupiah: number;
  onUbahRupiah: (v: number) => void;
}) {
  const [mode, setMode] = useState<ModeInput>('rupiah');
  const [persen, setPersen] = useState(0);

  function gantiMode(modeBaru: ModeInput) {
    if (modeBaru === 'persen') {
      // Derivasi persentase dari nilai rupiah yang sudah ada
      const p = gajiPokok > 0 ? Math.round((nilaiRupiah / gajiPokok) * 100) : 0;
      setPersen(p);
      onUbahRupiah(Math.round(gajiPokok * p / 100));
    }
    setMode(modeBaru);
  }

  function ubahPersen(p: number) {
    const dibatasi = Math.min(100, Math.max(0, p));
    setPersen(dibatasi);
    onUbahRupiah(Math.round(gajiPokok * dibatasi / 100));
  }

  const kelasToggle = (aktif: boolean) =>
    `px-2.5 py-1 text-xs font-medium rounded transition-colors ${
      aktif
        ? 'bg-primer-600 text-white'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
    }`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <div className="flex gap-1 rounded-md overflow-hidden border border-slate-200 dark:border-slate-600">
          <button type="button" className={kelasToggle(mode === 'rupiah')} onClick={() => gantiMode('rupiah')}>Rp</button>
          <button type="button" className={kelasToggle(mode === 'persen')} onClick={() => gantiMode('persen')}>%</button>
        </div>
      </div>

      {mode === 'rupiah' ? (
        <InputRupiah label="" nilai={nilaiRupiah} onUbah={onUbahRupiah} />
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={persen}
              onChange={e => ubahPersen(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primer-500"
              placeholder="0"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">% dari gaji pokok</span>
          </div>
          {/* Tampilkan hasil kalkulasi — read-only */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">= Rupiah</span>
            <span className="text-sm font-semibold text-primer-600 dark:text-primer-400">
              {formatRupiah(nilaiRupiah)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalPengaturan({ pengaturan, daftarPegawai, daftarPengaturan, onTutup, onSimpan }: ModalPengaturanProps) {
  const [idPengguna, setIdPengguna] = useState<string>(pengaturan?.idPengguna ?? '');
  const [gajiPokok, setGajiPokok] = useState(Number(pengaturan?.gajiPokok ?? 0));
  const [tunjanganKehadiran, setTunjanganKehadiran] = useState(Number(pengaturan?.tunjanganKehadiran ?? 0));
  const [potonganPerJam, setPotonganPerJam] = useState(Number(pengaturan?.potonganPerJamTerlambat ?? 0));
  const [potonganCuti, setPotonganCuti] = useState(Number(pengaturan?.potonganPerHariCuti ?? 0));
  const [berlakuMulai, setBerlakuMulai] = useState(pengaturan?.berlakuMulai ?? '');
  const [aktif, setAktif] = useState(pengaturan?.aktif !== false);
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const { sukses } = gunakanNotifikasi();

  const scopeSudahAda = new Set(
    daftarPengaturan
      .filter(p => p.id !== pengaturan?.id)
      .map(p => p.idPengguna ?? '')
  );

  const opsiPegawai: OpsiPilihan[] = pengaturan
    ? [{ nilai: idPengguna, label: pengaturan.pegawai ? `${pengaturan.pegawai.nama} (${pengaturan.pegawai.idPegawai})` : 'Global (semua pegawai)' }]
    : [
        ...(!scopeSudahAda.has('') ? [{ nilai: '', label: 'Global (semua pegawai)' }] : []),
        ...daftarPegawai
          .filter(p => !scopeSudahAda.has(p.id))
          .map(p => ({ nilai: p.id, label: `${p.nama} (${p.idPegawai})` })),
      ];

  async function simpan() {
    if (!gajiPokok || !berlakuMulai) { setPesanError('Gaji pokok dan tanggal berlaku wajib diisi'); return; }
    setSedangMenyimpan(true);
    // Yang dikirim ke backend selalu nilai Rupiah, bukan persentase
    const body: PengaturanGajiBody = {
      idPengguna: idPengguna || null,
      gajiPokok, tunjanganKehadiran, potonganPerJamTerlambat: potonganPerJam,
      potonganPerHariCuti: potonganCuti, berlakuMulai, aktif,
    };
    try {
      if (pengaturan) {
        await perbaruiPengaturanGaji(pengaturan.id, body);
        sukses('Berhasil', 'Pengaturan gaji diperbarui');
      } else {
        await buatPengaturanGaji(body);
        sukses('Berhasil', 'Pengaturan gaji baru dibuat');
      }
      onSimpan();
    } catch (err) { setPesanError(ambilPesanError(err)); }
    finally { setSedangMenyimpan(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">
            {pengaturan ? 'Edit Pengaturan Gaji' : 'Tambah Pengaturan Gaji'}
          </h2>
          <button onClick={onTutup} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={18} /></button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {pesanError && <Peringatan varian="gagal">{pesanError}</Peringatan>}
          <Pilihan label="Berlaku Untuk" opsi={opsiPegawai} value={idPengguna} onChange={e => setIdPengguna(e.target.value)} disabled={!!pengaturan} />
          <InputRupiah label="Gaji Pokok (Rp)" nilai={gajiPokok} onUbah={setGajiPokok} required />
          <FieldGajiFleksibel
            label="Tunjangan Kehadiran"
            gajiPokok={gajiPokok}
            nilaiRupiah={tunjanganKehadiran}
            onUbahRupiah={setTunjanganKehadiran}
          />
          <FieldGajiFleksibel
            label="Potongan per Jam Terlambat"
            gajiPokok={gajiPokok}
            nilaiRupiah={potonganPerJam}
            onUbahRupiah={setPotonganPerJam}
          />
          <FieldGajiFleksibel
            label="Potongan per Hari Cuti"
            gajiPokok={gajiPokok}
            nilaiRupiah={potonganCuti}
            onUbahRupiah={setPotonganCuti}
          />
          <Input label="Berlaku Mulai" type="date" value={berlakuMulai} onChange={e => setBerlakuMulai(e.target.value)} required />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={aktif} onChange={e => setAktif(e.target.checked)} className="w-4 h-4 accent-primer-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Aktif</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-200 dark:border-slate-700">
          <Tombol varian="sekunder" onClick={onTutup}>Batal</Tombol>
          <Tombol sedangMemuat={sedangMenyimpan} onClick={simpan}>Simpan</Tombol>
        </div>
      </div>
    </div>
  );
}

// ===== Modal Detail Slip =====

function BarisPenggajian({ label, nilai, merah }: { label: string; nilai: number; merah?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <span className={`text-sm font-semibold ${merah ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>
        {merah && nilai > 0 ? `- ${formatRupiah(nilai)}` : formatRupiah(nilai)}
      </span>
    </div>
  );
}

function ModalDetailSlip({ idSlip, onTutup }: { idSlip: string; onTutup: () => void }) {
  const [slip, setSlip] = useState<SlipGaji | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  useEffect(() => { ambilSlipGajiPerId(idSlip).then(setSlip).finally(() => setSedangMemuat(false)); }, [idSlip]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Detail Slip Gaji</h2>
          <button onClick={onTutup} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={18} /></button>
        </div>
        <div className="px-5 py-4">
          {sedangMemuat ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-8 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />)}</div>
          ) : slip ? (
            <>
              {slip.pengguna && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <AvatarPengguna nama={slip.pengguna.nama} urlFoto={slip.pengguna.urlFoto} ukuran="sedang" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{slip.pengguna.nama}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{NAMA_BULAN[slip.bulan - 1]} {slip.tahun}</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Hadir {slip.jumlahHadir} hari · Terlambat {slip.totalMenitTerlambat} mnt · Cuti {slip.jumlahHariCuti} hari
              </p>
              <BarisPenggajian label="Gaji Pokok" nilai={Number(slip.gajiPokok)} />
              <BarisPenggajian label="Tunjangan Kehadiran" nilai={Number(slip.tunjanganKehadiran)} />
              <BarisPenggajian label="Potongan Keterlambatan" nilai={Number(slip.totalPotonganKeterlambatan)} merah />
              <BarisPenggajian label="Potongan Cuti" nilai={Number(slip.totalPotonganCuti)} merah />
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Total Gaji</span>
                <span className="text-lg font-bold text-primer-600 dark:text-primer-400">{formatRupiah(Number(slip.totalGaji))}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Data tidak ditemukan</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Halaman Utama =====

function HalamanGajiAdmin() {
  const [daftarPengaturan, setDaftarPengaturan] = useState<PengaturanGaji[]>([]);
  const [memuatPengaturan, setMemuatPengaturan] = useState(true);
  const [modalPengaturan, setModalPengaturan] = useState<{ buka: boolean; data: PengaturanGaji | null }>({ buka: false, data: null });
  const [daftarPegawai, setDaftarPegawai] = useState<Pengguna[]>([]);

  // Generate
  const [bulanGenerate, setBulanGenerate] = useState(String(new Date().getMonth() + 1));
  const [tahunGenerate, setTahunGenerate] = useState(String(tahunSekarang));
  const [pegawaiGenerate, setPegawaiGenerate] = useState('');
  const [sedangGenerate, setSedangGenerate] = useState(false);
  const [pesanGenerate, setPesanGenerate] = useState('');
  const [errorGenerate, setErrorGenerate] = useState('');

  // Jadwal kirim
  const [jadwal, setJadwal] = useState<JadwalKirimGaji | null>(null);
  const [tanggalJadwal, setTanggalJadwal] = useState('1');
  const [aktifJadwal, setAktifJadwal] = useState(false);
  const [sedangSimpanJadwal, setSedangSimpanJadwal] = useState(false);

  // Daftar slip
  const [daftarSlip, setDaftarSlip] = useState<SlipGaji[]>([]);
  const [memuatSlip, setMemuatSlip] = useState(true);
  const [totalSlip, setTotalSlip] = useState(0);
  const [totalHalamanSlip, setTotalHalamanSlip] = useState(1);
  const [filterSlip, setFilterSlip] = useState<FilterSlipGaji>({ halaman: 1, batas: 10 });
  const [idSlipDetail, setIdSlipDetail] = useState<string | null>(null);

  const { sukses, gagal } = gunakanNotifikasi();

  const muatPengaturan = useCallback(async () => {
    setMemuatPengaturan(true);
    try { setDaftarPengaturan(await ambilPengaturanGaji()); } catch { }
    finally { setMemuatPengaturan(false); }
  }, []);

  const muatSlip = useCallback(async () => {
    setMemuatSlip(true);
    try {
      const h = await ambilSemuaSlipGaji(filterSlip);
      setDaftarSlip(h.baris); setTotalSlip(h.total); setTotalHalamanSlip(h.totalHalaman);
    } catch { setDaftarSlip([]); }
    finally { setMemuatSlip(false); }
  }, [filterSlip]);

  useEffect(() => { muatPengaturan(); }, [muatPengaturan]);
  useEffect(() => { muatSlip(); }, [muatSlip]);
  useEffect(() => {
    ambilDaftarPegawai({ batas: 200 }).then(r => setDaftarPegawai(r.baris)).catch(() => {});
    ambilJadwalKirim().then(j => {
      if (j) { setJadwal(j); setTanggalJadwal(String(j.tanggalKirim)); setAktifJadwal(j.aktif); }
    }).catch(() => {});
  }, []);

  const opsiPegawaiGenerate: OpsiPilihan[] = [
    { nilai: '', label: 'Semua Pegawai' },
    ...daftarPegawai.map(p => ({ nilai: p.id, label: `${p.nama} (${p.idPegawai})` })),
  ];

  async function tanganiGenerate() {
    setSedangGenerate(true); setPesanGenerate(''); setErrorGenerate('');
    try {
      const hasil = await generateSlipGaji(Number(bulanGenerate), Number(tahunGenerate), pegawaiGenerate || undefined);
      sukses('Berhasil', `${hasil.length} slip gaji berhasil dibuat`);
      setPesanGenerate(`${hasil.length} slip untuk ${NAMA_BULAN[Number(bulanGenerate) - 1]} ${tahunGenerate} berhasil dibuat`);
      muatSlip();
    } catch (err) { const m = ambilPesanError(err); setErrorGenerate(m); gagal('Gagal', m); }
    finally { setSedangGenerate(false); }
  }

  async function tanganiHapusPengaturan(id: string) {
    try {
      await hapusPengaturanGaji(id);
      sukses('Berhasil', 'Pengaturan gaji dihapus');
      muatPengaturan();
    } catch (err) { gagal('Gagal', ambilPesanError(err)); }
  }

  async function tanganiSimpanJadwal() {
    setSedangSimpanJadwal(true);
    try {
      const j = await simpanJadwalKirim(Number(tanggalJadwal), aktifJadwal);
      setJadwal(j);
      sukses('Berhasil', `Jadwal kirim ${aktifJadwal ? 'aktif' : 'dinonaktifkan'} setiap tanggal ${tanggalJadwal}`);
    } catch (err) { gagal('Gagal', ambilPesanError(err)); }
    finally { setSedangSimpanJadwal(false); }
  }

  return (
    <div className="space-y-6 animate-masuk-bawah">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Penggajian</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola pengaturan dan slip gaji pegawai</p>
      </div>

      {/* Pengaturan Gaji */}
      <Kartu>
        <HeaderKartu
          judul="Pengaturan Gaji"
          subJudul="Konfigurasi komponen gaji (global atau per-pegawai)"
          aksi={
            <Tombol
              ukuran="kecil"
              onClick={() => setModalPengaturan({ buka: true, data: null })}
              disabled={daftarPengaturan.length >= 1 + daftarPegawai.length}
            >
              <Plus size={14} /> Tambah
            </Tombol>
          }
        />
        {memuatPengaturan ? <SkeletonKartu /> : daftarPengaturan.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Belum ada pengaturan gaji.</p>
        ) : (
          <div className="space-y-2">
            {daftarPengaturan.map((p) => (
              <div key={p.id} className={`flex items-start justify-between gap-3 p-3 rounded-lg border ${p.aktif ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 opacity-60'}`}>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.pegawai ? (
                      <div className="flex items-center gap-1.5">
                        <UserCog size={13} className="text-primer-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.pegawai.nama}</span>
                      </div>
                    ) : (
                      <Badge varian="biru">Global</Badge>
                    )}
                    {!p.aktif && <Badge varian="abu">Nonaktif</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Berlaku {new Date(p.berlakuMulai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pokok {formatRupiah(Number(p.gajiPokok))} · Tunjangan {formatRupiah(Number(p.tunjanganKehadiran))}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Pot. terlambat {formatRupiah(Number(p.potonganPerJamTerlambat))}/jam · Cuti {formatRupiah(Number(p.potonganPerHariCuti))}/hari
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setModalPengaturan({ buka: true, data: p })} className="p-1.5 rounded-md text-slate-400 hover:text-primer-600 hover:bg-primer-50 dark:hover:bg-primer-900/20 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => tanganiHapusPengaturan(p.id)} className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Kartu>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate / Manual Kirim */}
        <Kartu>
          <HeaderKartu judul="Kirim Slip Gaji" subJudul="Generate dan kirim slip ke pegawai" />
          {pesanGenerate && <div className="mb-3"><Peringatan varian="sukses">{pesanGenerate}</Peringatan></div>}
          {errorGenerate && <div className="mb-3"><Peringatan varian="gagal">{errorGenerate}</Peringatan></div>}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Pilihan label="Bulan" opsi={opsiBulan} value={bulanGenerate} onChange={e => setBulanGenerate(e.target.value)} />
              <Pilihan label="Tahun" opsi={opsiTahun} value={tahunGenerate} onChange={e => setTahunGenerate(e.target.value)} />
            </div>
            <Pilihan label="Pegawai" opsi={opsiPegawaiGenerate} value={pegawaiGenerate} onChange={e => setPegawaiGenerate(e.target.value)} />
            <Tombol onClick={tanganiGenerate} sedangMemuat={sedangGenerate} className="w-full">
              <Send size={15} />
              {pegawaiGenerate ? 'Kirim ke Pegawai Ini' : 'Kirim ke Semua Pegawai'}
            </Tombol>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Slip yang sudah ada untuk periode ini akan diperbarui otomatis.</p>
        </Kartu>

        {/* Jadwal Kirim Otomatis */}
        <Kartu>
          <HeaderKartu judul="Jadwal Kirim Otomatis" subJudul="Kirim slip otomatis setiap bulan" />
          <div className="space-y-3">
            <Pilihan label="Tanggal Kirim Setiap Bulan" opsi={opsiTanggalKirim} value={tanggalJadwal} onChange={e => setTanggalJadwal(e.target.value)} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={aktifJadwal} onChange={e => setAktifJadwal(e.target.checked)} className="w-4 h-4 accent-primer-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Aktifkan pengiriman otomatis</span>
            </label>
            <Tombol onClick={tanganiSimpanJadwal} sedangMemuat={sedangSimpanJadwal} varian="sekunder" className="w-full">
              <Clock size={15} />
              Simpan Jadwal
            </Tombol>
            {jadwal && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {jadwal.aktif ? `Aktif: kirim setiap tanggal ${jadwal.tanggalKirim}` : 'Jadwal nonaktif'}
              </p>
            )}
          </div>
        </Kartu>
      </div>

      {/* Daftar Slip Gaji */}
      <Kartu tanpaPadding>
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Semua Slip Gaji</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total {totalSlip} slip</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Pilihan label="Filter Bulan" opsi={[...opsiSemua, ...opsiBulan]} value={String(filterSlip.bulan ?? '')}
              onChange={e => setFilterSlip(p => ({ ...p, bulan: e.target.value ? Number(e.target.value) : undefined, halaman: 1 }))} />
            <Pilihan label="Filter Tahun" opsi={[{ nilai: '', label: 'Semua' }, ...opsiTahun]} value={String(filterSlip.tahun ?? '')}
              onChange={e => setFilterSlip(p => ({ ...p, tahun: e.target.value ? Number(e.target.value) : undefined, halaman: 1 }))} />
          </div>
        </div>
        {memuatSlip ? (
          <div className="p-5 space-y-2">{[1,2,3].map(i => <SkeletonKartu key={i} />)}</div>
        ) : (
          <>
            <Tabel>
              <HeaderTabel>
                <tr>
                  <SelHeader>Pegawai</SelHeader>
                  <SelHeader>Periode</SelHeader>
                  <SelHeader>Gaji Pokok</SelHeader>
                  <SelHeader>Tunjangan</SelHeader>
                  <SelHeader>Potongan</SelHeader>
                  <SelHeader>Total</SelHeader>
                  <SelHeader>Aksi</SelHeader>
                </tr>
              </HeaderTabel>
              <BagiTabel>
                {daftarSlip.length === 0 ? <TabelKosong pesan="Belum ada slip gaji" kolomSpan={7} /> : daftarSlip.map(slip => (
                  <BarisTabel key={slip.id}>
                    <SelData>
                      {slip.pengguna ? (
                        <div className="flex items-center gap-2">
                          <AvatarPengguna nama={slip.pengguna.nama} urlFoto={slip.pengguna.urlFoto} ukuran="kecil" />
                          <div>
                            <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{slip.pengguna.nama}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{slip.pengguna.idPegawai}</p>
                          </div>
                        </div>
                      ) : <span className="text-slate-400 text-xs">-</span>}
                    </SelData>
                    <SelData className="whitespace-nowrap text-sm">{NAMA_BULAN[slip.bulan - 1]} {slip.tahun}</SelData>
                    <SelData className="whitespace-nowrap text-sm">{formatRupiah(Number(slip.gajiPokok))}</SelData>
                    <SelData className="text-sm text-emerald-600 dark:text-emerald-400 whitespace-nowrap">+{formatRupiah(Number(slip.tunjanganKehadiran))}</SelData>
                    <SelData className="text-sm text-red-500 whitespace-nowrap">-{formatRupiah(Number(slip.totalPotonganKeterlambatan) + Number(slip.totalPotonganCuti))}</SelData>
                    <SelData className="font-semibold text-primer-600 dark:text-primer-400 whitespace-nowrap">{formatRupiah(Number(slip.totalGaji))}</SelData>
                    <SelData>
                      <Tombol varian="hantu" ukuran="kecil" onClick={() => setIdSlipDetail(slip.id)} className="text-slate-500 hover:text-primer-600">
                        <Eye size={14} />
                      </Tombol>
                    </SelData>
                  </BarisTabel>
                ))}
              </BagiTabel>
            </Tabel>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <Paginasi halamanAktif={filterSlip.halaman ?? 1} totalHalaman={totalHalamanSlip}
                padaGantiHalaman={h => setFilterSlip(p => ({ ...p, halaman: h }))} />
            </div>
          </>
        )}
      </Kartu>

      {modalPengaturan.buka && (
        <ModalPengaturan
          pengaturan={modalPengaturan.data}
          daftarPegawai={daftarPegawai}
          daftarPengaturan={daftarPengaturan}
          onTutup={() => setModalPengaturan({ buka: false, data: null })}
          onSimpan={() => { setModalPengaturan({ buka: false, data: null }); muatPengaturan(); }}
        />
      )}
      {idSlipDetail && <ModalDetailSlip idSlip={idSlipDetail} onTutup={() => setIdSlipDetail(null)} />}
    </div>
  );
}

export default HalamanGajiAdmin;
