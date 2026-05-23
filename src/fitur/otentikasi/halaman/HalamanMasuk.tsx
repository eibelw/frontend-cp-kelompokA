import { Navigate } from 'react-router-dom';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';
import FormMasuk from '../komponen/FormMasuk';

/** Halaman login - redirect ke dasbor jika sudah terautentikasi */
function HalamanMasuk() {
  const { sudahDiotentikasi, pengguna } = gunakanOtentikasi();

  if (sudahDiotentikasi) {
    const tujuan = pengguna?.peran === 'admin' ? '/admin/dasbor' : '/dasbor';
    return <Navigate to={tujuan} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primer-600 to-primer-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Kartu login */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 animate-masuk-bawah">
          {/* Header dengan logo */}
          <div className="text-center mb-8">
            {/* Ganti dengan gambar logo dari src/aset/gambar/logo.png */}
            <div className="w-16 h-16 rounded-2xl bg-primer-600 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sistem Absensi</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Masuk untuk melanjutkan</p>
          </div>

          <FormMasuk />
        </div>

        <p className="text-center text-xs text-primer-200 mt-6">
          Sistem Manajemen Absensi Pegawai
        </p>
      </div>
    </div>
  );
}

export default HalamanMasuk;
