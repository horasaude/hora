// Primeira dobra, números e problema.
// Títulos no padrão das capas: "frase em itálico *PALAVRA GRANDE* complemento".

export const abertura = {
  hero: {
    logo: 'ORA',
    etiqueta: 'Imersão ORA',
    titulo: 'Chegou a sua *HORA* de cuidar de você',
    // TODO(clientes): validar a promessa e o subtítulo.
    subtitulo:
      'Um ano com nutricionista, médica nutróloga e educadora física no mesmo lugar. Para você parar de recomeçar toda segunda.',
    botao: 'Quero entrar na HORA',
  },
  // Provisórios (fatos do produto). TODO(clientes): trocar por números de autoridade quando vierem.
  // O layout aceita qualquer valor curto com rótulo e detalhe.
  numeros: [
    {
      valor: '3',
      rotulo: 'especialistas',
      detalhe: 'cuidando de você juntas',
    },
    { valor: '12', rotulo: 'meses', detalhe: 'de acompanhamento' },
    { valor: '2', rotulo: 'lives por mês', detalhe: 'ao vivo com as três' },
  ],
  problema: {
    etiqueta: 'Pausa',
    cta: 'Quero ter companhia nessa',
    titulo: 'Você já *tentou*',
    frases: [
      'Baixou a dieta.',
      'Começou na segunda.',
      'Parou na quarta.',
      'Voltou para o mesmo lugar.',
      'E achou que o problema era você.',
    ],
    fecho: 'Não faltou força de vontade. Faltou *companhia*',
  },
}
