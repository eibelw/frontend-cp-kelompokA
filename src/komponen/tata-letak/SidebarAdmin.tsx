import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  MapPin,
  Download,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { gunakanTema } from '@/konteks/KonteksTema';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import { cn } from '@/utils/pembantu';

interface ItemMenu {
  ikon: React.ElementType;
  label: string;
  ke: string;
}

const daftarMenu: ItemMenu[] = [
  { ikon: LayoutDashboard, label: 'Dasbor', ke: '/admin/dasbor' },
  { ikon: Users, label: 'Data Pegawai', ke: '/admin/pegawai' },
  { ikon: ClipboardList, label: 'Absensi', ke: '/admin/absensi' },
  { ikon: FileText, label: 'Pengajuan Izin', ke: '/admin/izin' },
  { ikon: MapPin, label: 'Lokasi Kantor', ke: '/admin/lokasi' },
  { ikon: Wallet, label: 'Penggajian', ke: '/admin/gaji' },
  { ikon: Download, label: 'Ekspor Data', ke: '/admin/ekspor' },
];

/** Sidebar navigasi untuk halaman admin */
function SidebarAdmin() {
  const { pengguna, keluar } = gunakanOtentikasi();
  const { sukses } = gunakanNotifikasi();
  const { tema, gantiTema } = gunakanTema();
  const navigasi = useNavigate();
  const [mobileTerbuka, setMobileTerbuka] = useState(false);

  function tanganiKeluar() {
    keluar();
    sukses('Berhasil keluar', 'Sampai jumpa kembali!');
    navigasi('/masuk');
  }

  const isiSidebar = (
    <div className="flex flex-col h-full">
      {/* Logo / brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-primer-600 flex items-center justify-center">
          <ClipboardList size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Sistem Absensi</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Panel Admin</p>
        </div>
      </div>

      {/* Menu navigasi */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {daftarMenu.map(({ ikon: Ikon, label, ke }) => (
          <NavLink
            key={ke}
            to={ke}
            onClick={() => setMobileTerbuka(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-primer-50 dark:bg-primer-900/30 text-primer-700 dark:text-primer-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
              )
            }
          >
            <Ikon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Info pengguna + toggle tema + tombol keluar */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700">
        {pengguna && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <AvatarPengguna nama={pengguna.nama} ukuran="kecil" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{pengguna.nama}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Admin</p>
            </div>
          </div>
        )}

        <button
          onClick={gantiTema}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors mb-1"
        >
          {tema === 'terang' ? <Moon size={18} /> : <Sun size={18} />}
          {tema === 'terang' ? 'Mode Gelap' : 'Mode Terang'}
        </button>

        <button
          onClick={tanganiKeluar}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0">
        {isiSidebar}
      </aside>

      {/* Tombol hamburger mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
        onClick={() => setMobileTerbuka(true)}
        aria-label="Buka menu"
      >
        <Menu size={20} className="dark:text-slate-300" />
      </button>

      {/* Sidebar mobile (drawer) */}
      {mobileTerbuka && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileTerbuka(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 z-50 flex flex-col w-60 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 animate-masuk-atas">
            <button
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600"
              onClick={() => setMobileTerbuka(false)}
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
            {isiSidebar}
          </aside>
        </>
      )}
    </>
  );
}

export default SidebarAdmin;
