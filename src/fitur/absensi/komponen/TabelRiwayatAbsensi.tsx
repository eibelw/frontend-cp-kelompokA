import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import { BadgeStatusAbsensi } from '@/komponen/ui/Badge';
import Paginasi from '@/komponen/ui/Paginasi';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import Modal from '@/komponen/ui/Modal';
import Tombol from '@/komponen/ui/Tombol';
import type { Absensi } from '@/tipe/absensi';
import { formatTanggal, formatWaktu } from '@/utils/formatTanggal';

interface PropsTabel {
  daftarAbsensi: Absensi[];
  sedangMemuat: boolean;
  halamanAktif: number;
  totalHalaman: number;
  padaGantiHalaman: (halaman: number) => void;
}

/** Tabel riwayat absensi pegawai */
function TabelRiwayatAbsensi({
  daftarAbsensi,
  sedangMemuat,
  halamanAktif,
  totalHalaman,
  padaGantiHalaman,
}: PropsTabel) {
  const [fotoAktif, setFotoAktif] = useState<string | null>(null);

  if (sedangMemuat) {
    return (
      <div className="space-y-2">
        <SkeletonKartu />
        <SkeletonKartu />
        <SkeletonKartu />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabel>
        <HeaderTabel>
          <tr>
            <SelHeader>Tanggal</SelHeader>
            <SelHeader>Masuk</SelHeader>
            <SelHeader>Keluar</SelHeader>
            <SelHeader>Status</SelHeader>
            <SelHeader>Ket.</SelHeader>
            <SelHeader>Foto</SelHeader>
          </tr>
        </HeaderTabel>

        <BagiTabel>
          {daftarAbsensi.length === 0 ? (
            <TabelKosong pesan="Belum ada riwayat absensi" kolomSpan={6} />
          ) : (
            daftarAbsensi.map((absensi) => (
              <BarisTabel key={absensi.id}>
                <SelData className="font-medium text-slate-900 dark:text-slate-100">
                  {formatTanggal(absensi.tanggal)}
                </SelData>
                <SelData>
                  {absensi.waktuMasuk ? (
                    <span className="text-emerald-600 font-medium">
                      {formatWaktu(absensi.waktuMasuk)}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </SelData>
                <SelData>
                  {absensi.waktuKeluar ? (
                    <span className="text-amber-600 font-medium">
                      {formatWaktu(absensi.waktuKeluar)}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </SelData>
                <SelData>
                  <BadgeStatusAbsensi status={absensi.status} />
                </SelData>
                <SelData>
                  {absensi.keterlambatan > 0 ? (
                    <span className="text-xs text-amber-600 font-medium">
                      +{absensi.keterlambatan} mnt
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600">Tepat</span>
                  )}
                </SelData>
                <SelData>
                  {absensi.urlFoto ? (
                    <Tombol
                      varian="hantu"
                      ukuran="kecil"
                      onClick={() => setFotoAktif(absensi.urlFoto)}
                      title="Lihat foto selfie"
                    >
                      <Camera size={15} />
                    </Tombol>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
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

      <Modal
        terbuka={fotoAktif !== null}
        padaTutup={() => setFotoAktif(null)}
        judul="Foto Selfie Absensi"
        ukuran="kecil"
      >
        {fotoAktif && (
          <img
            src={fotoAktif}
            alt="Foto selfie absensi"
            className="w-full rounded-lg object-cover"
          />
        )}
      </Modal>
    </div>
  );
}

export default TabelRiwayatAbsensi;
