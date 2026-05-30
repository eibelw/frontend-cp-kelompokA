import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import Tombol from '@/komponen/ui/Tombol';
import { Kartu } from '@/komponen/ui/Kartu';
import Badge from '@/komponen/ui/Badge';
import KonfirmasiHapus from '@/komponen/ui/KonfirmasiHapus';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import FormLokasi from '../komponen/FormLokasi';
import { gunakanManajemenLokasi } from '../hooks/gunakanManajemenLokasi';
import type { LokasiKantor } from '@/tipe/lokasi';

/** Halaman manajemen lokasi kantor (admin) */
function HalamanLokasi() {
  const [modalFormTerbuka, setModalFormTerbuka] = useState(false);
  const [modalHapusTerbuka, setModalHapusTerbuka] = useState(false);
  const [lokasiDipilih, setLokasiDipilih] = useState<LokasiKantor | null>(null);
  const [sedangHapus, setSedangHapus] = useState(false);

  const { daftarLokasi, sedangMemuat, tanganibuatLokasi, tanganiPerbaruiLokasi, tanganiHapusLokasi } =
    gunakanManajemenLokasi();

  function bukaEdit(lokasi: LokasiKantor) {
    setLokasiDipilih(lokasi);
    setModalFormTerbuka(true);
  }

  function bukaHapus(lokasi: LokasiKantor) {
    setLokasiDipilih(lokasi);
    setModalHapusTerbuka(true);
  }

  async function konfirmasiHapus() {
    if (!lokasiDipilih) return;
    setSedangHapus(true);
    await tanganiHapusLokasi(lokasiDipilih.id);
    setSedangHapus(false);
    setModalHapusTerbuka(false);
  }

  return (
    <div className="space-y-5 animate-masuk-bawah">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Lokasi Kantor</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{daftarLokasi.length} lokasi terdaftar</p>
        </div>
        <Tombol onClick={() => { setLokasiDipilih(null); setModalFormTerbuka(true); }}>
          <Plus size={16} />
          Tambah Lokasi
        </Tombol>
      </div>

      {sedangMemuat ? (
        <div className="space-y-3">{[1, 2].map((i) => <SkeletonKartu key={i} />)}</div>
      ) : daftarLokasi.length === 0 ? (
        <Kartu className="text-center py-10">
          <MapPin size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Belum ada lokasi kantor terdaftar</p>
        </Kartu>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {daftarLokasi.map((lokasi) => (
            <Kartu key={lokasi.id} hoverBayangan>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primer-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primer-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{lokasi.nama}</h3>
                      <Badge varian={lokasi.aktif ? 'hijau' : 'merah'}>
                        {lokasi.aktif ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      {lokasi.latitude.toFixed(6)}, {lokasi.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Radius: <span className="font-medium text-slate-600 dark:text-slate-300">{lokasi.radius} meter</span>
                    </p>
                  </div>
                </div>

                {/* Tombol aksi */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Tombol varian="hantu" ukuran="kecil" onClick={() => bukaEdit(lokasi)}>
                    <Pencil size={14} />
                  </Tombol>
                  <Tombol
                    varian="hantu"
                    ukuran="kecil"
                    onClick={() => bukaHapus(lokasi)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Tombol>
                </div>
              </div>
            </Kartu>
          ))}
        </div>
      )}

      <FormLokasi
        terbuka={modalFormTerbuka}
        padaTutup={() => setModalFormTerbuka(false)}
        lokasiDiedit={lokasiDipilih}
        padaSimpan={(data) =>
          lokasiDipilih
            ? tanganiPerbaruiLokasi(lokasiDipilih.id, data)
            : tanganibuatLokasi(data)
        }
      />

      <KonfirmasiHapus
        terbuka={modalHapusTerbuka}
        padaTutup={() => setModalHapusTerbuka(false)}
        padaKonfirmasi={konfirmasiHapus}
        judul="Hapus Lokasi"
        pesan={`Apakah Anda yakin ingin menghapus lokasi "${lokasiDipilih?.nama}"?`}
        sedangMemproses={sedangHapus}
      />
    </div>
  );
}

export default HalamanLokasi;
