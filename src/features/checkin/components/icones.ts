import {
  IconeAgua,
  IconeDieta,
  IconeJejum,
  IconeSono,
  IconeTreino,
  IconeVenci,
} from './IconesHabito'

/** Ícone de cada hábito do quadro da semana, com a cor da planilha. */
export const ICONES = {
  sono: { Icone: IconeSono, cor: 'text-tinta' },
  jejum: { Icone: IconeJejum, cor: 'text-coral' },
  agua: { Icone: IconeAgua, cor: 'text-[#4A9BD8]' },
  dieta: { Icone: IconeDieta, cor: 'text-verde-vivo' },
  treino: { Icone: IconeTreino, cor: 'text-tinta' },
  venci: { Icone: IconeVenci, cor: 'text-dourado' },
} as const
