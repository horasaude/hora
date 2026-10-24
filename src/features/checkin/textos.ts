// Textos do check-in. Os componentes só leem daqui.

/** Quadro da semana, na ordem da planilha da Laís. Treino pede foto; Venci o dia marca sozinho quando os outros quatro estão feitos. */
export const HABITOS = [
  { id: 'sono', nome: 'Sono', foto: false, auto: false },
  { id: 'agua', nome: 'Hidratar-se', foto: false, auto: true },
  { id: 'dieta', nome: 'Dieta', foto: false, auto: false },
  { id: 'treino', nome: 'Treino', foto: true, auto: false },
  { id: 'venci', nome: 'Venci o dia?', foto: false, auto: true },
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

export const REFEICOES = [
  { id: 'cafe', nome: 'Café da manhã' },
  { id: 'almoco', nome: 'Almoço' },
  { id: 'lanche', nome: 'Lanche' },
  { id: 'jantar', nome: 'Jantar' },
] as const

export const textos = {
  titulo: 'Check-in de hoje',
  semana: (n: number) => `Semana ${String(n).padStart(2, '0')}`,
  diasCurtos: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  hoje: 'Hoje',
  pontosSemana: (n: number) => `${n.toLocaleString('pt-BR')} pts na semana`,
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
    qualRefeicao: 'Qual refeição?',
    faltaRefeicao: 'Escolha a refeição.',
    duracaoInvalida: 'Use de 1 a 600 minutos.',
  },
  agua: {
    titulo: 'Água de hoje',
    progresso: (total: string, meta: string) => `${total} de ${meta}`,
    copo: (ml: number) => `+ ${ml} ml`,
    desfazer: 'Desfazer',
    batida: 'Meta batida',
    pontos: (n: number) => `+${n} pts quando chegar à meta`,
  },
  lembrete: {
    ligar: 'Lembrar de beber água',
    ligado: 'Lembretes ligados (9h às 19h)',
    desligar: 'Desligar',
    negado: 'O celular não permitiu as notificações. Libere nas configurações do navegador.',
    instalar: 'Para receber lembretes no iPhone, instale o ORA na tela de início.',
  },
  notificacoes: {
    titulo: 'Notificações neste celular',
    ativar: 'Ativar notificações',
    agua: 'Lembrar de beber água (9h às 19h)',
    live: 'Avisar 1 hora antes da live',
  },
  pontosDia: {
    titulo: 'Seus pontos de hoje',
    total: (n: number) => `${n.toLocaleString('pt-BR')} pts hoje`,
    cada: (n: number) => `+${n} pts`,
    feito: 'Feito hoje',
    deN: (feitas: number, limite: number) => `${feitas} de ${limite} hoje`,
    vezes: (n: number) => (n === 1 ? '1 vez hoje' : `${n} vezes hoje`),
    falta: 'Ainda não',
    equipe: 'Dado pela equipe',
    ir: 'Fazer',
  },
  comoGanhar: {
    sono: { texto: 'Marque Sono no quadro da semana' },
    agua: { texto: 'Bata a meta de água do dia' },
    dieta: { texto: 'Marque Dieta no quadro da semana' },
    treino_foto: { texto: 'Marque Treino com a foto do treino', para: '/app/treinos' },
    venci: { texto: 'Marque Sono, Hidratar-se, Dieta e Treino no mesmo dia' },
    foto_refeicao: { texto: 'Mande a foto de uma refeição em Seu dia', para: '/app/dia' },
    aula_concluida: { texto: 'Conclua uma aula da trilha', para: '/app/trilha' },
    duvida_forum: { texto: 'Mande uma dúvida no fórum', para: '/app/forum' },
    duvida_util: { texto: 'Tenha sua dúvida marcada como útil' },
    live: { texto: 'Entre numa live ao vivo', para: '/app/lives' },
    indicacao: { texto: 'Indique uma amiga que assine o ORA', para: '/app/desafios#indicar' },
  } as Record<string, { texto: string; para?: string }>,
  seuDia: {
    titulo: 'Seu dia',
    verTudo: 'Ver tudo',
    voltar: 'Voltar para o Início',
    tentar: 'Tentar de novo',
    hoje: (n: number) => `${n.toLocaleString('pt-BR')} pts hoje`,
    pontos: (n: number) => (n === 1 ? '1 ponto' : `${n} pontos`),
    curtos: { sono: 'Sono', agua: 'Água', dieta: 'Dieta', treino: 'Treino' },
    sono: { nome: 'Dormi bem', sub: '7 horas ou mais' },
    agua: { nome: 'Água', copo: 'Copo de 250 ml' },
    dieta: { nome: 'Segui o cardápio', sub: '' },
    treino: { nome: 'Treino com foto', sub: 'Tire uma foto do treino' },
    refeicao: { nome: 'Foto da refeição', sub: 'Tire uma foto do prato' },
    enviadas: (nomes: string[]) => `Enviada: ${nomes.join(', ')}`,
    mini: (nome: string, feito: boolean) => `${nome}: ${feito ? 'feito' : 'não feito'}`,
    venci: {
      titulo: 'Venci o dia',
      marca: 'Marca sozinho',
      quando: 'quando os 4 hábitos do dia estão feitos',
      feito: 'Você venceu o dia!',
      ganhou: 'Marcado sozinho',
    },
    semana: 'Sua semana',
  },
  /** Ações que existem no banco mas não têm mais onde fazer (saem da lista da aluna). */
  semUso: ['cardio', 'tarefa'],
}
