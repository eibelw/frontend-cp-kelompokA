import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type ModeTema = 'terang' | 'gelap';

interface KonteksTemaTipe {
  tema: ModeTema;
  gantiTema: () => void;
}

const KonteksTema = createContext<KonteksTemaTipe | null>(null);

const KUNCI_TEMA = 'tema-preferensi';

export function PenyediaTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<ModeTema>(() => {
    const tersimpan = localStorage.getItem(KUNCI_TEMA);
    if (tersimpan === 'gelap' || tersimpan === 'terang') return tersimpan;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (tema === 'gelap') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(KUNCI_TEMA, tema);
  }, [tema]);

  function gantiTema() {
    setTema((prev) => (prev === 'terang' ? 'gelap' : 'terang'));
  }

  return (
    <KonteksTema.Provider value={{ tema, gantiTema }}>
      {children}
    </KonteksTema.Provider>
  );
}

export function gunakanTema(): KonteksTemaTipe {
  const konteks = useContext(KonteksTema);
  if (!konteks) throw new Error('gunakanTema harus dipakai di dalam PenyediaTema');
  return konteks;
}
