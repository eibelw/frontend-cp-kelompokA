import { AlertTriangle } from 'lucide-react';
import Modal, { FooterModal } from './Modal';
import Tombol from './Tombol';

interface PropsKonfirmasiHapus {
  terbuka: boolean;
  padaTutup: () => void;
  padaKonfirmasi: () => void;
  judul?: string;
  pesan?: string;
  sedangMemproses?: boolean;
}

/** Modal konfirmasi untuk aksi hapus/destruktif */
function KonfirmasiHapus({
  terbuka,
  padaTutup,
  padaKonfirmasi,
  judul = 'Konfirmasi Hapus',
  pesan = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  sedangMemproses = false,
}: PropsKonfirmasiHapus) {
  return (
    <Modal terbuka={terbuka} padaTutup={padaTutup} judul={judul} ukuran="kecil">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{pesan}</p>
      </div>

      <FooterModal>
        <Tombol varian="sekunder" onClick={padaTutup} disabled={sedangMemproses}>
          Batal
        </Tombol>
        <Tombol varian="bahaya" onClick={padaKonfirmasi} sedangMemuat={sedangMemproses}>
          Hapus
        </Tombol>
      </FooterModal>
    </Modal>
  );
}

export default KonfirmasiHapus;
