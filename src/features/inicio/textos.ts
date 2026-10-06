// Textos do Início. Os componentes só leem daqui.

export const textos = {
  painel: 'Painel das profissionais',
  forum: 'Ir para o fórum',
  checkin: {
    titulo: 'Check-in de hoje',
    habitos: [
      { id: 'agua', nome: 'Água', tom: 'salvia' },
      { id: 'treino', nome: 'Treino', tom: 'terracota' },
      { id: 'cardio', nome: 'Cardio', tom: 'salvia' },
      { id: 'tarefa', nome: 'Tarefa', tom: 'salvia' },
    ],
    feito: (nome: string) => `${nome}, feito`,
    seguidos: (n: number) => (n === 1 ? '1 dia seguido' : `${n} dias seguidos`),
  },
  aula: { titulo: 'Aula de hoje', abrir: (t: string) => `Abrir a aula de hoje: ${t}` },
  live: (quando: string, tema: string) => `Live ${quando} · ${tema}`,
  ranking: {
    voce: 'Você está em',
    lugar: (n: number) => `${n}º lugar`,
    pontos: (n: number) => `+${n} pts na última live`,
  },
  semAcesso: 'Seu acesso começa assim que o pagamento for confirmado.',
}

/** Valores de exemplo até check-in, sequência e ranking virem do banco. */
export const exemplo = {
  feitos: ['agua', 'treino'],
  diasSeguidos: 5,
  posicao: 4,
  pontosUltimaAcao: 75,
}
