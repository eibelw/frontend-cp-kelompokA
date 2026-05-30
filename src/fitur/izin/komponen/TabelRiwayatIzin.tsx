import { useState } from 'react';
import { Trash2, Eye, X, FileText } from 'lucide-react';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import { BadgeStatusIzin, BadgeJenisIzin } from '@/komponen/ui/Badge';
import Paginasi from '@/komponen/ui/Paginasi';
import Tombol from '@/komponen/ui/Tombol';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import type { Izin } from '@/tipe/izin';
import { formatTanggal } from '@/utils/formatTanggal';
import { URL_UPLOAD } from '@/utils/konstanta';

interface PropsTabel {
  daftarIzin: Izin[];
  sedangMemuat: boolean;
  halamanAktif: number;
  totalHalaman: number;
  padaGantiHalaman: (halaman: number) => void;
  padaBatalkan?: (id: string) => void;
}

const LABEL_JENIS: Record<string, string> = { izin: 'Izin', sakit: 'Sakit', cuti: 'Cuti' };

function ModalDetailIzin({ izin, onTutup }: { izin: Izin; onTutup: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Detail Izin</h2>
          <button onClick={onTutup} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <BadgeJenisIzin jenis={izin.jenisIzin} />
            <BadgeStatusIzin status={izin.status} />
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Periode</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {formatTanggal(izin.tanggalMulai)}
                {izin.tanggalMulai !== izin.tanggalSelesai && (
                  <> &ndash; {formatTanggal(izin.tanggalSelesai)}</>
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Alasan</p>
              <p className="text-slate-900 dark:text-slate-100 leading-relaxed">{izin.alasan}</p>
            </div>

            {izin.penyetuju && (
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {izin.status === 'disetujui' ? 'Disetujui oleh' : 'Ditolak oleh'}
                </p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{izin.penyetuju.nama}</p>
              </div>
            )}

            {izin.urlDokumen && (
              <a
                href={`${URL_UPLOAD}/${izin.urlDokumen}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primer-600 dark:text-primer-400 hover:underline"
              >
                <FileText size={14} />
                Lihat Dokumen
              </a>
            )}
          </div>
        </div>

        <div className="px-5 pb-5">
          <Tombol varian="sekunder" className="w-full" onClick={onTutup}>Tutup</Tombol>
        </div>
      </div>
    </div>
  );
}

/** Tabel riwayat pengajuan izin */
function TabelRiwayatIzin({
  daftarIzin,
  sedangMemuat,
  halamanAktif,
  totalHalaman,
  padaGantiHalaman,
  padaBatalkan,
}: PropsTabel) {
  const [izinDetail, setIzinDetail] = useState<Izin | null>(null);

  if (sedangMemuat) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => <SkeletonKartu key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabel>
        <HeaderTabel>
          <tr>
            <SelHeader>Jenis</SelHeader>
            <SelHeader>Periode</SelHeader>
            <SelHeader>Alasan</SelHeader>
            <SelHeader>Status</SelHeader>
            <SelHeader>Aksi</SelHeader>
          </tr>
        </HeaderTabel>

        <BagiTabel>
          {daftarIzin.length === 0 ? (
            <TabelKosong pesan="Belum ada pengajuan izin" kolomSpan={5} />
          ) : (
            daftarIzin.map((izin) => (
              <BarisTabel key={izin.id}>
                <SelData>
                  <BadgeJenisIzin jenis={izin.jenisIzin} />
                </SelData>
                <SelData className="whitespace-nowrap">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {formatTanggal(izin.tanggalMulai)}
                  </p>
                  {izin.tanggalMulai !== izin.tanggalSelesai && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      s.d. {formatTanggal(izin.tanggalSelesai)}
                    </p>
                  )}
                </SelData>
                <SelData className="max-w-[150px]">
                  <p className="text-sm text-slate-700 dark:text-slate-300 truncate" title={izin.alasan}>
                    {izin.alasan}
                  </p>
                </SelData>
                <SelData>
                  <BadgeStatusIzin status={izin.status} />
                </SelData>
                <SelData>
                  <div className="flex items-center gap-1">
                    <Tombol
                      varian="hantu"
                      ukuran="kecil"
                      onClick={() => setIzinDetail(izin)}
                      className="text-slate-500 hover:text-primer-600"
                      title="Lihat detail"
                    >
                      <Eye size={14} />
                    </Tombol>
                    {padaBatalkan && izin.status === 'menunggu' && (
                      <Tombol
                        varian="hantu"
                        ukuran="kecil"
                        onClick={() => padaBatalkan(izin.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Batalkan"
                      >
                        <Trash2 size={14} />
                      </Tombol>
                    )}
                  </div>
                </SelData>
              </BarisTabel>
            ))
          )}
        </BagiTabel>
      </Tabel>

      <Paginasi
        halamanAktif={halamanAktif}
        totalHalaman={totalHalaman}
        padaGantiHalaman={padaGantiHalaman}
      />

      {izinDetail && (
        <ModalDetailIzin izin={izinDetail} onTutup={() => setIzinDetail(null)} />
      )}
    </div>
  );
}

export default TabelRiwayatIzin;
