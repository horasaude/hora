// Textos provisórios da página de vendas. Troque aqui; os componentes só leem.

export const textos = {
  topo: {
    logo: 'ORA',
    selo: 'Comunidade HORA, 12 meses',
    promessa: 'Chegou a sua HORA de cuidar de você, com quem entende do assunto',
    apoio:
      'Um ano de acompanhamento com nutricionista, médica nutróloga e personal, numa comunidade que caminha junto com você.',
    botao: 'Quero fazer parte',
  },
  oQueE: {
    titulo: 'O que é a HORA',
    paragrafos: [
      'A HORA nasceu do ORA para quem quer mudar a rotina de verdade, sem dieta da moda e sem fazer tudo sozinha.',
      'Durante 12 meses você recebe conteúdo em trilhas, encontra as profissionais ao vivo e registra sua evolução num lugar só.',
    ],
  },
  profissionais: {
    titulo: 'Quem acompanha você',
    pessoas: [
      {
        nome: 'Ana Milhomem',
        papel: 'Nutricionista',
        texto: 'Cuida da alimentação possível, que cabe na sua rotina e no seu prato.',
      },
      {
        nome: 'Dra. Clara Maria',
        papel: 'Médica nutróloga',
        texto: 'Olha para a sua saúde por inteiro, com orientação médica e responsável.',
      },
      {
        nome: 'Laís Moraes',
        papel: 'Personal trainer',
        texto: 'Coloca o corpo em movimento com treinos que respeitam o seu momento.',
      },
    ],
  },
  comoFunciona: {
    titulo: 'Como funciona',
    itens: [
      {
        titulo: 'Trilhas por tema',
        texto: 'Aulas curtas, liberadas aos poucos, para você avançar no seu ritmo.',
      },
      {
        titulo: 'Lives',
        texto: 'Encontros ao vivo com as três para tirar dúvidas e ajustar a rota.',
      },
      {
        titulo: 'Check-in com foto',
        texto: 'Registre seus hábitos do dia e acompanhe a sua constância.',
      },
      {
        titulo: 'Ranking e prêmios',
        texto: 'Cada hábito vale pontos. Quem se dedica é reconhecida e premiada.',
      },
    ],
  },
  precos: {
    titulo: 'Escolha como entrar',
    selo: 'Condição do ORA até 24/10, às 23h59',
    terminaEm: 'Termina em',
    unidades: { dias: 'dias', horas: 'horas', minutos: 'min', segundos: 'seg' },
    pix: 'à vista no Pix',
    parcelado: 'no cartão, parcelado',
    recorrente: 'no cartão, cobrança mensal',
    vezes: (n: number) => `${n}x de`,
    acesso: (meses: number) => `${meses} meses de acesso`,
    botao: 'Pagamento em breve',
  },
  garantia: {
    titulo: 'Garantia de 7 dias',
    texto: 'Entrou e não era para você? Peça a devolução em até 7 dias e recebe o valor integral.',
    fidelidadeTitulo: 'Plano de 12 meses',
    fidelidadeTexto:
      'A HORA é um acompanhamento de um ano. Depois dos 7 dias de garantia, vale a fidelidade de 12 meses.',
  },
  perguntas: {
    titulo: 'Perguntas frequentes',
    itens: [
      {
        p: 'Preciso ter participado do ORA?',
        r: 'Não. A HORA é aberta para quem quer começar agora.',
      },
      {
        p: 'Como acesso o conteúdo?',
        r: 'Pelo celular ou computador, com e-mail e senha. Dá para instalar como aplicativo.',
      },
      {
        p: 'E se eu perder uma live?',
        r: 'As lives ficam gravadas para você assistir quando puder.',
      },
      {
        p: 'Qual a diferença entre parcelado e mensal?',
        r: 'No parcelado o valor total ocupa o limite do cartão. No mensal, a cobrança acontece mês a mês.',
      },
      {
        p: 'Posso cancelar?',
        r: 'Nos primeiros 7 dias, com devolução integral. Depois disso vale a fidelidade de 12 meses.',
      },
    ],
  },
  rodape: {
    marca: 'HORA',
    cnpj: 'CNPJ 52.877.749/0001-15',
    termos: 'Termos de uso',
    privacidade: 'Política de privacidade',
    direitos: '© 2026 HORA. Todos os direitos reservados.',
  },
}
