import { useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { ambilRekapAbsensi, koreksiAbsensi, ambilDetailAbsensi } from '../api/adminApi';
import { Kartu } from '@/komponen/ui/Kartu';
import Input from '@/komponen/ui/Input';
import Pilihan from '@/komponen/ui/Pilihan';
import Tombol from '@/komponen/ui/Tombol';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import { BadgeStatusAbsensi } from '@/komponen/ui/Badge';
import Paginasi from '@/komponen/ui/Paginasi';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import type { Absensi, FilterAbsensi, KoreksiAbsensi as TipeKoreksi } from '@/tipe/absensi';
import type { OpsiPilihan } from '@/tipe/umum';
import { formatTanggal, formatWaktu, formatUntukInput } from '@/utils/formatTanggal';

const opsiStatus: OpsiPilihan[] = [
  { nilai: '', label: 'Semua Status' },
  { nilai: 'hadir', label: 'Hadir' },
  { nilai: 'izin', label: 'Izin' },
  { nilai: 'sakit', label: 'Sakit' },
  { nilai: 'alpa', label: 'Alpa' },
];

const opsiStatusKoreksi: OpsiPilihan[] = [
  { nilai: 'hadir', label: 'Hadir' },
  { nilai: 'izin', label: 'Izin' },
  { nilai: 'sakit', label: 'Sakit' },
  { nilai: 'alpa', label: 'Alpa' },
];

/** Halaman manajemen absensi admin */
function HalamanAbsensiAdmin() {
  const [daftarAbsensi, setDaftarAbsensi] = useState<Absensi[]>([]);
  const [totalHalaman, setTotalHalaman] = useState(1);
  const [total, setTotal] = useState(0);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [filter, setFilter] = useState<FilterAbsensi>({
    halaman: 1,
    batas: 10,
    tanggalMulai: formatUntukInput(new Date()),
    tanggalSelesai: formatUntukInput(new Date()),
  });
  const [absensiDiedit, setAbsensiDiedit] = useState<Absensi | null>(null);
  const [absensiDetail, setAbsensiDetail] = useState<Absensi | null>(null);
  const [koreksiStatus, setKoreksiStatus] = useState<string>('hadir');
  const [koreksiCatatan, setKoreksiCatatan] = useState('');
  const [sedangKoreksi, setSedangKoreksi] = useState(false);

  const { sukses, gagal } = gunakanNotifikasi();

  const muatData = useCallback(async (filterBaru: FilterAbsensi) => {
    setSedangMemuat(true);
    try {
      const data = await ambilRekapAbsensi(filterBaru);
      setDaftarAbsensi(data.baris ?? []);
      setTotal(data.total);
      setTotalHalaman(data.totalHalaman);
    } catch (err) {
      gagal('Gagal memuat data', ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }, [gagal]);

  useEffect(() => { muatData(filter); }, [filter, muatData]);

  function terapkanFilter(filterBaru: Partial<FilterAbsensi>) {
    setFilter((prev) => ({ ...prev, ...filterBaru, halaman: 1 }));
  }

  async function bukaDetail(id: string) {
    try {
      const detail = await ambilDetailAbsensi(id);
      setAbsensiDetail(detail);
    } catch (err) {
      gagal('Gagal memuat detail', ambilPesanError(err));
    }
  }

  /** Menyimpan koreksi absensi */
  async function simpanKoreksi() {
    if (!absensiDiedit) return;
    setSedangKoreksi(true);
    try {
      await koreksiAbsensi(absensiDiedit.id, {
        status: koreksiStatus as any,
        catatan: koreksiCatatan || undefined,
      } as TipeKoreksi);
      sukses('Absensi berhasil dikoreksi');
      setAbsensiDiedit(null);
      muatData(filter);
    } catch (err) {
      gagal('Gagal mengoreksi', ambilPesanError(err));
    } finally {
      setSedangKoreksi(false);
    }
  }

  return (
    <div className="space-y-5 animate-masuk-bawah">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manajemen Absensi</h1>
        <p className="text-sm text-slate-500 mt-0.5">Total {total} data absensi</p>
      </div>

      {/* Filter */}
      <Kartu>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <Pilihan
            label="Status"
            opsi={opsiStatus}
            value={filter.status ?? ''}
            onChange={(e) => terapkanFilter({ status: (e.target.value as any) || undefined })}
          />
        </div>
      </Kartu>

      {/* Tabel */}
      {sedangMemuat ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <SkeletonKartu key={i} />)}</div>
      ) : (
        <Kartu tanpaPadding>
          <Tabel>
            <HeaderTabel>
              <tr>
                <SelHeader>Pegawai</SelHeader>
                <SelHeader>Tanggal</SelHeader>
                <SelHeader>Masuk</SelHeader>
                <SelHeader>Keluar</SelHeader>
                <SelHeader>Ket.</SelHeader>
                <SelHeader>Status</SelHeader>
                <SelHeader>Aksi</SelHeader>
              </tr>
            </HeaderTabel>
            <BagiTabel>
              {daftarAbsensi.length === 0 ? (
                <TabelKosong pesan="Tidak ada data absensi" kolomSpan={7} />
              ) : (
                daftarAbsensi.map((a) => (
                  <BarisTabel key={a.id}>
                    <SelData>
                      <div className="flex items-center gap-2">
                        {a.pengguna && <AvatarPengguna nama={a.pengguna.nama} ukuran="kecil" urlFoto={a.pengguna.urlFoto} />}
                        <span className="font-medium text-sm">{a.pengguna?.nama ?? '-'}</span>
                      </div>
                    </SelData>
                    <SelData>{formatTanggal(a.tanggal)}</SelData>
                    <SelData className="text-emerald-600">{a.waktuMasuk ? formatWaktu(a.waktuMasuk) : '-'}</SelData>
                    <SelData className="text-amber-600">{a.waktuKeluar ? formatWaktu(a.waktuKeluar) : '-'}</SelData>
                    <SelData>
                      {a.keterlambatan > 0 ? (
                        <span className="text-xs text-amber-600 font-medium">+{a.keterlambatan} mnt</span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </SelData>
                    <SelData><BadgeStatusAbsensi status={a.status} /></SelData>
                    <SelData>
                      <div className="flex items-center gap-1">
                        <Tombol
                          varian="hantu"
                          ukuran="kecil"
                          onClick={() => bukaDetail(a.id)}
                          title="Lihat detail"
                        >
                          <Eye size={14} />
                        </Tombol>
                        <Tombol
                          varian="hantu"
                          ukuran="kecil"
                          onClick={() => { setAbsensiDiedit(a); setKoreksiStatus(a.status); setKoreksiCatatan(a.catatan ?? ''); }}
                        >
                          Koreksi
                        </Tombol>
                      </div>
                    </SelData>
                  </BarisTabel>
                ))
              )}
            </BagiTabel>
          </Tabel>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <Paginasi
              halamanAktif={filter.halaman ?? 1}
              totalHalaman={totalHalaman}
              padaGantiHalaman={(h) => setFilter((prev) => ({ ...prev, halaman: h }))}
            />
          </div>
        </Kartu>
      )}

      {/* Modal detail absensi */}
      <Modal
        terbuka={absensiDetail != null}
        padaTutup={() => setAbsensiDetail(null)}
        judul="Detail Absensi"
      >
        {absensiDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {absensiDetail.pengguna && (
                <AvatarPengguna nama={absensiDetail.pengguna.nama} ukuran="besar" urlFoto={absensiDetail.pengguna.urlFoto} />
              )}
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{absensiDetail.pengguna?.nama ?? '-'}</p>
                <p className="text-xs text-slate-500">{absensiDetail.pengguna?.idPegawai} · {absensiDetail.pengguna?.departemen}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Tanggal</p>
                <p className="font-medium">{formatTanggal(absensiDetail.tanggal)}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <BadgeStatusAbsensi status={absensiDetail.status} />
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Waktu Masuk</p>
                <p className="font-semibold text-emerald-700">{absensiDetail.waktuMasuk ? formatWaktu(absensiDetail.waktuMasuk) : '-'}</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Waktu Keluar</p>
                <p className="font-semibold text-amber-700">{absensiDetail.waktuKeluar ? formatWaktu(absensiDetail.waktuKeluar) : '-'}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg col-span-2">
                <p className="text-xs text-slate-500 mb-1">Keterlambatan</p>
                <p className={`font-medium ${absensiDetail.keterlambatan > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {absensiDetail.keterlambatan > 0 ? `${absensiDetail.keterlambatan} menit terlambat` : 'Tepat waktu'}
                </p>
              </div>
            </div>

            {absensiDetail.catatan && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Catatan</p>
                <p className="text-sm">{absensiDetail.catatan}</p>
              </div>
            )}

            {absensiDetail.urlFoto && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Foto Selfie</p>
                <img
                  src={absensiDetail.urlFoto}
                  alt="Foto absensi"
                  className="w-32 h-32 rounded-xl object-cover border border-slate-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        )}
        <FooterModal>
          <Tombol onClick={() => setAbsensiDetail(null)}>Tutup</Tombol>
        </FooterModal>
      </Modal>

      {/* Modal koreksi */}
      <Modal
        terbuka={absensiDiedit != null}
        padaTutup={() => setAbsensiDiedit(null)}
        judul="Koreksi Absensi"
        ukuran="kecil"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Mengoreksi absensi <strong>{absensiDiedit?.pengguna?.nama}</strong> pada tanggal{' '}
            {absensiDiedit ? formatTanggal(absensiDiedit.tanggal) : ''}
          </p>
          <Pilihan
            label="Status"
            opsi={opsiStatusKoreksi}
            value={koreksiStatus}
            onChange={(e) => setKoreksiStatus(e.target.value)}
          />
          <Input
            label="Catatan (opsional)"
            placeholder="Alasan koreksi..."
            value={koreksiCatatan}
            onChange={(e) => setKoreksiCatatan(e.target.value)}
          />
        </div>
        <FooterModal>
          <Tombol varian="sekunder" onClick={() => setAbsensiDiedit(null)}>Batal</Tombol>
          <Tombol onClick={simpanKoreksi} sedangMemuat={sedangKoreksi}>Simpan Koreksi</Tombol>
        </FooterModal>
      </Modal>
    </div>
  );
}

export default HalamanAbsensiAdmin;
