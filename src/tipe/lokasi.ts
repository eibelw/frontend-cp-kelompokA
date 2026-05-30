/** Tipe data lokasi kantor dari API */
export interface LokasiKantor {
  id: string;
  kode: string;
  nama: string;
  latitude: number;
  longitude: number;
  radius: number;
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Tipe untuk membuat/memperbarui lokasi */
export interface LokasiKantorBody {
  kode: string;
  nama: string;
  latitude: number;
  longitude: number;
  radius: number;
}

/** Tipe koordinat GPS dari browser */
export interface KoordinatGPS {
  latitude: number;
  longitude: number;
  akurasi?: number;
}
