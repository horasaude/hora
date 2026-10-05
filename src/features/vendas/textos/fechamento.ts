// Preço, garantia, perguntas, CTA final, rodapé e WhatsApp.

export const fechamento = {
  preco: {
    etiqueta: 'Investimento',
    titulo: 'Escolha o seu *plano*',
    oferta: {
      selo: (desconto: string) => `Oferta ORA: ${desconto} OFF`,
      // Regra no domínio: FIM_OFERTA_ORA (24/10/2026 23h59 de Brasília).
      prazo: 'Condição especial válida só até 24/10, às 23h59.',
      depois: 'Depois disso, os valores voltam ao preço normal.',
      unidades: { dias: 'dias', horas: 'horas', minutos: 'min', segundos: 'seg' },
    },
    de: 'de',
    planos: {
      parcelado: {
        nome: 'Parcelado',
        detalhe: 'no cartão de crédito',
        itens: ['Pagamento em 12 parcelas', 'Acesso a tudo desde o primeiro dia'],
      },
      pix: {
        nome: 'À vista',
        detalhe: 'no Pix',
        selo: 'Menor valor',
        itens: ['Pagamento único', 'Acesso a tudo desde o primeiro dia'],
      },
      recorrente: {
        nome: 'Mensal',
        detalhe: 'no cartão, mês a mês',
        itens: ['Não ocupa o limite do cartão', 'Fidelidade de 12 meses'],
      },
    },
    vezes: (n: number) => `${n}x`,
    acesso: (meses: number) => `${meses} meses de acesso`,
    botao: 'Quero este',
  },
  garantia: {
    selo: '7 dias',
    titulo: 'Garantia de 7 dias',
    texto: 'Entrou e não era para você? Peça a devolução em até 7 dias e recebe o valor integral.',
  },
  perguntas: {
    etiqueta: 'Dúvidas',
    titulo: 'Perguntas *frequentes*',
    itens: [
      {
        p: 'Preciso ter participado do ORA?',
        r: 'Não. A HORA é aberta para quem quer começar agora.',
      },
      {
        p: 'Quando recebo o acesso?',
        // TODO(clientes): data do lançamento.
        r: 'Depois da confirmação do pagamento, você recebe o acesso por e-mail. A plataforma abre no lançamento.',
      },
      {
        p: 'Qual a diferença entre parcelado e recorrente?',
        r: 'No parcelado, o valor total ocupa o limite do cartão. No recorrente, a cobrança acontece mês a mês e não ocupa o limite.',
      },
      {
        p: 'Como funciona a fidelidade no recorrente?',
        r: 'O plano recorrente tem fidelidade de 12 meses. Nos primeiros 7 dias você pode cancelar com devolução integral.',
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
  ctaFinal: {
    etiqueta: 'Agora',
    titulo: 'Chegou a sua *HORA*',
    linha: (parcelas: string, pix: string) => `${parcelas} ou ${pix} no Pix`,
    botao: 'Quero entrar na HORA',
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
