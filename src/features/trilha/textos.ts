// Textos da trilha e da aula. Os componentes só leem daqui.

export const textos = {
  carregando: 'Carregando',
  erro: 'Não foi possível carregar. Tente de novo.',
  tentar: 'Tentar de novo',
  semAcesso: 'Seu acesso começa assim que o pagamento for confirmado.',
  vazio: 'As aulas aparecem aqui assim que forem liberadas.',
  preparacao: { titulo: 'Comece por aqui', subtitulo: '7 dias de preparação' },
  progresso: (pct: number, semana: number, faltam: number) =>
    `${pct}% da etapa · semana ${semana}` +
    (faltam === 0
      ? ' · etapa completa'
      : faltam === 1
        ? ' · falta 1 aula'
        : ` · faltam ${faltam} aulas`),
  rotuloProgresso: 'Progresso da etapa',
  abreEm: (data: string) => `Abre em ${data}`,
  minutos: (n: number) => `${n} min`,
  assistir: (titulo: string) => `Assistir: ${titulo}`,
  concluida: 'Concluída',
  aula: {
    voltar: 'Voltar para a trilha',
    fechada: 'Esta aula ainda não abriu.',
    material: 'Baixar material',
    marcar: 'Marcar como concluída',
    desmarcar: 'Concluída · desfazer',
    erroMarcar: 'Não foi possível salvar. Tente de novo.',
    semVideo: 'Não foi possível mostrar este vídeo.',
  },
}
