// Textos do check-in. Os componentes só leem daqui.

export const HABITOS = [
  { id: 'agua', nome: 'Água', tom: 'verde', foto: false },
  { id: 'treino', nome: 'Treino', tom: 'coral', foto: true },
  { id: 'cardio', nome: 'Cardio', tom: 'verde', foto: false },
  { id: 'tarefa', nome: 'Tarefa', tom: 'verde', foto: false },
  { id: 'refeicao', nome: 'Refeição', tom: 'verde', foto: true },
] as const

export type Habito = (typeof HABITOS)[number]['id']

export const TIPOS_TREINO = [
  { id: 'musculacao', nome: 'Musculação' },
  { id: 'caminhada', nome: 'Caminhada' },
  { id: 'corrida', nome: 'Corrida' },
  { id: 'funcional', nome: 'Funcional' },
  { id: 'outro', nome: 'Outro' },
] as const

export const textos = {
  titulo: 'Check-in de hoje',
  feito: (nome: string) => `${nome}: feito hoje`,
  marcar: (nome: string) => `Marcar ${nome}`,
  seguidos: (n: number) => (n === 1 ? '1 dia seguido' : `${n} dias seguidos`),
  semanaRotulo: (n: number) => `Check-in em ${n} dos últimos 7 dias`,
  erro: 'Não deu certo agora. Tente de novo.',
  carregando: 'Carregando seus check-ins',
  foto: {
    treino: 'Foto do treino',
    refeicao: 'Foto da refeição',
    tirar: 'Tirar ou escolher foto',
    trocar: 'Trocar foto',
    previa: 'Prévia da foto',
    tipo: 'Tipo de treino',
    duracao: 'Duração em minutos (opcional)',
    privado: 'Só você e as profissionais veem esta foto.',
    salvar: 'Salvar check-in',
    salvando: 'Enviando',
    cancelar: 'Cancelar',
    falta: 'Escolha uma foto para continuar.',
    faltaTipo: 'Escolha o tipo de treino.',
    duracaoInvalida: 'Use de 1 a 600 minutos.',
  },
}
