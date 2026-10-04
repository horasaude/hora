// Faixa, primeira dobra, números e problema. *palavra* vira destaque em serifa itálica.

export const abertura = {
  faixa: {
    oferta: (desconto: string) => `Oferta ORA: ${desconto} OFF até 24/10`,
    botao: 'Quero',
    unidades: { dias: 'd', horas: 'h', minutos: 'm', segundos: 's' },
  },
  hero: {
    logo: 'ORA',
    titulo: 'Chegou a sua *HORA* de cuidar de você',
    // TODO(clientes): validar a promessa e o subtítulo.
    subtitulo:
      'Um ano com nutricionista, médica nutróloga e personal no mesmo lugar. Para você parar de recomeçar toda segunda.',
    botao: 'Quero entrar na HORA',
    seguro: 'Compra segura. Acesso liberado no lançamento.',
  },
  // Provisórios (fatos do produto). TODO(clientes): trocar por números de autoridade quando vierem.
  // O layout aceita qualquer valor curto com rótulo e detalhe.
  numeros: [
    { valor: '3', rotulo: 'especialistas', detalhe: 'nutricionista, médica nutróloga e personal' },
    { valor: '12', rotulo: 'meses', detalhe: 'de acompanhamento' },
    { valor: '2', rotulo: 'lives por mês', detalhe: 'ao vivo com as três' },
  ],
  problema: {
    titulo: 'Você já *tentou*.',
    frases: [
      'Baixou a dieta.',
      'Começou na segunda.',
      'Parou na quarta.',
      'Voltou para o mesmo lugar.',
      'E achou que o problema era você.',
    ],
    fecho: 'Não faltou força de vontade. Faltou *companhia*.',
  },
}
