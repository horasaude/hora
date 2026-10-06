// Textos do módulo Pontos e indicações. Os componentes só leem daqui.

export const ACOES: Record<string, string> = {
  treino_foto: 'Treino com foto',
  agua: 'Água',
  cardio: 'Cardio',
  tarefa: 'Tarefa do dia',
  foto_refeicao: 'Foto da refeição',
  aula_concluida: 'Concluir aula',
  duvida_forum: 'Dúvida no fórum',
  duvida_util: 'Dúvida útil',
  live: 'Entrar na live',
  indicacao: 'Indicação confirmada',
  desafio_checkin: 'Check-in de desafio',
  desafio_bonus: 'Bônus de desafio',
  ajuste: 'Ajuste',
  estorno: 'Estorno',
}

const POR_ITEM: Record<string, string> = {
  aula_concluida: '1 por aula',
  live: '1 por live',
  indicacao: '1 por indicação',
}

export const t = {
  titulo: 'Pontos e indicações',
  cartoes: {
    pontos: 'Pontos distribuídos no mês',
    checkins: 'Check-ins de hoje',
    indicacoes: 'Indicações confirmadas no mês',
    denunciadas: 'Fotos denunciadas',
  },
  abas: {
    regras: 'Regras',
    historico: 'Histórico',
    fotos: 'Fotos de treino',
    indicacoes: 'Indicações',
  },
  limite: (tipo: string, qtd: number | null, acao: string) =>
    tipo === 'sem_limite'
      ? 'Sem limite'
      : tipo === 'por_dia'
        ? qtd === 1
          ? '1 por dia'
          : `Até ${qtd} por dia`
        : (POR_ITEM[acao] ?? '1 por item'),
  regras: {
    colunas: ['Ação', 'Valor', 'Limite', 'Ativa', ''],
    editar: 'Editar regra',
    pontos: 'Pontos',
    limiteTipo: 'Limite',
    tipos: { por_dia: 'Por dia', por_referencia: 'Uma vez por item', sem_limite: 'Sem limite' },
    qtd: 'Quantas vezes por dia',
    ativa: (nome: string) => `${nome} ativa`,
    erro: 'Use pontos de 0 a 10000 e de 1 a 50 vezes por dia',
  },
  historico: {
    colunas: ['Aluna', 'Ação', 'Pontos', 'Data'],
    aluna: 'Aluna',
    acao: 'Ação',
    mes: 'Mês',
    todas: 'Todas',
    ajuste: 'Lançar ajuste',
    dar: 'Dar pontos',
    tirar: 'Tirar pontos',
    quantidade: 'Quantidade',
    motivo: 'Motivo',
    erroAjuste: 'Escolha a aluna, a quantidade (1 a 10000) e escreva o motivo',
    vazio: 'Nenhum lançamento neste filtro.',
  },
  fotos: {
    vazio: 'Nenhuma foto de treino ainda.',
    invalidar: 'Invalidar foto',
    confirmar: 'Invalidar e estornar os pontos?',
    invalidada: 'Invalidada',
    denunciada: (n: number) => (n === 1 ? '1 denúncia' : `${n} denúncias`),
    motivo: 'Motivo (opcional)',
    motivoPadrao: 'Foto invalidada pela equipe',
    dados: { aluna: 'Aluna', data: 'Data', treino: 'Treino', checkin: 'Check-in' },
    tipos: {
      treino: 'Treino',
      refeicao: 'Refeição',
      agua: 'Água',
      cardio: 'Cardio',
      tarefa: 'Tarefa',
    } as Record<string, string>,
  },
  indicacoes: {
    colunas: ['Quem indicou', 'Quem entrou', 'Data', 'Garantia até', 'Situação'],
    vazio: 'Nenhuma indicação ainda.',
    status: {
      aguardando: 'Aguardando garantia',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
    } as Record<string, string>,
  },
  link: 'Link de indicação',
  fechar: 'Fechar',
  cancelar: 'Cancelar',
  salvar: 'Salvar',
  salvando: 'Salvando',
  erro: 'Não foi possível salvar. Tente de novo.',
  semResultado: 'Nada encontrado.',
}

export const linkIndicacao = (codigo: string) => `${window.location.origin}/?ind=${codigo}`
