import { useState } from 'react';
import { Plus, Search, Pencil, UserX, Eye, KeyRound, Trash2 } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import Tombol from '@/komponen/ui/Tombol';
import Input from '@/komponen/ui/Input';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import { Tabel, HeaderTabel, BagiTabel, BarisTabel, SelHeader, SelData, TabelKosong } from '@/komponen/ui/Tabel';
import Badge from '@/komponen/ui/Badge';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import Paginasi from '@/komponen/ui/Paginasi';
import { SkeletonKartu } from '@/komponen/ui/Pemuat';
import KonfirmasiHapus from '@/komponen/ui/KonfirmasiHapus';
import Peringatan from '@/komponen/ui/Peringatan';
import FormPegawai from '../komponen/FormPegawai';
import { gunakanManajemenPegawai } from '../hooks/gunakanManajemenPegawai';
import { ubahKataSandiPegawai, hapusFotoPegawai } from '../api/adminApi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import type { Pengguna } from '@/tipe/pengguna';
import { LABEL_PERAN } from '@/utils/konstanta';
import { URL_UPLOAD } from '@/utils/konstanta';

const LABEL_JENIS_KELAMIN: Record<string, string> = {
  'laki-laki': 'Laki-laki',
  'perempuan': 'Perempuan',
};

/** Halaman manajemen data pegawai (admin) */
function HalamanPegawai() {
  const [modalFormTerbuka, setModalFormTerbuka] = useState(false);
  const [modalHapusTerbuka, setModalHapusTerbuka] = useState(false);
  const [modalDetailTerbuka, setModalDetailTerbuka] = useState(false);
  const [modalKataSandiTerbuka, setModalKataSandiTerbuka] = useState(false);
  const [pegawaiDipilih, setPegawaiDipilih] = useState<Pengguna | null>(null);
  const [sedangNonaktifkan, setSedangNonaktifkan] = useState(false);
  const [kataSandiBaru, setKataSandiBaru] = useState('');
  const [sedangGantiSandi, setSedangGantiSandi] = useState(false);
  const [pesanErrorSandi, setPesanErrorSandi] = useState('');

  const { sukses, gagal } = gunakanNotifikasi();

  const {
    daftarPegawai,
    totalHalaman,
    total,
    sedangMemuat,
    pencarianTeks,
    filter,
    setPencarianTeks,
    gantiHalaman,
    tanganibuatPegawai,
    tanganiPerbaruiPegawai,
    tanganiNonaktifkan,
    muatData,
  } = gunakanManajemenPegawai();

  function bukaDetail(pegawai: Pengguna) {
    setPegawaiDipilih(pegawai);
    setModalDetailTerbuka(true);
  }

  function bukaEditPegawai(pegawai: Pengguna) {
    setPegawaiDipilih(pegawai);
    setModalFormTerbuka(true);
  }

  function bukaNonaktifkan(pegawai: Pengguna) {
    setPegawaiDipilih(pegawai);
    setModalHapusTerbuka(true);
  }

  function bukaGantiSandi(pegawai: Pengguna) {
    setPegawaiDipilih(pegawai);
    setKataSandiBaru('');
    setPesanErrorSandi('');
    setModalKataSandiTerbuka(true);
  }

  async function konfirmasiNonaktifkan() {
    if (!pegawaiDipilih) return;
    setSedangNonaktifkan(true);
    await tanganiNonaktifkan(pegawaiDipilih.id);
    setSedangNonaktifkan(false);
    setModalHapusTerbuka(false);
    setPegawaiDipilih(null);
  }

  async function simpanKataSandi() {
    if (!pegawaiDipilih) return;
    if (kataSandiBaru.length < 6) { setPesanErrorSandi('Kata sandi minimal 6 karakter'); return; }
    setSedangGantiSandi(true);
    setPesanErrorSandi('');
    try {
      await ubahKataSandiPegawai(pegawaiDipilih.id, kataSandiBaru);
      sukses('Kata sandi berhasil diubah');
      setModalKataSandiTerbuka(false);
    } catch (err) {
      setPesanErrorSandi(ambilPesanError(err));
    } finally {
      setSedangGantiSandi(false);
    }
  }

  async function tanganiHapusFoto(pegawai: Pengguna) {
    try {
      await hapusFotoPegawai(pegawai.id);
      sukses('Foto dihapus');
      muatData(filter);
      setModalDetailTerbuka(false);
    } catch (err) {
      gagal('Gagal hapus foto', ambilPesanError(err));
    }
  }

  return (
    <div className="space-y-5 animate-masuk-bawah">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Data Pegawai</h1>
          <p className="text-sm text-slate-500 mt-0.5">Total {total} pegawai terdaftar</p>
        </div>
        <Tombol onClick={() => { setPegawaiDipilih(null); setModalFormTerbuka(true); }}>
          <Plus size={16} />
          Tambah Pegawai
        </Tombol>
      </div>

      {/* Pencarian */}
      <Input
        placeholder="Cari nama, email, atau ID pegawai..."
        value={pencarianTeks}
        onChange={(e) => setPencarianTeks(e.target.value)}
        ikonKiri={<Search size={16} />}
      />

      {/* Tabel pegawai */}
      {sedangMemuat ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <SkeletonKartu key={i} />)}
        </div>
      ) : (
        <Kartu tanpaPadding>
          <Tabel>
            <HeaderTabel>
              <tr>
                <SelHeader>Pegawai</SelHeader>
                <SelHeader>ID / Jabatan</SelHeader>
                <SelHeader>Peran</SelHeader>
                <SelHeader>Status</SelHeader>
                <SelHeader>Aksi</SelHeader>
              </tr>
            </HeaderTabel>
            <BagiTabel>
              {daftarPegawai.length === 0 ? (
                <TabelKosong pesan="Tidak ada pegawai ditemukan" kolomSpan={5} />
              ) : (
                daftarPegawai.map((pegawai) => (
                  <BarisTabel key={pegawai.id}>
                    <SelData>
                      <div className="flex items-center gap-3">
                        <AvatarPengguna nama={pegawai.nama} ukuran="kecil" urlFoto={pegawai.urlFoto} />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{pegawai.nama}</p>
                          <p className="text-xs text-slate-400">{pegawai.email}</p>
                        </div>
                      </div>
                    </SelData>
                    <SelData>
                      <p className="text-sm font-medium">{pegawai.idPegawai}</p>
                      <p className="text-xs text-slate-400">{pegawai.jabatan ?? '-'}</p>
                    </SelData>
                    <SelData>
                      <Badge varian={pegawai.peran === 'admin' ? 'ungu' : 'biru'}>
                        {LABEL_PERAN[pegawai.peran]}
                      </Badge>
                    </SelData>
                    <SelData>
                      <Badge varian={pegawai.aktif ? 'hijau' : 'merah'}>
                        {pegawai.aktif ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </SelData>
                    <SelData>
                      <div className="flex items-center gap-1">
                        <Tombol varian="hantu" ukuran="kecil" onClick={() => bukaDetail(pegawai)} title="Lihat detail">
                          <Eye size={14} />
                        </Tombol>
                        <Tombol varian="hantu" ukuran="kecil" onClick={() => bukaEditPegawai(pegawai)}>
                          <Pencil size={14} />
                        </Tombol>
                        <Tombol varian="hantu" ukuran="kecil" onClick={() => bukaGantiSandi(pegawai)} title="Ganti kata sandi">
                          <KeyRound size={14} />
                        </Tombol>
                        {pegawai.aktif && (
                          <Tombol
                            varian="hantu"
                            ukuran="kecil"
                            onClick={() => bukaNonaktifkan(pegawai)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserX size={14} />
                          </Tombol>
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

      {/* Modal detail pegawai */}
      <Modal
        terbuka={modalDetailTerbuka}
        padaTutup={() => setModalDetailTerbuka(false)}
        judul="Detail Pegawai"
      >
        {pegawaiDipilih && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <AvatarPengguna nama={pegawaiDipilih.nama} ukuran="besar" urlFoto={pegawaiDipilih.urlFoto} />
                {pegawaiDipilih.urlFoto && (
                  <button
                    onClick={() => tanganiHapusFoto(pegawaiDipilih)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                    title="Hapus foto"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{pegawaiDipilih.nama}</p>
                <p className="text-xs text-slate-500">{pegawaiDipilih.email}</p>
                <div className="flex gap-1 mt-1">
                  <Badge varian={pegawaiDipilih.peran === 'admin' ? 'ungu' : 'biru'}>{LABEL_PERAN[pegawaiDipilih.peran]}</Badge>
                  <Badge varian={pegawaiDipilih.aktif ? 'hijau' : 'merah'}>{pegawaiDipilih.aktif ? 'Aktif' : 'Nonaktif'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'ID Pegawai', nilai: pegawaiDipilih.idPegawai },
                { label: 'Departemen', nilai: pegawaiDipilih.departemen },
                { label: 'Jabatan', nilai: pegawaiDipilih.jabatan },
                { label: 'Telepon', nilai: pegawaiDipilih.telepon },
                { label: 'Jenis Kelamin', nilai: pegawaiDipilih.jenisKelamin ? LABEL_JENIS_KELAMIN[pegawaiDipilih.jenisKelamin] : null },
              ].map(({ label, nilai }) => nilai ? (
                <div key={label} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{nilai}</p>
                </div>
              ) : null)}
            </div>
          </div>
        )}
        <FooterModal>
          <Tombol varian="sekunder" onClick={() => setModalDetailTerbuka(false)}>Tutup</Tombol>
          <Tombol onClick={() => { setModalDetailTerbuka(false); if (pegawaiDipilih) bukaEditPegawai(pegawaiDipilih); }}>
            <Pencil size={14} />
            Edit Data
          </Tombol>
        </FooterModal>
      </Modal>

      {/* Modal ganti kata sandi */}
      <Modal
        terbuka={modalKataSandiTerbuka}
        padaTutup={() => setModalKataSandiTerbuka(false)}
        judul="Ganti Kata Sandi"
        ukuran="kecil"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Mengganti kata sandi untuk <strong>{pegawaiDipilih?.nama}</strong>
          </p>
          {pesanErrorSandi && <Peringatan varian="gagal">{pesanErrorSandi}</Peringatan>}
          <Input
            label="Kata Sandi Baru"
            type="password"
            placeholder="Minimal 6 karakter"
            value={kataSandiBaru}
            onChange={(e) => setKataSandiBaru(e.target.value)}
            required
          />
        </div>
        <FooterModal>
          <Tombol varian="sekunder" onClick={() => setModalKataSandiTerbuka(false)}>Batal</Tombol>
          <Tombol onClick={simpanKataSandi} sedangMemuat={sedangGantiSandi}>Simpan</Tombol>
        </FooterModal>
      </Modal>

      {/* Modal form */}
      <FormPegawai
        terbuka={modalFormTerbuka}
        padaTutup={() => setModalFormTerbuka(false)}
        pegawaiDiedit={pegawaiDipilih}
        padaSimpan={(data) =>
          pegawaiDipilih
            ? tanganiPerbaruiPegawai(pegawaiDipilih.id, data as any)
            : tanganibuatPegawai(data as any)
        }
      />

      {/* Modal konfirmasi nonaktifkan */}
      <KonfirmasiHapus
        terbuka={modalHapusTerbuka}
        padaTutup={() => setModalHapusTerbuka(false)}
        padaKonfirmasi={konfirmasiNonaktifkan}
        judul="Nonaktifkan Pegawai"
        pesan={`Apakah Anda yakin ingin menonaktifkan akun ${pegawaiDipilih?.nama}?`}
        sedangMemproses={sedangNonaktifkan}
      />
    </div>
  );
}

export default HalamanPegawai;
