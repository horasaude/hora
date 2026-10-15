// Textos do check-in. Os componentes só leem daqui.

/** Quadro da semana, na ordem da planilha da Laís. Treino pede foto (pontos de treino com foto). */
export const HABITOS = [
  { id: 'sono', nome: 'Sono', foto: false },
  { id: 'jejum', nome: 'Jejum intermitente', foto: false },
  { id: 'agua', nome: 'Hidratar-se', foto: false },
  { id: 'dieta', nome: 'Dieta', foto: false },
  { id: 'treino', nome: 'Treino', foto: true },
  { id: 'venci', nome: 'Venci o dia?', foto: false },
] as const

/** Todos os tipos de check-in do banco (refeição com foto continua no cardápio). */
export type Habito = (typeof HABITOS)[number]['id'] | 'refeicao' | 'cardio' | 'tarefa'

export const TIPOS_TREINO = [
  { id: 'musculacao', nome: 'Musculação' },
  { id: 'caminhada', nome: 'Caminhada' },
  { id: 'corrida', nome: 'Corrida' },
  { id: 'funcional', nome: 'Funcional' },
  { id: 'outro', nome: 'Outro' },
] as const

export const textos = {
  titulo: 'Check-in de hoje',
  semana: (n: number) => `Semana ${String(n).padStart(2, '0')}`,
  diasCurtos: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  hoje: 'Hoje',
  dia: (habito: string, dia: string, feito: boolean) =>
    `${habito}, ${dia}: ${feito ? 'feito' : 'não feito'}`,
  feito: (nome: string) => `${nome}: feito hoje`,
  marcar: (nome: string) => `Marcar ${nome}`,
  seguidos: (n: number) => (n === 1 ? '1 dia seguido' : `${n} dias seguidos`),
  semanaRotulo: (n: number) => `Check-in em ${n} dos últimos 7 dias`,
  erro: 'Não deu certo agora. Tente de novo.',
  refeicaoFeita: 'Refeição registrada hoje',
  treinoFeito: 'Treino registrado hoje',
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
