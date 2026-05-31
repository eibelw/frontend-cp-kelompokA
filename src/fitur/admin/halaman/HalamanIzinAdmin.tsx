import { useState } from 'react';
import { Check, X, Eye, FileText, Calendar, User, Clock } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import Pilihan from '@/komponen/ui/Pilihan';
import Tombol from '@/komponen/ui/Tombol';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import { BadgeStatusIzin, BadgeJenisIzin } from '@/komponen/ui/Badge';
import Paginasi from '@/komponen/ui/Paginasi';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import { gunakanManajemenIzin } from '../hooks/gunakanManajemenIzin';
import { formatTanggal } from '@/utils/formatTanggal';
import type { OpsiPilihan } from '@/tipe/umum';
import type { Izin } from '@/tipe/izin';

const opsiStatus: OpsiPilihan[] = [
  { nilai: '', label: 'Semua Status' },
  { nilai: 'menunggu', label: 'Menunggu' },
  { nilai: 'disetujui', label: 'Disetujui' },
  { nilai: 'ditolak', label: 'Ditolak' },
];

function hitungDurasi(mulai: string, selesai: string): number {
  const selisihMs = new Date(selesai).getTime() - new Date(mulai).getTime();
  return Math.floor(selisihMs / 86400000) + 1;
}

// ===== Modal Detail Izin =====

interface PropsModalDetail {
  izin: Izin;
  onTutup: () => void;
  onSetujui: (id: string) => void;
  onTolak: (id: string) => void;
}

function ModalDetailIzin({ izin, onTutup, onSetujui, onTolak }: PropsModalDetail) {
  const durasi = hitungDurasi(izin.tanggalMulai, izin.tanggalSelesai);

  return (
    <Modal terbuka padaTutup={onTutup} judul="Detail Pengajuan Izin" ukuran="sedang">
      <div className="space-y-4">

        {/* Info pegawai */}
        {izin.pengguna && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40">
            <AvatarPengguna nama={izin.pengguna.nama} urlFoto={izin.pengguna.urlFoto} ukuran="sedang" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{izin.pengguna.nama}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {izin.pengguna.idPegawai}
                {izin.pengguna.departemen && ` · ${izin.pengguna.departemen}`}
                {izin.pengguna.jabatan && ` · ${izin.pengguna.jabatan}`}
              </p>
            </div>
          </div>
        )}

        {/* Jenis & Status */}
        <div className="flex items-center gap-3">
          <BadgeJenisIzin jenis={izin.jenisIzin} />
          <BadgeStatusIzin status={izin.status} />
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Calendar size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tanggal Mulai</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatTanggal(izin.tanggalMulai)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tanggal Selesai</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatTanggal(izin.tanggalSelesai)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Durasi</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {durasi} hari
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tanggal Pengajuan</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatTanggal(izin.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Alasan */}
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Alasan</p>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/40 rounded-lg px-3 py-2">
            {izin.alasan}
          </p>
        </div>

        {/* Dokumen */}
        {izin.urlDokumen ? (
          <a
            href={izin.urlDokumen}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primer-600 dark:text-primer-400 hover:underline font-medium"
          >
            <FileText size={15} />
            Lihat Dokumen Pendukung
          </a>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500 italic">Tidak ada dokumen pendukung</p>
        )}

        {/* Penyetuju */}
        {izin.penyetuju && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <User size={13} className="text-slate-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {izin.status === 'disetujui' ? 'Disetujui' : 'Ditolak'} oleh{' '}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {izin.penyetuju.nama}
              </span>
            </p>
          </div>
        )}
      </div>

      <FooterModal>
        <Tombol varian="sekunder" onClick={onTutup}>Tutup</Tombol>
        {izin.status === 'menunggu' && (
          <>
            <Tombol
              varian="bahaya"
              onClick={() => { onTolak(izin.id); onTutup(); }}
            >
              <X size={15} />
              Tolak
            </Tombol>
            <Tombol
              onClick={() => { onSetujui(izin.id); onTutup(); }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Check size={15} />
              Setujui
            </Tombol>
          </>
        )}
      </FooterModal>
    </Modal>
  );
}

// ===== Halaman Utama =====

function HalamanIzinAdmin() {
  const [izinDetail, setIzinDetail] = useState<Izin | null>(null);

  const {
    daftarIzin,
    totalHalaman,
    total,
    sedangMemuat,
    filter,
    gantiHalaman,
    terapkanFilter,
    tanganiSetujui,
    tanganiTolak,
  } = gunakanManajemenIzin();

  return (
    <div className="space-y-5 animate-masuk-bawah">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pengajuan Izin</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Total {total} pengajuan</p>
      </div>

      {/* Filter */}
      <Kartu>
        <Pilihan
          label="Filter Status"
          opsi={opsiStatus}
          value={filter.status ?? ''}
          onChange={(e) => terapkanFilter({ status: (e.target.value as any) || undefined })}
        />
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
                <SelHeader>Jenis</SelHeader>
                <SelHeader>Periode</SelHeader>
                <SelHeader>Alasan</SelHeader>
                <SelHeader>Status</SelHeader>
                <SelHeader>Aksi</SelHeader>
              </tr>
            </HeaderTabel>
            <BagiTabel>
              {daftarIzin.length === 0 ? (
                <TabelKosong pesan="Tidak ada pengajuan izin" kolomSpan={6} />
              ) : (
                daftarIzin.map((izin) => (
                  <BarisTabel key={izin.id}>
                    <SelData>
                      <div className="flex items-center gap-2">
                        {izin.pengguna && <AvatarPengguna nama={izin.pengguna.nama} ukuran="kecil" />}
                        <div>
                          <p className="font-medium text-sm">{izin.pengguna?.nama ?? '-'}</p>
                          <p className="text-xs text-slate-400">{izin.pengguna?.departemen ?? ''}</p>
                        </div>
                      </div>
                    </SelData>
                    <SelData><BadgeJenisIzin jenis={izin.jenisIzin} /></SelData>
                    <SelData className="whitespace-nowrap text-xs">
                      <p>{formatTanggal(izin.tanggalMulai)}</p>
                      <p className="text-slate-400">s.d. {formatTanggal(izin.tanggalSelesai)}</p>
                    </SelData>
                    <SelData className="max-w-[180px]">
                      <p className="text-sm truncate" title={izin.alasan}>{izin.alasan}</p>
                    </SelData>
                    <SelData><BadgeStatusIzin status={izin.status} /></SelData>
                    <SelData>
                      <div className="flex items-center gap-1">
                        {/* Detail — selalu tampil untuk semua status */}
                        <Tombol
                          varian="hantu"
                          ukuran="kecil"
                          onClick={() => setIzinDetail(izin)}
                          title="Lihat detail"
                          className="text-slate-500 hover:text-primer-600"
                        >
                          <Eye size={14} />
                        </Tombol>

                        {/* Approve / Reject langsung dari tabel — hanya status menunggu */}
                        {izin.status === 'menunggu' && (
                          <>
                            <Tombol
                              varian="hantu"
                              ukuran="kecil"
                              onClick={() => tanganiSetujui(izin.id)}
                              title="Setujui"
                              className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            >
                              <Check size={14} />
                            </Tombol>
                            <Tombol
                              varian="hantu"
                              ukuran="kecil"
                              onClick={() => tanganiTolak(izin.id)}
                              title="Tolak"
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <X size={14} />
                            </Tombol>
                          </>
                        )}
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
              padaGantiHalaman={gantiHalaman}
            />
          </div>
        </Kartu>
      )}

      {/* Modal detail */}
      {izinDetail && (
        <ModalDetailIzin
          izin={izinDetail}
          onTutup={() => setIzinDetail(null)}
          onSetujui={tanganiSetujui}
          onTolak={tanganiTolak}
        />
      )}
    </div>
  );
}

export default HalamanIzinAdmin;
