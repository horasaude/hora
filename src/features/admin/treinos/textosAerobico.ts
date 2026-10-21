// Textos dos aeróbicos dentro do tipo de treino (painel).

export const aerobicos = {
  titulo: 'Aeróbicos',
  abrir: '+ Adicionar aeróbico',
  adicionar: 'Adicionar aeróbico',
  novo: 'Novo aeróbico',
  existente: 'Aeróbico',
  modalidade: 'Modalidade',
  minutos: 'Duração (min)',
  intensidade: 'Intensidade',
  intensidades: ['Leve', 'Moderada', 'Forte'],
  observacao: 'Observação (opcional)',
  dias: 'Dias',
  semDia: 'Escolha pelo menos um dia',
  semModalidade: 'Escolha a modalidade',
  nome: (modalidade: string, min: number) => `${modalidade} ${min} min`,
  aerobicosN: (n: number) => (n === 1 ? '+ 1 aeróbico' : `+ ${n} aeróbicos`),
  nenhum: 'Nenhum aeróbico neste tipo de treino.',
  tirar: (nome: string) => `Tirar ${nome}`,
  erro: 'Não foi possível criar o aeróbico. Tente de novo.',
}
