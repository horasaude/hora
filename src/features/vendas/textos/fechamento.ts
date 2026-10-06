// Preço, garantia, perguntas, rodapé e WhatsApp.

export const fechamento = {
  preco: {
    etiqueta: 'Investimento',
    titulo: 'Escolha o seu *plano*',
    oferta: {
      vantagem: 'Compre 12 meses e ganhe 1 mês grátis',
      selo: (desconto: string) => `Oferta ORA: ${desconto} OFF`,
      // Regra no domínio: só no dia 24/10/2026, de 00h00 a 23h59 de Brasília (src/domain/oferta.ts).
      prazo: { antes: 'Só no dia 24/10, no evento ORA.', durante: 'É só hoje, até as 23h59.' },
      contagem: { antes: 'Começa em', durante: 'Termina em' },
      depois: {
        antes: 'Até lá, valem os preços normais abaixo.',
        durante: 'Depois disso, os valores voltam ao preço normal.',
      },
      unidades: { dias: 'dias', horas: 'horas', minutos: 'min', segundos: 'seg' },
    },
    de: 'de',
    planos: {
      parcelado: {
        nome: 'Parcelado',
        detalhe: 'no cartão de crédito',
        itens: ['Pagamento em 12 parcelas'],
      },
      pix: {
        nome: 'À vista',
        detalhe: 'no Pix',
        selo: 'Menor valor',
        itens: ['Pagamento único'],
      },
      recorrente: {
        nome: 'Mensal',
        detalhe: 'no cartão, mês a mês',
        itens: ['Não ocupa o limite do cartão'],
      },
    },
    vezes: (n: number) => `${n}x`,
    acesso: (meses: number) =>
      meses > 12 ? '12 meses + 1 mês grátis' : `${meses} meses de acesso`,
    mesGratis: '+1 mês grátis',
    botao: 'Quero este',
    seguro: 'Compra 100% segura! Receba seu acesso imediatamente após confirmação do pagamento.',
  },
  garantia: {
    selo: '7 dias',
    titulo: 'Garantia de 7 dias',
    texto: 'Entrou e não era para você? Peça a devolução em até 7 dias e recebe o valor integral.',
  },
  perguntas: {
    etiqueta: 'Dúvidas',
    cta: 'Tirei minhas dúvidas, quero entrar',
    titulo: 'Perguntas *frequentes*',
    itens: [
      {
        p: 'Preciso ter participado do ORA?',
        r: 'Não. A HORA é aberta para quem quer começar agora.',
      },
      {
        p: 'Quando vale a oferta do ORA?',
        r: 'Somente no dia 24/10, no evento ORA, até as 23h59 (horário de Brasília). Nesse dia: R$ 300 de desconto e 1 mês grátis.',
      },
      {
        p: 'Quando recebo o acesso?',
        r: 'Assim que o pagamento é confirmado, você recebe seu usuário e senha. Você começa pelas boas-vindas e pelos 7 dias de preparação, e no 8º dia escolhe o seu tema.',
      },
      {
        p: 'Qual a diferença entre parcelado e mensal?',
        r: 'No parcelado, o valor total ocupa o limite do cartão. No mensal, a cobrança acontece mês a mês e não ocupa o limite.',
      },
      {
        p: 'Como funciona a fidelidade no plano mensal?',
        r: 'O plano mensal tem fidelidade de 12 meses. Nos primeiros 7 dias você pode cancelar com devolução integral.',
      },
      {
        p: 'E se eu perder uma live?',
        r: 'As lives ficam gravadas para você assistir quando puder.',
      },
      {
        p: 'Como acesso o conteúdo?',
        r: 'Pelo celular ou computador, com e-mail e senha. Dá para instalar como aplicativo.',
      },
    ],
  },
  assinatura: 'ORA · 2026',
  rodape: {
    marca: 'HORA',
    cnpj: 'CNPJ 52.877.749/0001-15',
    termos: 'Termos de uso',
    privacidade: 'Política de privacidade',
    direitos: '© 2026 HORA. Todos os direitos reservados.',
  },
  whatsapp: {
    rotulo: 'Falar no WhatsApp',
    mensagem: 'Oi! Quero saber mais sobre a HORA.',
  },
}
