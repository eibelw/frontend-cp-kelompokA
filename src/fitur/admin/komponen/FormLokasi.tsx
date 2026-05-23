import { useState, useEffect } from 'react';
import Modal, { FooterModal } from '@/komponen/ui/Modal';
import Input from '@/komponen/ui/Input';
import Tombol from '@/komponen/ui/Tombol';
import Peringatan from '@/komponen/ui/Peringatan';
import type { LokasiKantor, LokasiKantorBody } from '@/tipe/lokasi';
import { ambilPesanError } from '@/api/klien';

interface PropsFormLokasi {
  terbuka: boolean;
  padaTutup: () => void;
  padaSimpan: (data: LokasiKantorBody) => Promise<boolean>;
  lokasiDiedit?: LokasiKantor | null;
}

/** Modal form tambah / edit lokasi kantor */
function FormLokasi({ terbuka, padaTutup, padaSimpan, lokasiDiedit }: PropsFormLokasi) {
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('100');
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState('');

  const modeEdit = lokasiDiedit != null;

  useEffect(() => {
    if (lokasiDiedit) {
      setKode(lokasiDiedit.kode);
      setNama(lokasiDiedit.nama);
      setLatitude(String(lokasiDiedit.latitude));
      setLongitude(String(lokasiDiedit.longitude));
      setRadius(String(lokasiDiedit.radius));
    } else {
      resetForm();
    }
  }, [lokasiDiedit]);

  function resetForm() {
    setKode('');
    setNama('');
    setLatitude('');
    setLongitude('');
    setRadius('100');
    setPesanError('');
  }

  function validasi(): boolean {
    if (!kode.trim()) { setPesanError('Kode lokasi tidak boleh kosong'); return false; }
    if (!/^[A-Z0-9]+$/.test(kode.trim())) { setPesanError('Kode hanya boleh huruf kapital dan angka'); return false; }
    if (!nama.trim()) { setPesanError('Nama lokasi tidak boleh kosong'); return false; }
    if (!latitude || isNaN(Number(latitude))) { setPesanError('Latitude tidak valid'); return false; }
    if (!longitude || isNaN(Number(longitude))) { setPesanError('Longitude tidak valid'); return false; }
    if (!radius || Number(radius) < 10 || Number(radius) > 100) { setPesanError('Radius minimal 10 meter dan maksimal 100 meter'); return false; }
    return true;
  }

  async function kirimForm() {
    if (!validasi()) return;

    setSedangMemuat(true);
    setPesanError('');

    try {
      const berhasil = await padaSimpan({
        kode: kode.trim().toUpperCase(),
        nama: nama.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: Number(radius),
      });
      if (berhasil) { resetForm(); padaTutup(); }
    } catch (err) {
      setPesanError(ambilPesanError(err));
    } finally {
      setSedangMemuat(false);
    }
  }

  function tutupModal() { resetForm(); padaTutup(); }

  return (
    <Modal
      terbuka={terbuka}
      padaTutup={tutupModal}
      judul={modeEdit ? 'Edit Lokasi Kantor' : 'Tambah Lokasi Kantor'}
    >
      <div className="space-y-4">
        {pesanError && <Peringatan varian="gagal">{pesanError}</Peringatan>}

        <Input
          label="Kode Lokasi"
          placeholder="Contoh: PUSAT"
          value={kode}
          onChange={(e) => setKode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
          bantuanTeks="Maks 10 karakter. Digunakan sebagai prefix ID pegawai."
          maxLength={10}
          disabled={modeEdit}
          required
        />

        <Input
          label="Nama Lokasi"
          placeholder="Contoh: Kantor Pusat"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Latitude"
            placeholder="Contoh: -6.200000"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            bantuanTeks="Koordinat GPS lintang"
            required
          />
          <Input
            label="Longitude"
            placeholder="Contoh: 106.816666"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            bantuanTeks="Koordinat GPS bujur"
            required
          />
        </div>

        <Input
          label="Radius (meter)"
          type="number"
          min={10}
          max={50}
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault();
          }}
          bantuanTeks="Jarak maksimum yang diperbolehkan dari titik kantor"
          required
        />
      </div>

      <FooterModal>
        <Tombol varian="sekunder" onClick={tutupModal} disabled={sedangMemuat}>
          Batal
        </Tombol>
        <Tombol onClick={kirimForm} sedangMemuat={sedangMemuat}>
          {modeEdit ? 'Simpan Perubahan' : 'Tambah Lokasi'}
        </Tombol>
      </FooterModal>
    </Modal>
  );
}

export default FormLokasi;
