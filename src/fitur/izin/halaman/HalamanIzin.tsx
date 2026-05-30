import { useState } from 'react';
import { Plus } from 'lucide-react';
import Tombol from '@/komponen/ui/Tombol';
import Pilihan from '@/komponen/ui/Pilihan';
import { Kartu } from '@/komponen/ui/Kartu';
import FormPengajuanIzin from '../komponen/FormPengajuanIzin';
import TabelRiwayatIzin from '../komponen/TabelRiwayatIzin';
import { gunakanDaftarIzin } from '../hooks/gunakanIzin';
import type { OpsiPilihan } from '@/tipe/umum';

const opsiStatus: OpsiPilihan[] = [
  { nilai: '', label: 'Semua Status' },
  { nilai: 'menunggu', label: 'Menunggu' },
  { nilai: 'disetujui', label: 'Disetujui' },
  { nilai: 'ditolak', label: 'Ditolak' },
];

/** Halaman pengajuan dan riwayat izin pegawai */
function HalamanIzin() {
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const { daftarIzin, sedangMemuat, filter, totalHalaman, total, gantiHalaman, terapkanFilter, tanganiBetalkan, muatUlang } =
    gunakanDaftarIzin({ batas: 10 });

  return (
    <div className="space-y-5 animate-masuk-bawah">
      {/* Header dengan tombol ajukan */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Total <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span> pengajuan
        </p>
        <Tombol onClick={() => setModalTerbuka(true)} ukuran="sedang">
          <Plus size={16} />
          Ajukan Izin
        </Tombol>
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

      {/* Tabel riwayat */}
      <TabelRiwayatIzin
        daftarIzin={daftarIzin}
        sedangMemuat={sedangMemuat}
        halamanAktif={filter.halaman ?? 1}
        totalHalaman={totalHalaman}
        padaGantiHalaman={gantiHalaman}
        padaBatalkan={tanganiBetalkan}
      />

      {/* Modal pengajuan */}
      <FormPengajuanIzin
        terbuka={modalTerbuka}
        padaTutup={() => setModalTerbuka(false)}
        padaBerhasil={() => {
          setModalTerbuka(false);
          muatUlang();
        }}
      />
    </div>
  );
}

export default HalamanIzin;
