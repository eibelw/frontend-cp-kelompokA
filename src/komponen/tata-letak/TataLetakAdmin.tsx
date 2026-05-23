import { Outlet } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';

/** Layout halaman admin: sidebar kiri + konten kanan */
function TataLetakAdmin() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <SidebarAdmin />

      {/* Area konten utama */}
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 lg:pt-8 lg:pl-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TataLetakAdmin;
