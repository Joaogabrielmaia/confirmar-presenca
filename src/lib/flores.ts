export interface FlorConfig {
  slug: string;
  nome: string;
  limiteMaximo: number;
  descricao: string;
  lote: string;
  dataLimite: Date;
}

const DATA_SETEMBRO = new Date(2026, 8, 30, 23, 59, 59); // 30/09/2026
const DATA_OUTUBRO = new Date(2026, 9, 10, 23, 59, 59);  // 10/10/2026

export const MAPA_FLORES: Record<string, FlorConfig> = {
  // LOTE 1 - Prazo: 30/09 às 23:59
  margarida: {
    slug: 'margarida',
    nome: 'Margarida',
    limiteMaximo: 1,
    descricao: 'Convite Individual (1 pessoa)',
    lote: 'Lote 1 (Até 30/09)',
    dataLimite: DATA_SETEMBRO,
  },
  orquidea: {
    slug: 'orquidea',
    nome: 'Orquídea',
    limiteMaximo: 2,
    descricao: 'Convite para até 2 pessoas',
    lote: 'Lote 1 (Até 30/09)',
    dataLimite: DATA_SETEMBRO,
  },
  tulipa: {
    slug: 'tulipa',
    nome: 'Tulipa',
    limiteMaximo: 3,
    descricao: 'Convite para até 3 pessoas',
    lote: 'Lote 1 (Até 30/09)',
    dataLimite: DATA_SETEMBRO,
  },
  lirio: {
    slug: 'lirio',
    nome: 'Lírio',
    limiteMaximo: 4,
    descricao: 'Convite para até 4 pessoas',
    lote: 'Lote 1 (Até 30/09)',
    dataLimite: DATA_SETEMBRO,
  },
  girassol: {
    slug: 'girassol',
    nome: 'Girassol',
    limiteMaximo: 5,
    descricao: 'Convite para até 5 pessoas',
    lote: 'Lote 1 (Até 30/09)',
    dataLimite: DATA_SETEMBRO,
  },

  // LOTE 2 - Prazo Estendido: 10/10 às 23:59
  rosa: {
    slug: 'rosa',
    nome: 'Rosa',
    limiteMaximo: 1,
    descricao: 'Convite Individual (1 pessoa)',
    lote: 'Lote 2 (Até 10/10)',
    dataLimite: DATA_OUTUBRO,
  },
  violeta: {
    slug: 'violeta',
    nome: 'Violeta',
    limiteMaximo: 2,
    descricao: 'Convite para até 2 pessoas',
    lote: 'Lote 2 (Até 10/10)',
    dataLimite: DATA_OUTUBRO,
  },
  jasmim: {
    slug: 'jasmim',
    nome: 'Jasmim',
    limiteMaximo: 3,
    descricao: 'Convite para até 3 pessoas',
    lote: 'Lote 2 (Até 10/10)',
    dataLimite: DATA_OUTUBRO,
  },
  hortensia: {
    slug: 'hortensia',
    nome: 'Hortênsia',
    limiteMaximo: 4,
    descricao: 'Convite para até 4 pessoas',
    lote: 'Lote 2 (Até 10/10)',
    dataLimite: DATA_OUTUBRO,
  },
  camelia: {
    slug: 'camelia',
    nome: 'Camélia',
    limiteMaximo: 5,
    descricao: 'Convite para até 5 pessoas',
    lote: 'Lote 2 (Até 10/10)',
    dataLimite: DATA_OUTUBRO,
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
