import { Navigate, useLocation } from 'react-router-dom';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';
import { PemuatHalaman } from '@/komponen/ui/Pemuat';

interface PropsRuteTerlindungi {
  children: React.ReactNode;
}

/** Membungkus rute yang membutuhkan autentikasi. Redirect ke /masuk jika belum login. */
function RuteTerlindungi({ children }: PropsRuteTerlindungi) {
  const { sudahDiotentikasi, sedangMemuat } = gunakanOtentikasi();
  const lokasi = useLocation();

  if (sedangMemuat) {
    return <PemuatHalaman />;
  }

  if (!sudahDiotentikasi) {
    return <Navigate to="/masuk" state={{ dari: lokasi }} replace />;
  }

  return <>{children}</>;
}

export default RuteTerlindungi;
