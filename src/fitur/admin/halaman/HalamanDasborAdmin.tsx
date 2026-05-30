import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, FileText } from 'lucide-react';
import KartuStatistik from '../komponen/KartuStatistik';
import { ambilRekapAbsensi } from '../api/adminApi';
import { ambilSemuaIzin } from '../api/adminApi';
import { ambilDaftarPegawai } from '../api/adminApi';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import { BadgeStatusAbsensi } from '@/komponen/ui/Badge';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import { Kartu, HeaderKartu } from '@/komponen/ui/Kartu';
import type { Absensi } from '@/tipe/absensi';
import { formatTanggal, formatWaktu } from '@/utils/formatTanggal';
import { formatUntukInput } from '@/utils/formatTanggal';

/** Halaman dasbor utama admin */
function HalamanDasborAdmin() {
  const navigasi = useNavigate();
  const [totalPegawai, setTotalPegawai] = useState(0);
  const [hadirHariIni, setHadirHariIni] = useState(0);
  const [menungguIzin, setMenungguIzin] = useState(0);
  const [absensiTerbaru, setAbsensiTerbaru] = useState<Absensi[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);

  /** Memuat semua statistik dasbor secara paralel */
  useEffect(() => {
    async function muatStatistik() {
      const tanggalHariIni = formatUntukInput(new Date());

      try {
        const [dataPegawai, dataAbsensi, dataIzin] = await Promise.all([
          ambilDaftarPegawai({ batas: 1 }),
          ambilRekapAbsensi({ tanggal: tanggalHariIni, batas: 5 } as any),
          ambilSemuaIzin({ status: 'menunggu', batas: 1 }),
        ]);

        setTotalPegawai(dataPegawai.total);
        setHadirHariIni(dataAbsensi.total);
        setMenungguIzin(dataIzin.total);
        setAbsensiTerbaru(dataAbsensi.baris ?? []);
      } catch {
        // Error ditangani secara diam-diam untuk statistik
      } finally {
        setSedangMemuat(false);
      }
    }

    muatStatistik();
  }, []);

  return (
    <div className="space-y-6 animate-masuk-bawah">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dasbor Admin</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatTanggal(new Date())}</p>
      </div>

      {/* Kartu statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KartuStatistik
          judul="Total Pegawai"
          nilai={totalPegawai}
          ikon={Users}
          warnaIkon="text-primer-600"
          warnaLatar="bg-primer-50"
          sedangMemuat={sedangMemuat}
          onClick={() => navigasi('/admin/pegawai')}
        />
        <KartuStatistik
          judul="Hadir Hari Ini"
          nilai={hadirHariIni}
          ikon={UserCheck}
          warnaIkon="text-emerald-600"
          warnaLatar="bg-emerald-50"
          keterangan="Pegawai yang sudah absen masuk"
          sedangMemuat={sedangMemuat}
          onClick={() => navigasi('/admin/absensi')}
        />
        <KartuStatistik
          judul="Izin Menunggu"
          nilai={menungguIzin}
          ikon={FileText}
          warnaIkon="text-amber-600"
          warnaLatar="bg-amber-50"
          keterangan="Pengajuan yang perlu ditindaklanjuti"
          sedangMemuat={sedangMemuat}
          onClick={() => navigasi('/admin/izin')}
        />
      </div>

      {/* Absensi terbaru hari ini */}
      <Kartu tanpaPadding>
        <div className="px-5 pt-5 pb-3">
          <HeaderKartu
            judul="Absensi Hari Ini"
            subJudul="Pegawai yang sudah melakukan check-in"
          />
        </div>

        <Tabel>
          <HeaderTabel>
            <tr>
              <SelHeader>Pegawai</SelHeader>
              <SelHeader>Masuk</SelHeader>
              <SelHeader>Keluar</SelHeader>
              <SelHeader>Status</SelHeader>
            </tr>
          </HeaderTabel>
          <BagiTabel>
            {absensiTerbaru.length === 0 ? (
              <TabelKosong pesan="Belum ada absensi hari ini" kolomSpan={4} />
            ) : (
              absensiTerbaru.map((absensi) => (
                <BarisTabel key={absensi.id}>
                  <SelData>
                    <div className="flex items-center gap-2">
                      {absensi.pengguna && (
                        <AvatarPengguna nama={absensi.pengguna.nama} ukuran="kecil" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {absensi.pengguna?.nama ?? '-'}
                        </p>
                        <p className="text-xs text-slate-400">{absensi.pengguna?.jabatan ?? ''}</p>
                      </div>
                    </div>
                  </SelData>
                  <SelData className="text-emerald-600 font-medium">
                    {formatWaktu(absensi.waktuMasuk)}
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
                </BarisTabel>
              ))
            )}
          </BagiTabel>
        </Tabel>
      </Kartu>
    </div>
  );
}

export default HalamanDasborAdmin;
