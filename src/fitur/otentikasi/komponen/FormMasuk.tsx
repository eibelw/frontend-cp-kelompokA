import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '@/komponen/ui/Input';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import { gunakanMasuk } from '../hooks/gunakanMasuk';

/** Formulir login dengan email, kata sandi, dan tombol masuk */
function FormMasuk() {
  const {
    nilaiForm,
    sedangMemuat,
    pesanError,
    tampilKataSandi,
    ubahNilaiForm,
    kirimLogin,
    setTampilKataSandi,
  } = gunakanMasuk();

  return (
    <form onSubmit={kirimLogin} className="space-y-4" noValidate>
      {/* Pesan error global */}
      {pesanError && (
        <Peringatan varian="gagal">
          {pesanError}
        </Peringatan>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="nama@perusahaan.com"
        value={nilaiForm.email}
        onChange={(e) => ubahNilaiForm('email', e.target.value)}
        ikonKiri={<Mail size={16} />}
        autoComplete="email"
        autoFocus
        required
        disabled={sedangMemuat}
      />

      <Input
        label="Kata Sandi"
        type={tampilKataSandi ? 'text' : 'password'}
        placeholder="Masukkan kata sandi"
        value={nilaiForm.kataSandi}
        onChange={(e) => ubahNilaiForm('kataSandi', e.target.value)}
        ikonKiri={<Lock size={16} />}
        ikonKanan={
          <button
            type="button"
            onClick={() => setTampilKataSandi(!tampilKataSandi)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={tampilKataSandi ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {tampilKataSandi ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        autoComplete="current-password"
        required
        disabled={sedangMemuat}
      />

      <Tombol
        type="submit"
        ukuran="besar"
        sedangMemuat={sedangMemuat}
        className="w-full mt-2"
      >
        {sedangMemuat ? 'Masuk...' : 'Masuk'}
      </Tombol>
    </form>
  );
}

export default FormMasuk;
