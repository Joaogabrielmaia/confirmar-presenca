export interface FlorConfig {
  slug: string;
  nome: string;
  limiteMaximo: number;
  descricao: string;
  corTheme: string;
}

export const MAPA_FLORES: Record<string, FlorConfig> = {
  margarida: {
    slug: 'margarida',
    nome: 'Margarida',
    limiteMaximo: 1,
    descricao: 'Convite Individual (1 pessoa)',
    corTheme: 'from-amber-100 to-rose-100',
  },
  orquidea: {
    slug: 'orquidea',
    nome: 'Orquídea',
    limiteMaximo: 2,
    descricao: 'Convite para até 2 pessoas',
    corTheme: 'from-purple-100 to-pink-100',
  },
  tulipa: {
    slug: 'tulipa',
    nome: 'Tulipa',
    limiteMaximo: 3,
    descricao: 'Convite para até 3 pessoas',
    corTheme: 'from-rose-100 to-red-100',
  },
  lirio: {
    slug: 'lirio',
    nome: 'Lírio',
    limiteMaximo: 4,
    descricao: 'Convite para até 4 pessoas',
    corTheme: 'from-pink-100 to-rose-100',
  },
  girassol: {
    slug: 'girassol',
    nome: 'Girassol',
    limiteMaximo: 5,
    descricao: 'Convite para até 5 pessoas',
    corTheme: 'from-amber-100 to-yellow-100',
  },
};

export function normalizarSlugFlor(slug: string): string {
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function obterConfigFlor(slug: string): FlorConfig | null {
  const slugNormalizado = normalizarSlugFlor(slug);
  return MAPA_FLORES[slugNormalizado] || null;
}
