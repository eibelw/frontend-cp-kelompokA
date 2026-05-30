import { Outlet, useLocation } from 'react-router-dom';
import NavBawah from './NavBawah';
import HeaderPegawai from './HeaderPegawai';

/** Mapping path ke judul halaman untuk header */
const judulHalaman: Record<string, string> = {
  '/absensi': 'Riwayat Absensi',
  '/izin': 'Pengajuan Izin',
  '/gaji': 'Slip Gaji',
  '/profil': 'Profil Saya',
};

/** Layout halaman pegawai: header atas + konten + nav bawah */
function TataLetakPegawai() {
  const lokasi = useLocation();
  const judul = judulHalaman[lokasi.pathname];

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex justify-center">
      {/* Frame phone/tablet — tinggi viewport penuh agar nav selalu di bawah */}
      <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 flex flex-col h-screen shadow-2xl sticky top-0">
        <HeaderPegawai judulHalaman={judul} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-5">
            <Outlet />
          </div>
        </main>

        <NavBawah />
      </div>
    </div>
  );
}

export default TataLetakPegawai;
