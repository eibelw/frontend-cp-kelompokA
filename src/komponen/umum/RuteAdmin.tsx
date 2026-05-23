import { Navigate } from 'react-router-dom';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';
import { PemuatHalaman } from '@/komponen/ui/Pemuat';

interface PropsRuteAdmin {
  children: React.ReactNode;
}

/** Membungkus rute yang hanya bisa diakses oleh admin. */
function RuteAdmin({ children }: PropsRuteAdmin) {
  const { sudahDiotentikasi, sedangMemuat, pengguna } = gunakanOtentikasi();

  if (sedangMemuat) {
    return <PemuatHalaman />;
  }

  if (!sudahDiotentikasi) {
    return <Navigate to="/masuk" replace />;
  }

  if (pengguna?.peran !== 'admin') {
    return <Navigate to="/dasbor" replace />;
  }

  return <>{children}</>;
}

export default RuteAdmin;
