import { useState, useEffect } from 'react';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import Input from '@/komponen/ui/Input';
import Pilihan from '@/komponen/ui/Pilihan';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import type { Pengguna, BuatPengguna, PerbaruiPengguna, JenisKelamin } from '@/tipe/pengguna';
import type { LokasiKantor } from '@/tipe/lokasi';
import type { OpsiPilihan } from '@/tipe/umum';
import { ambilPesanError } from '@/api/klien';
import { ambilDaftarLokasi, ambilPrakiraIdPegawai } from '../api/adminApi';

interface PropsFormPegawai {
  terbuka: boolean;
  padaTutup: () => void;
  padaSimpan: (data: BuatPengguna | PerbaruiPengguna) => Promise<boolean>;
  pegawaiDiedit?: Pengguna | null;
}

const opsiPeran: OpsiPilihan[] = [
  { nilai: 'pegawai', label: 'Pegawai' },
  { nilai: 'admin', label: 'Admin' },
];

const opsiJenisKelamin: OpsiPilihan[] = [
  { nilai: '', label: '— Pilih —' },
  { nilai: 'laki-laki', label: 'Laki-laki' },
  { nilai: 'perempuan', label: 'Perempuan' },
];

/** Modal form tambah / edit pegawai */
function FormPegawai({ terbuka, padaTutup, padaSimpan, pegawaiDiedit }: PropsFormPegawai) {
  const [idLokasiKantor, setIdLokasiKantor] = useState('');
  const [prakiraId, setPrakiraId] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [peran, setPeran] = useState<'pegawai' | 'admin'>('pegawai');
  const [departemen, setDepartemen] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [telepon, setTelepon] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<JenisKelamin | ''>('');
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [daftarLokasi, setDaftarLokasi] = useState<LokasiKantor[]>([]);

  const modeEdit = pegawaiDiedit != null;

  /** Muat daftar lokasi saat modal dibuka */
  useEffect(() => {
    if (terbuka && !modeEdit) {
      ambilDaftarLokasi().then(setDaftarLokasi).catch(() => {});
    }
  }, [terbuka, modeEdit]);

  /** Ambil prakiraan ID saat lokasi dipilih */
  useEffect(() => {
    if (!idLokasiKantor) { setPrakiraId(''); return; }
    ambilPrakiraIdPegawai(idLokasiKantor)
      .then(setPrakiraId)
      .catch(() => setPrakiraId(''));
  }, [idLokasiKantor]);

  /** Mengisi form dengan data pegawai yang sedang diedit */
  useEffect(() => {
    if (pegawaiDiedit) {
      setNama(pegawaiDiedit.nama);
      setEmail(pegawaiDiedit.email);
      setPeran(pegawaiDiedit.peran);
      setDepartemen(pegawaiDiedit.departemen ?? '');
      setJabatan(pegawaiDiedit.jabatan ?? '');
      setTelepon(pegawaiDiedit.telepon ?? '');
      setJenisKelamin(pegawaiDiedit.jenisKelamin ?? '');
    } else {
      resetForm();
    }
  }, [pegawaiDiedit]);

  function resetForm() {
    setIdLokasiKantor('');
    setPrakiraId('');
    setNama('');
    setEmail('');
    setKataSandi('');
    setPeran('pegawai');
    setDepartemen('');
    setJabatan('');
    setTelepon('');
    setJenisKelamin('');
    setPesanError('');
  }

  function validasi(): boolean {
    if (!nama.trim()) { setPesanError('Nama tidak boleh kosong'); return false; }
    if (!email.trim()) { setPesanError('Email tidak boleh kosong'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setPesanError('Format email tidak valid'); return false; }
    if (!modeEdit && !idLokasiKantor) { setPesanError('Lokasi kantor wajib dipilih'); return false; }
    if (!modeEdit && !kataSandi) { setPesanError('Kata sandi tidak boleh kosong'); return false; }
    if (!modeEdit && kataSandi.length < 6) { setPesanError('Kata sandi minimal 6 karakter'); return false; }
    if (!departemen.trim()) { setPesanError('Departemen tidak boleh kosong'); return false; }
    if (!jabatan.trim()) { setPesanError('Jabatan tidak boleh kosong'); return false; }
    if (!jenisKelamin) { setPesanError('Jenis kelamin wajib dipilih'); return false; }
    return true;
  }

  async function kirimForm() {
    if (!validasi()) return;

    setSedangMemuat(true);
    setPesanError('');

    const data = modeEdit
      ? ({ nama, email, peran, departemen: departemen || undefined, jabatan: jabatan || undefined, telepon: telepon || undefined, jenisKelamin: jenisKelamin || undefined } as PerbaruiPengguna)
      : ({ idLokasiKantor, nama, email, kataSandi, peran, departemen: departemen || undefined, jabatan: jabatan || undefined, telepon: telepon || undefined, jenisKelamin: jenisKelamin || undefined } as BuatPengguna);

    try {
      const berhasil = await padaSimpan(data);
      if (berhasil) {
        resetForm();
        padaTutup();
      }
    } catch (err) {
      setPesanError(ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }

  function tutupModal() {
    resetForm();
    padaTutup();
  }

  const opsiLokasi: OpsiPilihan[] = daftarLokasi.map((l) => ({
    nilai: l.id,
    label: `[${l.kode}] ${l.nama}`,
  }));

  return (
    <Modal
      terbuka={terbuka}
      padaTutup={tutupModal}
      judul={modeEdit ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
    >
      <div className="space-y-4">
        {pesanError && <Peringatan varian="gagal">{pesanError}</Peringatan>}

        {!modeEdit && (
          <>
            <Pilihan
              label="Lokasi Kantor"
              opsi={[{ nilai: '', label: '— Pilih Lokasi —' }, ...opsiLokasi]}
              value={idLokasiKantor}
              onChange={(e) => setIdLokasiKantor(e.target.value)}
              required
            />
            {prakiraId && (
              <p className="text-xs text-slate-500 -mt-2 px-1">
                ID Pegawai akan: <span className="font-semibold text-primer-600">{prakiraId}</span>
              </p>
            )}
          </>
        )}

        {modeEdit && (
          <Input
            label="ID Pegawai"
            value={pegawaiDiedit?.idPegawai ?? ''}
            disabled
          />
        )}

        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@perusahaan.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!modeEdit && (
          <Input
            label="Kata Sandi"
            type="password"
            placeholder="Minimal 6 karakter"
            value={kataSandi}
            onChange={(e) => setKataSandi(e.target.value)}
            required
          />
        )}

        <Pilihan
          label="Peran"
          opsi={opsiPeran}
          value={peran}
          onChange={(e) => setPeran(e.target.value as 'pegawai' | 'admin')}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Departemen"
            placeholder="Contoh: IT"
            value={departemen}
            onChange={(e) => setDepartemen(e.target.value)}
            required
          />
          <Input
            label="Jabatan"
            placeholder="Contoh: Staff"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            required
          />
        </div>

        <Input
          label="Telepon"
          type="tel"
          placeholder="Contoh: 08123456789"
          value={telepon}
          onChange={(e) => setTelepon(e.target.value.replace(/[^\d+\-()\s]/g, ''))}
          bantuanTeks="Hanya angka, +, -, (, ), spasi"
        />

        <Pilihan
          label="Jenis Kelamin"
          opsi={opsiJenisKelamin}
          value={jenisKelamin}
          onChange={(e) => setJenisKelamin(e.target.value as JenisKelamin | '')}
        />
      </div>

      <FooterModal>
        <Tombol varian="sekunder" onClick={tutupModal} disabled={sedangMemuat}>
          Batal
        </Tombol>
        <Tombol onClick={kirimForm} sedangMemuat={sedangMemuat}>
          {modeEdit ? 'Simpan Perubahan' : 'Tambah Pegawai'}
        </Tombol>
      </FooterModal>
    </Modal>
  );
}

export default FormPegawai;
