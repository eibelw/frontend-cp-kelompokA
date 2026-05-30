import { Check, X } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import Pilihan from '@/komponen/ui/Pilihan';
import Tombol from '@/komponen/ui/Tombol';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import { BadgeStatusIzin, BadgeJenisIzin } from '@/komponen/ui/Badge';
import Paginasi from '@/komponen/ui/Paginasi';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import { gunakanManajemenIzin } from '../hooks/gunakanManajemenIzin';
import { formatTanggal } from '@/utils/formatTanggal';
import type { OpsiPilihan } from '@/tipe/umum';
import { URL_UPLOAD } from '@/utils/konstanta';

const opsiStatus: OpsiPilihan[] = [
  { nilai: '', label: 'Semua Status' },
  { nilai: 'menunggu', label: 'Menunggu' },
  { nilai: 'disetujui', label: 'Disetujui' },
  { nilai: 'ditolak', label: 'Ditolak' },
];

/** Halaman persetujuan pengajuan izin (admin) */
function HalamanIzinAdmin() {
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
                <SelHeader>Dokumen</SelHeader>
                <SelHeader>Status</SelHeader>
                <SelHeader>Aksi</SelHeader>
              </tr>
            </HeaderTabel>
            <BagiTabel>
              {daftarIzin.length === 0 ? (
                <TabelKosong pesan="Tidak ada pengajuan izin" kolomSpan={7} />
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
                    <SelData>
                      {izin.urlDokumen ? (
                        <a
                          href={`${URL_UPLOAD}/${izin.urlDokumen}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primer-600 hover:underline"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </SelData>
                    <SelData><BadgeStatusIzin status={izin.status} /></SelData>
                    <SelData>
                      {izin.status === 'menunggu' && (
                        <div className="flex items-center gap-1">
                          <Tombol
                            varian="hantu"
                            ukuran="kecil"
                            onClick={() => tanganiSetujui(izin.id)}
                            className="text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check size={14} />
                          </Tombol>
                          <Tombol
                            varian="hantu"
                            ukuran="kecil"
                            onClick={() => tanganiTolak(izin.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <X size={14} />
                          </Tombol>
                        </div>
                      )}
                    </SelData>
                  </BarisTabel>
                ))
              )}
            </BagiTabel>
          </Tabel>
          <div className="p-4 border-t border-slate-200">
            <Paginasi
              halamanAktif={filter.halaman ?? 1}
              totalHalaman={totalHalaman}
              padaGantiHalaman={gantiHalaman}
            />
          </div>
        </Kartu>
      )}
    </div>
  );
}

export default HalamanIzinAdmin;
