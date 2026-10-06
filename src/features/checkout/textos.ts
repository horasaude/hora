// Copy do checkout. Os componentes só leem daqui.

export const textos = {
  oferta: (desconto: string) => `Oferta ORA: ${desconto} OFF + 1 mês grátis`,
  banner: {
    etiqueta: 'Comunidade',
    nome: 'HORA',
    frase: '12 meses de nutrição, saúde e movimento, com quem entende do assunto',
  },
  produto: {
    nome: 'Comunidade HORA',
    autoras: 'Ana Milhomem, Dra. Clara Maria e Laís Moraes',
    acesso: (meses: number) => `${meses} meses de acesso`,
    vantagem: '12 meses + 1 mês grátis',
  },
  plano: {
    titulo: 'Seu plano',
    opcoes: {
      parcelado: { nome: 'Parcelado', detalhe: 'no cartão de crédito' },
      pix: { nome: 'À vista', detalhe: 'no Pix' },
      recorrente: { nome: 'Mensal', detalhe: 'no cartão, mês a mês' },
    },
  },
  dados: {
    titulo: 'Dados pessoais',
    email: { rotulo: 'Seu e-mail', exemplo: 'Digite seu e-mail para receber o acesso' },
    nome: { rotulo: 'Nome completo', exemplo: 'Digite seu nome completo' },
    cpf: { rotulo: 'CPF', exemplo: '000.000.000-00' },
    whatsapp: { rotulo: 'WhatsApp', exemplo: '(00) 00000-0000' },
  },
  pagamento: {
    titulo: 'Forma de pagamento',
    pix: { nome: 'Pix', texto: 'O código Pix aparece aqui quando você finalizar.' },
    cartao: {
      nome: 'Cartão de crédito',
      texto: 'Os dados do cartão são digitados em campos seguros do Mercado Pago.',
    },
    emBreve: 'O pagamento será liberado em breve.',
    botao: 'Finalizar compra',
    concordo: ['Ao finalizar, você concorda com os ', ' e a ', '.'] as const,
    termos: 'Termos de uso',
    privacidade: 'Política de privacidade',
    total: 'Total',
  },
  lateral: {
    incluiTitulo: 'O que está incluído',
    inclui: [
      'Trilhas por tema com etapas no seu ritmo',
      'Lives quinzenais com as três profissionais',
      'Cardápios da nutricionista',
      'Check-in de treino, ranking e prêmios',
      'Comunidade e fórum de dúvidas',
    ],
    garantiaSelo: '7 dias',
    garantiaTitulo: 'Garantia de 7 dias',
    garantiaTexto: 'Não era para você? Peça a devolução em até 7 dias e recebe o valor integral.',
    seguro: 'Compra 100% segura',
    ajuda: 'Ficou com alguma dúvida?',
    whatsapp: 'Falar no WhatsApp',
    mensagem: 'Oi! Estou no checkout da HORA e tenho uma dúvida.',
  },
  erros: {
    email: 'Confira o e-mail',
    nome: 'Escreva seu nome completo',
    cpf: 'Confira o CPF',
    whatsapp: 'Confira o WhatsApp com DDD',
  },
  voltar: 'Voltar para a página',
}
