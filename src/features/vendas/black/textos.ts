// Página da Black ORA (até 30/11/2026). Preço: 12 mensalidades de R$ 87,90 no cartão.

export const FIM_BLACK = new Date('2026-11-30T23:59:59-03:00')

/** Cupom criado no painel: R$ 129,80 de desconto só no mensal (217,70 - 129,80 = 87,90). */
export const OFERTA_BLACK = { cupom: 'BLACK87', valor: '12x R$ 87,90' }

export const black = {
  faixa: 'Black ORA termina em',
  encerrada: 'A Black ORA terminou',
  hero: {
    etiqueta: 'Black Friday ORA · só até 30/11',
    titulo: 'Médica, nutricionista e educadora física cuidando de você por',
    preco: 'R$ 87,90',
    porMes: 'por mês',
    subtitulo:
      'O menor valor que a ORA já teve. São 12 meses com a gente, num app só, para você parar de recomeçar toda segunda.',
    video: 'Toque para ouvir',
    botao: 'Quero entrar na Black ORA',
    apoio: ['12x de R$ 87,90', 'Não ocupa o limite do cartão', 'Garantia de 7 dias'],
  },
  prova: {
    etiqueta: 'Resultados reais',
    titulo: 'Elas decidiram cuidar de si.',
    destaque: 'E o corpo respondeu.',
    texto:
      'Pacientes acompanhadas pela Ana Milhomem. Cada corpo tem o seu tempo, e é exatamente isso que a gente respeita.',
    nota: 'Os resultados variam de pessoa para pessoa.',
    alt: (n: number) => `Antes e depois de uma paciente, foto ${n}`,
    arrastar: 'Arraste para o lado e veja mais',
  },
  problema: {
    etiqueta: 'Seja sincera',
    titulo: 'Quantas vezes você já',
    destaque: 'recomeçou?',
    frases: [
      'Baixou a dieta.',
      'Começou na segunda.',
      'Parou na quarta.',
      'Voltou para o mesmo lugar.',
      'E achou que o problema era você.',
    ],
    fecho: 'Não faltou força de vontade. Faltou companhia.',
  },
  equipe: {
    etiqueta: 'Quem cuida de você',
    titulo: 'Três especialistas.',
    destaque: 'Um só caminho.',
    pessoas: [
      { nome: 'Dra. Clara Maria', papel: 'Médica', foto: '/fotos/clara.webp' },
      { nome: 'Ana Milhomem', papel: 'Nutricionista', foto: '/fotos/ana.webp' },
      { nome: 'Laís Moraes', papel: 'Educadora física', foto: '/fotos/lais.webp' },
    ],
  },
  recebe: {
    etiqueta: 'Tudo isso por R$ 87,90',
    titulo: 'O que você',
    destaque: 'recebe',
    itens: [
      '7 dias de preparação para organizar a sua rotina',
      'Trilhas por tema, liberadas no seu ritmo',
      'Cardápios da nutricionista, prontos no app',
      'Treinos com vídeo para fazer em casa ou na academia',
      'Lives quinzenais com as três, gravadas para você',
      'Check-in diário de sono, água, dieta e treino',
      'Desafios, ranking e prêmios para manter a constância',
      'Comunidade de mulheres caminhando com você',
    ],
  },
  oferta: {
    etiqueta: 'Black ORA',
    de: 'De 12x R$ 217,70',
    por: 'por 12x',
    preco: 'R$ 87,90',
    dia: 'Menos de R$ 3 por dia',
    economia: 'Você economiza R$ 1.557,60 no ano',
    contagem: 'Esse valor acaba em',
    unidades: ['dias', 'horas', 'min', 'seg'],
    botao: 'Garantir meu lugar por R$ 87,90',
    seguro: 'Compra segura. O acesso chega no seu e-mail assim que o pagamento for aprovado.',
  },
  garantia: {
    selo: '7 dias',
    titulo: 'Risco zero para você',
    texto:
      'Entrou e não era o que esperava? Peça a devolução em até 7 dias e receba o valor de volta.',
  },
  perguntas: {
    titulo: 'Ficou alguma',
    destaque: 'dúvida?',
    itens: [
      {
        p: 'Até quando vale o valor de R$ 87,90?',
        r: 'Até 30/11, às 23h59. Depois disso a mensalidade volta para R$ 217,70.',
      },
      {
        p: 'Os R$ 87,90 valem só no primeiro mês?',
        r: 'Não. Você paga R$ 87,90 em cada uma das 12 mensalidades.',
      },
      {
        p: 'Vai ocupar o limite do meu cartão?',
        r: 'Não. A cobrança acontece mês a mês, como uma assinatura.',
      },
      {
        p: 'Quando recebo o acesso?',
        r: 'Assim que o pagamento é aprovado. Você começa pelas boas-vindas e pelos 7 dias de preparação.',
      },
      { p: 'E se eu perder uma live?', r: 'Todas ficam gravadas para você assistir quando puder.' },
      {
        p: 'Consigo usar pelo celular?',
        r: 'Sim. A ORA funciona no celular e no computador, e você pode instalar como aplicativo.',
      },
    ],
  },
  final: {
    titulo: 'A Black termina dia 30.',
    destaque: 'O seu cuidado pode começar hoje.',
    botao: 'Quero entrar na Black ORA',
  },
}
