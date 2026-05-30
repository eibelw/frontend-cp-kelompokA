import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import Input from '@/komponen/ui/Input';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import { ubahKataSandi } from '../api/profilApi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';

/** Form ubah kata sandi di halaman profil */
function FormUbahKataSandi() {
  const [kataSandiLama, setKataSandiLama] = useState('');
  const [kataSandiBaru, setKataSandiBaru] = useState('');
  const [konfirmasiKataSandi, setKonfirmasiKataSandi] = useState('');
  const [tampilLama, setTampilLama] = useState(false);
  const [tampilBaru, setTampilBaru] = useState(false);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState('');

  const { sukses } = gunakanNotifikasi();

  /** Memvalidasi semua field kata sandi */
  function validasi(): boolean {
    if (!kataSandiLama) { setPesanError('Kata sandi lama harus diisi'); return false; }
    if (!kataSandiBaru) { setPesanError('Kata sandi baru harus diisi'); return false; }
    if (kataSandiBaru.length < 6) { setPesanError('Kata sandi baru minimal 6 karakter'); return false; }
    if (kataSandiBaru !== konfirmasiKataSandi) { setPesanError('Konfirmasi kata sandi tidak cocok'); return false; }
    return true;
  }

  /** Mengirim request ubah kata sandi ke API */
  async function kirimUbahKataSandi(e: React.FormEvent) {
    e.preventDefault();
    if (!validasi()) return;

    setSedangMemuat(true);
    setPesanError('');

    try {
      await ubahKataSandi({ kataSandiLama, kataSandiBaru });
      sukses('Kata sandi berhasil diubah', 'Silakan gunakan kata sandi baru Anda untuk login berikutnya.');
      setKataSandiLama('');
      setKataSandiBaru('');
      setKonfirmasiKataSandi('');
    } catch (error) {
      setPesanError(ambilPesanError(error));
    } finally {
      setSedangMemuat(false);
    }
  }

  const ikonTampil = (tampil: boolean, setTampil: (v: boolean) => void) => (
    <button
      type="button"
      onClick={() => setTampil(!tampil)}
      className="text-slate-400 hover:text-slate-600 transition-colors"
      aria-label={tampil ? 'Sembunyikan' : 'Tampilkan'}
    >
      {tampil ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <Kartu>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Ubah Kata Sandi</h3>

      <form onSubmit={kirimUbahKataSandi} className="space-y-4">
        {pesanError && <Peringatan varian="gagal">{pesanError}</Peringatan>}

        <Input
          label="Kata Sandi Lama"
          type={tampilLama ? 'text' : 'password'}
          value={kataSandiLama}
          onChange={(e) => setKataSandiLama(e.target.value)}
          ikonKiri={<Lock size={16} />}
          ikonKanan={ikonTampil(tampilLama, setTampilLama)}
          autoComplete="current-password"
          required
        />

        <Input
          label="Kata Sandi Baru"
          type={tampilBaru ? 'text' : 'password'}
          value={kataSandiBaru}
          onChange={(e) => setKataSandiBaru(e.target.value)}
          ikonKiri={<Lock size={16} />}
          ikonKanan={ikonTampil(tampilBaru, setTampilBaru)}
          bantuanTeks="Minimal 6 karakter"
          autoComplete="new-password"
          required
        />

        <Input
          label="Konfirmasi Kata Sandi Baru"
          type="password"
          value={konfirmasiKataSandi}
          onChange={(e) => setKonfirmasiKataSandi(e.target.value)}
          ikonKiri={<Lock size={16} />}
          autoComplete="new-password"
          required
        />

        <Tombol type="submit" sedangMemuat={sedangMemuat} className="w-full sm:w-auto">
          Simpan Kata Sandi
        </Tombol>
      </form>
    </Kartu>
  );
}

export default FormUbahKataSandi;
