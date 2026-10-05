// Preço, prêmios, garantia, perguntas, CTA final, rodapé e WhatsApp.

export const fechamento = {
  preco: {
    etiqueta: 'Investimento',
    titulo: 'Escolha como *entrar*',
    de: 'de',
    vezes: (n: number) => `${n}x`,
    parcelado: 'no cartão, parcelado',
    pix: (valor: string) => `ou ${valor} no Pix`,
    recorrente: (n: number, valor: string) => `ou ${n}x de ${valor} no cartão recorrente`,
    acesso: (meses: number) => `${meses} meses de acesso`,
    botao: 'Quero entrar na HORA',
  },
  premios: {
    etiqueta: 'Ranking',
    titulo: 'Os *prêmios* do ranking',
    // TODO(clientes): prêmios de cada posição e do ranking anual.
    posicoes: [
      { lugar: '1º lugar', premio: 'A definir' },
      { lugar: '2º lugar', premio: 'A definir' },
      { lugar: '3º lugar', premio: 'A definir' },
    ],
    anual: 'Prêmios do ranking anual: a definir',
  },
  garantia: {
    etiqueta: 'Sem risco',
    titulo: '*7 dias* de garantia',
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
