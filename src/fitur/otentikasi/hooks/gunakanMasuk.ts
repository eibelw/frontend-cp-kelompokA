import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { masuk } from '../api/otentikasiApi';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';

interface StateFormMasuk {
  email: string;
  kataSandi: string;
}

/** Hook untuk mengelola logika halaman login */
export function gunakanMasuk() {
  const [nilaiForm, setNilaiForm] = useState<StateFormMasuk>({ email: '', kataSandi: '' });
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [tampilKataSandi, setTampilKataSandi] = useState(false);

  const { simpanSesi } = gunakanOtentikasi();
  const { sukses } = gunakanNotifikasi();
  const navigasi = useNavigate();

  /** Memperbarui nilai field form */
  function ubahNilaiForm(bidang: keyof StateFormMasuk, nilai: string) {
    setNilaiForm((prev) => ({ ...prev, [bidang]: nilai }));
    if (pesanError) setPesanError('');
  }

  /** Memvalidasi input sebelum dikirim ke API */
  function validasiForm(): boolean {
    if (!nilaiForm.email.trim()) {
      setPesanError('Email tidak boleh kosong');
      return false;
    }
    if (!nilaiForm.email.includes('@')) {
      setPesanError('Format email tidak valid');
      return false;
    }
    if (!nilaiForm.kataSandi) {
      setPesanError('Kata sandi tidak boleh kosong');
      return false;
    }
    return true;
  }

  /** Mengirim request login ke API */
  async function kirimLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validasiForm()) return;

    setSedangMemuat(true);
    setPesanError('');

    try {
      const data = await masuk({
        email: nilaiForm.email.trim(),
        kataSandi: nilaiForm.kataSandi,
      });

      simpanSesi(data.token, data.tokenPembaruan, data.pengguna);
      sukses('Berhasil masuk', `Selamat datang, ${data.pengguna.nama}!`);

      // Arahkan ke halaman sesuai peran
      if (data.pengguna.peran === 'admin') {
        navigasi('/admin/dasbor', { replace: true });
      } else {
        navigasi('/dasbor', { replace: true });
      }
    } catch (error) {
      setPesanError(ambilPesanError(error));
    } finally {
      setSedangMemuat(false);
    }
  }

  return {
    nilaiForm,
    sedangMemuat,
    pesanError,
    tampilKataSandi,
    ubahNilaiForm,
    kirimLogin,
    setTampilKataSandi,
  };
}
