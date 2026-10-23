// Textos do Início. Os componentes só leem daqui.

export const textos = {
  topo: {
    dia: (n: number) => `Dia ${n} da sua jornada`,
    oi: (nome: string) => (nome ? `Oi, ${nome}` : 'Oi'),
    sino: 'Notificações',
  },
  pontos: {
    rotulo: 'pontos no mês',
    seguidos: (n: number) => (n === 1 ? '1 dia seguido' : `${n} dias seguidos`),
    lugar: (n: number) => `${n}º lugar`,
    noRanking: 'no ranking',
    ver: 'Ver ranking',
  },
  pedido: 'Pedido da equipe',
  aula: {
    titulo: 'Continue de onde parou',
    abrir: (t: string) => `Continuar a aula: ${t}`,
    etiqueta: (tema: string, n: number) => (n > 0 ? `${tema} · Aula ${n}` : tema),
    duracao: (min: number) => `${min} min`,
  },
  live: { titulo: 'Próxima live' },
  consulta: {
    titulo: 'Quero agendar uma consulta individual',
    botao: 'Chamar no WhatsApp',
    mensagem: 'Sou aluna da ORA e gostaria de agendar uma consulta individual.',
    profissionais: [
      { nome: 'Ana Milhomem', area: 'Nutricionista', whatsapp: '34993159319' },
      { nome: 'Dra. Clara Maria', area: 'Médica', whatsapp: '34991463277' },
      { nome: 'Laís Moraes', area: 'Personal trainer', whatsapp: '34998333744' },
    ],
  },
  semAcesso: 'Seu acesso começa assim que o pagamento for confirmado.',
  carregando: 'Carregando o Início',
  erro: 'Não foi possível carregar o Início.',
  tentar: 'Tentar de novo',
}
