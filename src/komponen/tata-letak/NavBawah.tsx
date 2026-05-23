import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, FileText, User, Wallet } from 'lucide-react';
import { cn } from '@/utils/pembantu';

interface ItemNavBawah {
  ikon: React.ElementType;
  label: string;
  ke: string;
}

const daftarNav: ItemNavBawah[] = [
  { ikon: LayoutDashboard, label: 'Dasbor', ke: '/dasbor' },
  { ikon: ClipboardList, label: 'Absensi', ke: '/absensi' },
  { ikon: FileText, label: 'Izin', ke: '/izin' },
  { ikon: Wallet, label: 'Gaji', ke: '/gaji' },
  { ikon: User, label: 'Profil', ke: '/profil' },
];

/** Navigasi bawah untuk halaman pegawai (mobile) */
function NavBawah() {
  return (
    <nav className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
      <div className="grid grid-cols-5">
        {daftarNav.map(({ ikon: Ikon, label, ke }) => (
          <NavLink
            key={ke}
            to={ke}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-1 text-xs font-medium transition-colors duration-150',
                isActive ? 'text-primer-600 dark:text-primer-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Ikon
                  size={22}
                  className={cn(
                    'transition-transform duration-150',
                    isActive && 'scale-110'
                  )}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default NavBawah;
