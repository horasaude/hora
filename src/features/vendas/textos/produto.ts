// O que é, como funciona, profissionais, depoimentos, para quem é e o que recebe.

export type Depoimento = { nome: string; texto: string; foto?: string }
export type ItemRecebe = { texto: string; bonus?: boolean; so?: 'oferta' | 'lojaParceira' }

export const produto = {
  oQueE: {
    etiqueta: 'A comunidade',
    titulo: 'O que é a *HORA*',
    foto: '/fotos/tres-em-pe.webp',
    fotoAlt: 'Ana Milhomem, Dra. Clara Maria e Laís Moraes juntas à beira do lago',
    texto:
      'Doze meses de acompanhamento com uma nutricionista, uma médica nutróloga e uma educadora física, no mesmo lugar. Conteúdo, encontros ao vivo e uma comunidade que caminha junto com você.',
    pilares: [
      { nome: 'Alimentação', quem: 'com a nutricionista' },
      { nome: 'Saúde', quem: 'com a médica nutróloga' },
      { nome: 'Movimento', quem: 'com a educadora física' },
    ],
  },
  comoFunciona: {
    etiqueta: 'O método',
    titulo: 'Como funciona na *prática*',
    passos: [
      {
        titulo: '7 dias de preparação',
        texto: 'Uma semana para organizar a rotina antes de começar.',
      },
      {
        titulo: 'Você escolhe o seu tema',
        texto: 'Começa pelo objetivo que mais importa para você agora.',
      },
      {
        titulo: 'Trilhas por etapas',
        texto: 'Aulas curtas, liberadas aos poucos, para avançar sem se perder.',
      },
      {
        titulo: 'Lives a cada 15 dias',
        texto: 'Encontros ao vivo com as três para tirar dúvidas.',
      },
      {
        titulo: 'Check-in de treino',
        texto: 'Registre o treino do dia com foto e veja a sua constância.',
      },
      {
        titulo: 'Ranking e prêmios',
        texto: 'Cada check-in vale pontos. Quem se dedica é premiada.',
      },
    ],
  },
  profissionais: {
    etiqueta: 'Três olhares',
    titulo: 'Quem vai estar *com você*',
    // Fotos do ensaio de 01/10/2026 (Lightroom). TODO(clientes): frase de autoridade de cada uma.
    pessoas: [
      {
        nome: 'Ana Milhomem',
        papel: 'Nutricionista',
        frase: 'Cuida da alimentação possível, que cabe na sua rotina e no seu prato.',
        foto: '/fotos/ana.webp' as string | undefined,
      },
      {
        nome: 'Dra. Clara Maria',
        papel: 'Médica nutróloga',
        frase: 'Olha para a sua saúde por inteiro, com orientação médica e responsável.',
        foto: '/fotos/clara.webp' as string | undefined,
      },
      {
        nome: 'Laís Moraes',
        papel: 'Educadora física',
        frase: 'Coloca o corpo em movimento com treinos que respeitam o seu momento.',
        foto: '/fotos/lais.webp' as string | undefined,
      },
    ],
  },
  depoimentos: {
    etiqueta: 'Quem viveu',
    titulo: 'Quem já *viveu* o ORA',
    // TODO(clientes): depoimentos reais, com autorização. Enquanto vazio, a seção não aparece.
    itens: [] as Depoimento[],
  },
  paraQuem: {
    // TODO(clientes): validar as duas listas.
    etiqueta: 'Se enxergar',
    foto: '/fotos/tres-sentadas.webp',
    fotoAlt: 'As três profissionais sentadas conversando num deck de madeira',
    simTitulo: 'É *pra você* se',
    sim: [
      'Você já tentou sozinha e não conseguiu manter.',
      'Quer orientação de profissionais, não dieta da moda.',
      'Precisa de algo que caiba numa rotina corrida.',
      'Gosta de ter companhia para continuar.',
    ],
    naoTitulo: '*Não é* pra você se',
    nao: [
      'Procura resultado milagroso em poucos dias.',
      'Não quer mudar nada na rotina.',
      'Busca atendimento individual de consultório.',
    ],
  },
  recebe: {
    etiqueta: 'Composição',
    titulo: 'Tudo o que você *recebe*',
    selo: 'BÔNUS',
    itens: [
      { texto: 'Trilha "Comece por aqui" e 7 dias de preparação' },
      { texto: 'Trilhas por tema com etapas liberadas no seu ritmo' },
      { texto: 'Lives quinzenais com as três profissionais' },
      { texto: 'Cardápios da nutricionista' },
      { texto: 'Check-in de treino com foto e pontuação' },
      { texto: 'Ranking mensal e anual com prêmios' },
      { texto: 'Comunidade e fórum de dúvidas em cada aula' },
      { texto: '13º mês de acesso grátis', bonus: true, so: 'oferta' },
      { texto: 'Desconto na loja parceira de suplementos', bonus: true, so: 'lojaParceira' },
    ] as ItemRecebe[],
  },
}
