import { useNavigate } from 'react-router-dom';
import Tombol from '@/komponen/ui/Tombol';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';

/** Halaman 404 - tidak ditemukan */
function HalamanTidakDitemukan() {
  const navigasi = useNavigate();
  const { sudahDiotentikasi, pengguna } = gunakanOtentikasi();

  function kembali() {
    if (!sudahDiotentikasi) {
      navigasi('/masuk');
    } else if (pengguna?.peran === 'admin') {
      navigasi('/admin/dasbor');
    } else {
      navigasi('/dasbor');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {/* Ganti dengan ilustrasi 404 dari src/aset/gambar/404.svg */}
        <div className="text-8xl font-black text-slate-200 mb-4">404</div>

        <h1 className="text-xl font-bold text-slate-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500 mb-6">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>

        <Tombol onClick={kembali}>
          Kembali ke Beranda
        </Tombol>
      </div>
    </div>
  );
}

export default HalamanTidakDitemukan;
