import { useState, useEffect } from 'react';
import { Kartu } from '@/komponen/ui/Kartu';
import Pilihan from '@/komponen/ui/Pilihan';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import { ambilSlipGajiSaya } from '@/fitur/admin/api/gajiApi';
import type { SlipGaji } from '@/tipe/gaji';
import { NAMA_BULAN } from '@/tipe/gaji';
import type { OpsiPilihan } from '@/tipe/umum';

function formatRupiah(nilai: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(nilai);
}

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

const tahunSekarang = new Date().getFullYear();
const opsiTahun: OpsiPilihan[] = Array.from({ length: 3 }, (_, i) => ({
  nilai: String(tahunSekarang - i),
  label: String(tahunSekarang - i),
}));

const opsiSemua: OpsiPilihan[] = [{ nilai: '', label: 'Semua Bulan' }];
const opsiBulan: OpsiPilihan[] = NAMA_BULAN.map((nama, i) => ({ nilai: String(i + 1), label: nama }));

/** Halaman slip gaji pegawai */
function HalamanGaji() {
  const [daftarSlip, setDaftarSlip] = useState<SlipGaji[]>([]);
  const [slipDipilih, setSlipDipilih] = useState<SlipGaji | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState(String(tahunSekarang));

  const { gagal } = gunakanNotifikasi();

  useEffect(() => {
    async function muat() {
      setSedangMemuat(true);
      try {
        const hasil = await ambilSlipGajiSaya(
          bulan ? parseInt(bulan) : undefined,
          tahun ? parseInt(tahun) : undefined
        );
        const list = Array.isArray(hasil) ? hasil : [hasil];
        setDaftarSlip(list);
        setSlipDipilih(list.length === 1 ? list[0] : null);
      } catch (err) {
        setDaftarSlip([]);
        setSlipDipilih(null);
      } finally {
        setSedangMemuat(false);
      }
    }
    muat();
  }, [bulan, tahun, gagal]);

  return (
    <div className="space-y-5 animate-masuk-bawah">
      {/* Filter */}
      <div className="grid grid-cols-2 gap-3">
        <Pilihan
          label="Tahun"
          opsi={opsiTahun}
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
        />
        <Pilihan
          label="Bulan"
          opsi={[...opsiSemua, ...opsiBulan]}
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
        />
      </div>

      {sedangMemuat ? (
        <SkeletonKartu />
      ) : daftarSlip.length === 0 ? (
        <Kartu>
          <p className="text-sm text-slate-500 text-center py-4">Belum ada slip gaji untuk periode ini</p>
        </Kartu>
      ) : (
        <>
          {/* Daftar slip (jika lebih dari 1) */}
          {daftarSlip.length > 1 && (
            <div className="space-y-2">
              {daftarSlip.map((slip) => (
                <button
                  key={slip.id}
                  onClick={() => setSlipDipilih(slip)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    slipDipilih?.id === slip.id
                      ? 'border-primer-500 bg-primer-50 dark:bg-primer-900/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {NAMA_BULAN[slip.bulan - 1]} {slip.tahun}
                  </p>
                  <p className="text-sm text-primer-600 dark:text-primer-400 font-medium mt-0.5">
                    {formatRupiah(slip.totalGaji)}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Detail slip dipilih */}
          {slipDipilih && (
            <Kartu>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Slip Gaji — {NAMA_BULAN[slipDipilih.bulan - 1]} {slipDipilih.tahun}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hadir {slipDipilih.jumlahHadir} hari · Terlambat {slipDipilih.totalMenitTerlambat} mnt · Cuti {slipDipilih.jumlahHariCuti} hari
                </p>
              </div>

              <div className="space-y-0">
                <BarisPenggajian label="Gaji Pokok" nilai={Number(slipDipilih.gajiPokok)} />
                <BarisPenggajian label="Tunjangan Kehadiran" nilai={Number(slipDipilih.tunjanganKehadiran)} />
                <BarisPenggajian label="Potongan Keterlambatan" nilai={Number(slipDipilih.totalPotonganKeterlambatan)} merah />
                <BarisPenggajian label="Potongan Cuti" nilai={Number(slipDipilih.totalPotonganCuti)} merah />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Total Gaji</span>
                <span className="text-xl font-bold text-primer-600 dark:text-primer-400">
                  {formatRupiah(Number(slipDipilih.totalGaji))}
                </span>
              </div>
            </Kartu>
          )}
        </>
      )}
    </div>
  );
}

export default HalamanGaji;
