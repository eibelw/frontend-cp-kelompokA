import { useRef } from 'react';
import { User, Mail, Phone, Building2, Briefcase, Hash, Camera, PersonStanding } from 'lucide-react';
import { Kartu } from '@/komponen/ui/Kartu';
import AvatarPengguna from '@/komponen/ui/AvatarPengguna';
import Badge from '@/komponen/ui/Badge';
import FormUbahKataSandi from '../komponen/FormUbahKataSandi';
import { gunakanOtentikasi } from '@/konteks/KonteksOtentikasi';
import { gunakanNotifikasi } from '@/konteks/KonteksNotifikasi';
import { ambilPesanError } from '@/api/klien';
import { unggahFotoProfil } from '../api/profilApi';
import { LABEL_PERAN } from '@/utils/konstanta';

const LABEL_JENIS_KELAMIN: Record<string, string> = {
  'laki-laki': 'Laki-laki',
  perempuan: 'Perempuan',
};

/** Baris informasi profil */
function BarisProfil({ ikon: Ikon, label, nilai }: { ikon: React.ElementType; label: string; nilai?: string | null }) {
  if (!nilai) return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
        <Ikon size={16} className="text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{nilai}</p>
      </div>
    </div>
  );
}

/** Halaman profil pengguna */
function HalamanProfil() {
  const { pengguna, perbaruiPengguna } = gunakanOtentikasi();
  const { sukses, gagal } = gunakanNotifikasi();
  const inputFoto = useRef<HTMLInputElement>(null);

  if (!pengguna) return null;

  async function tanganiGantiFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const hasil = await unggahFotoProfil(file);
      perbaruiPengguna({ ...pengguna!, urlFoto: hasil.urlFoto });
      sukses('Berhasil', 'Foto profil diperbarui');
    } catch (err) {
      gagal('Gagal', ambilPesanError(err));
    }
    e.target.value = '';
  }

  return (
    <div className="space-y-5 animate-masuk-bawah">
      {/* Kartu identitas */}
      <Kartu>
        {/* Avatar dan nama */}
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative flex-shrink-0">
            <AvatarPengguna nama={pengguna.nama} urlFoto={pengguna.urlFoto} ukuran="besar" />
            <button
              onClick={() => inputFoto.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primer-600 hover:bg-primer-700 text-white flex items-center justify-center shadow-md transition-colors"
              title="Ganti foto"
            >
              <Camera size={13} />
            </button>
            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={tanganiGantiFoto}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{pengguna.nama}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge varian={pengguna.peran === 'admin' ? 'ungu' : 'biru'}>
                {LABEL_PERAN[pengguna.peran]}
              </Badge>
              {pengguna.aktif && <Badge varian="hijau">Aktif</Badge>}
            </div>
          </div>
        </div>

        {/* Detail informasi */}
        <div>
          <BarisProfil ikon={Hash} label="ID Pegawai" nilai={pengguna.idPegawai} />
          <BarisProfil ikon={Mail} label="Email" nilai={pengguna.email} />
          <BarisProfil ikon={Phone} label="Telepon" nilai={pengguna.telepon} />
          <BarisProfil ikon={Building2} label="Departemen" nilai={pengguna.departemen} />
          <BarisProfil ikon={Briefcase} label="Jabatan" nilai={pengguna.jabatan} />
          <BarisProfil
            ikon={PersonStanding}
            label="Jenis Kelamin"
            nilai={pengguna.jenisKelamin ? LABEL_JENIS_KELAMIN[pengguna.jenisKelamin] : null}
          />
          <BarisProfil ikon={User} label="Status" nilai={pengguna.aktif ? 'Aktif' : 'Nonaktif'} />
        </div>
      </Kartu>

      {/* Form ubah kata sandi */}
      <FormUbahKataSandi />
    </div>
  );
}

export default HalamanProfil;
