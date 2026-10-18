// O que é, como funciona, profissionais, depoimentos, para quem é e o que recebe.

export type Depoimento = { nome: string; texto: string; foto?: string }
export type ItemRecebe = { texto: string; bonus?: boolean; so?: 'oferta' | 'lojaParceira' }

export const produto = {
  oQueE: {
    etiqueta: 'A comunidade',
    cta: 'Quero fazer parte da ORA',
    titulo: 'O que é a *ORA*',
    foto: '/fotos/tres-em-pe.webp',
    fotoAlt: 'Ana Milhomem, Dra. Clara Maria e Laís Moraes juntas à beira do lago',
    texto:
      'Um ano de conteúdos informativos, encontros ao vivo, desafios e uma comunidade de mulheres que caminham na mesma direção. Uma equipe, três olhares diferentes para cuidar de você!',
    pilares: [
      { nome: 'Alimentação', quem: 'com a nutricionista' },
      { nome: 'Saúde', quem: 'com a médica' },
      { nome: 'Movimento', quem: 'com a educadora física' },
    ],
  },
  comoFunciona: {
    etiqueta: 'O método',
    cta: 'Quero começar minha preparação',
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
        texto:
          'Aulas curtas para facilitar o seu dia a dia, liberadas aos poucos para que você avance sem se perder.',
      },
      {
        titulo: 'Encontros quinzenais',
        texto:
          'Encontros ao vivo para trazer ainda mais orientações, troca de experiências e também para tirar as suas dúvidas.',
      },
      {
        titulo: 'Check-in de treino',
        texto: 'Registre o treino do dia com foto e veja a sua constância.',
      },
      {
        titulo: 'Ranking e prêmios',
        texto:
          'Cada check-in vale pontos e você vai acumulando. No final, quem mais se dedicar será premiada.',
      },
    ],
  },
  profissionais: {
    etiqueta: 'Três olhares',
    cta: 'Quero ser acompanhada por elas',
    titulo: 'Quem vai estar *com você*',
    // Fotos do ensaio de 01/10/2026 (Lightroom). TODO(clientes): frase de autoridade de cada uma.
    pessoas: [
      {
        nome: 'Ana Milhomem',
        papel: 'Nutricionista',
        frase: 'Cuida da alimentação possível, que cabe na sua rotina e no seu prato.',
        foto: '/fotos/ana.webp' as string | undefined,
        cartao: { titulo: 'Cardápio da semana', texto: 'Pronto no seu app' },
      },
      {
        nome: 'Dra. Clara Maria',
        papel: 'Médica',
        frase: 'Um olhar voltado para o cuidado com a saúde metabólica e o emagrecimento saudável.',
        foto: '/fotos/clara.webp' as string | undefined,
        cartao: { titulo: 'Orientações sobre saúde', texto: 'Mais qualidade de vida para você' },
      },
      {
        nome: 'Laís Moraes',
        papel: 'Educadora física',
        frase: 'Coloca o corpo em movimento com treinos que respeitam o seu momento.',
        foto: '/fotos/lais.webp' as string | undefined,
        cartao: { titulo: 'Emagreça com músculos', texto: 'Treino de força no seu ritmo' },
      },
    ],
  },
  depoimentos: {
    etiqueta: 'Quem viveu',
    cta: 'Quero viver isso também',
    titulo: 'Quem já *viveu* o ORA',
    // TODO(clientes): depoimentos reais, com autorização. Enquanto vazio, a seção não aparece.
    itens: [] as Depoimento[],
  },
  paraQuem: {
    // TODO(clientes): validar as duas listas.
    etiqueta: 'Se enxergar',
    cta: 'É pra mim, quero entrar',
    foto: '/fotos/tres-sentadas.webp',
    fotoAlt: 'As três profissionais sentadas conversando num deck de madeira',
    simTitulo: 'É *para você* se:',
    sim: [
      'Já tentou sozinha e não conseguiu se manter no peso que atingiu.',
      'Quer orientação multiprofissional para ter mais saúde e qualidade de vida.',
      'Precisa de algo prático que caiba na sua rotina.',
      'Gosta de ter companhia para atingir seus objetivos.',
    ],
    naoTitulo: '*Não é* para você se:',
    nao: [
      'Busca atendimento individual de consultório.',
      'Precisa de resultado milagroso em poucos dias.',
      'Não quer mudar a sua rotina nem se abrir para novas estratégias.',
    ],
  },
  recebe: {
    etiqueta: 'Composição',
    cta: 'Quero tudo isso',
    titulo: 'Tudo o que você *recebe*',
    selo: 'BÔNUS',
    itens: [
      { texto: 'Trilha "Comece por aqui" e 7 dias de preparação' },
      { texto: 'Trilhas por tema com etapas liberadas no seu ritmo' },
      { texto: 'Lives quinzenais para troca de experiências e informações' },
      { texto: 'Cardápios da nutricionista' },
      { texto: 'Check-in de treino com foto e pontuação' },
      { texto: 'Ranking mensal e anual com prêmios' },
      { texto: 'Comunidade e fórum de dúvidas em cada aula' },
      { texto: '13º mês de acesso grátis', bonus: true, so: 'oferta' },
      { texto: 'Desconto na loja parceira de suplementos', bonus: true, so: 'lojaParceira' },
    ] as ItemRecebe[],
  },
}
