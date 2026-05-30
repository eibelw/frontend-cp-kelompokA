import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PenyediaOtentikasi } from '@/konteks/KonteksOtentikasi';
import { PenyediaNotifikasi } from '@/konteks/KonteksNotifikasi';
import { PenyediaTema } from '@/konteks/KonteksTema';
import KontainerNotifikasi from '@/komponen/ui/KontainerNotifikasi';
import RuteTerlindungi from '@/komponen/umum/RuteTerlindungi';
import RuteAdmin from '@/komponen/umum/RuteAdmin';
import TataLetakPegawai from '@/komponen/tata-letak/TataLetakPegawai';
import TataLetakAdmin from '@/komponen/tata-letak/TataLetakAdmin';
import { PemuatHalaman } from '@/komponen/ui/Pemuat';

// Lazy loading semua halaman untuk performa lebih baik
const HalamanMasuk = lazy(() => import('@/fitur/otentikasi/halaman/HalamanMasuk'));
const HalamanDasbor = lazy(() => import('@/fitur/absensi/halaman/HalamanDasbor'));
const HalamanRiwayatAbsensi = lazy(() => import('@/fitur/absensi/halaman/HalamanRiwayatAbsensi'));
const HalamanIzin = lazy(() => import('@/fitur/izin/halaman/HalamanIzin'));
const HalamanProfil = lazy(() => import('@/fitur/profil/halaman/HalamanProfil'));
const HalamanDasborAdmin = lazy(() => import('@/fitur/admin/halaman/HalamanDasborAdmin'));
const HalamanPegawai = lazy(() => import('@/fitur/admin/halaman/HalamanPegawai'));
const HalamanAbsensiAdmin = lazy(() => import('@/fitur/admin/halaman/HalamanAbsensiAdmin'));
const HalamanIzinAdmin = lazy(() => import('@/fitur/admin/halaman/HalamanIzinAdmin'));
const HalamanLokasi = lazy(() => import('@/fitur/admin/halaman/HalamanLokasi'));
const HalamanEkspor = lazy(() => import('@/fitur/admin/halaman/HalamanEkspor'));
const HalamanGaji = lazy(() => import('@/fitur/gaji/halaman/HalamanGaji'));
const HalamanGajiAdmin = lazy(() => import('@/fitur/admin/halaman/HalamanGajiAdmin'));
const HalamanTidakDitemukan = lazy(() => import('@/halaman/HalamanTidakDitemukan'));

/** Komponen utama aplikasi dengan semua provider dan routing */
function App() {
  return (
    <BrowserRouter>
      <PenyediaTema>
      <PenyediaNotifikasi>
        <PenyediaOtentikasi>
          {/* Notifikasi toast global */}
          <KontainerNotifikasi />

          <Suspense fallback={<PemuatHalaman />}>
            <Routes>
              {/* Redirect dari root ke halaman masuk */}
              <Route path="/" element={<Navigate to="/masuk" replace />} />

              {/* Halaman login (publik) */}
              <Route path="/masuk" element={<HalamanMasuk />} />

              {/* Halaman pegawai (membutuhkan login) */}
              <Route
                element={
                  <RuteTerlindungi>
                    <TataLetakPegawai />
                  </RuteTerlindungi>
                }
              >
                <Route path="/dasbor" element={<HalamanDasbor />} />
                <Route path="/absensi" element={<HalamanRiwayatAbsensi />} />
                <Route path="/izin" element={<HalamanIzin />} />
                <Route path="/gaji" element={<HalamanGaji />} />
                <Route path="/profil" element={<HalamanProfil />} />
              </Route>

              {/* Halaman admin (membutuhkan login + peran admin) */}
              <Route
                element={
                  <RuteAdmin>
                    <TataLetakAdmin />
                  </RuteAdmin>
                }
              >
                <Route path="/admin/dasbor" element={<HalamanDasborAdmin />} />
                <Route path="/admin/pegawai" element={<HalamanPegawai />} />
                <Route path="/admin/absensi" element={<HalamanAbsensiAdmin />} />
                <Route path="/admin/izin" element={<HalamanIzinAdmin />} />
                <Route path="/admin/lokasi" element={<HalamanLokasi />} />
                <Route path="/admin/ekspor" element={<HalamanEkspor />} />
                <Route path="/admin/gaji" element={<HalamanGajiAdmin />} />
              </Route>

              {/* Halaman 404 */}
              <Route path="*" element={<HalamanTidakDitemukan />} />
            </Routes>
          </Suspense>
        </PenyediaOtentikasi>
      </PenyediaNotifikasi>
      </PenyediaTema>
    </BrowserRouter>
  );
}

export default App;
