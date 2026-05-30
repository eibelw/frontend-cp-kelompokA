import { cn, ambilInisial } from '@/utils/pembantu';
import { URL_UPLOAD } from '@/utils/konstanta';

type UkuranAvatar = 'kecil' | 'sedang' | 'besar';

interface PropsAvatar {
  nama: string;
  ukuran?: UkuranAvatar;
  urlFoto?: string | null;
  className?: string;
}

const kelasUkuran: Record<UkuranAvatar, string> = {
  kecil: 'w-7 h-7 text-xs',
  sedang: 'w-9 h-9 text-sm',
  besar: 'w-12 h-12 text-base',
};

/** Komponen avatar berupa foto profil atau inisial nama pengguna */
function AvatarPengguna({ nama, ukuran = 'sedang', urlFoto, className }: PropsAvatar) {
  const inisial = ambilInisial(nama);

  if (urlFoto) {
    const src = urlFoto.startsWith('http') ? urlFoto : `${URL_UPLOAD}/${urlFoto.replace(/^\/uploads\//, '')}`;
    return (
      <img
        src={src}
        alt={nama}
        className={cn('rounded-full object-cover flex-shrink-0', kelasUkuran[ukuran], className)}
        title={nama}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primer-100 text-primer-700 font-semibold flex-shrink-0',
        kelasUkuran[ukuran],
        className
      )}
      title={nama}
      aria-label={`Avatar ${nama}`}
    >
      {inisial}
    </div>
  );
}

export default AvatarPengguna;
