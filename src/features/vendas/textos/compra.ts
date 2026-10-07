// Popup de compra e página de obrigada.

export const compra = {
  titulo: 'Preencha os dados abaixo e garanta a sua inscrição',
  escolhido: 'Plano escolhido',
  fechar: 'Fechar',
  carregando: 'Carregando',
  opcoes: {
    parcelado: 'no cartão, parcelado',
    pix: 'à vista no Pix',
    recorrente: 'no cartão, mês a mês',
  },
  nome: { rotulo: 'Nome', exemplo: 'Digite seu nome' },
  email: { rotulo: 'E-mail', exemplo: 'Digite seu melhor e-mail' },
  whatsapp: { rotulo: 'WhatsApp', exemplo: 'Digite seu DDD + WhatsApp' },
  site: 'Deixe em branco',
  botao: 'Fazer minha inscrição',
  indo: 'Enviando',
  concordo: ['Ao continuar, você concorda com os ', ' e a ', '.'] as const,
  erros: {
    nome: 'Escreva seu nome',
    email: 'Confira o e-mail',
    whatsapp: 'Confira o WhatsApp com DDD',
    plano: 'Escolha como quer pagar',
  },
  obrigada: {
    titulo: 'Que bom ter você na *ORA*',
    passos: [
      'Assim que o pagamento for confirmado, você recebe no e-mail o link para criar a sua senha.',
      'O link vale por 24 horas. Crie a senha e entre no ORA.',
      'Pagou no Pix? A confirmação costuma chegar em poucos minutos.',
    ],
    aprovado: [
      'Seu pagamento foi confirmado e o acesso já está liberado.',
      'Enviamos para o seu e-mail o link para criar a sua senha. Ele vale por 24 horas.',
      'Crie a senha e comece pela Preparação, uma aula por dia.',
    ],
    pendenteTitulo: 'Estamos esperando o *pagamento*',
    pendente: 'Assim que o pagamento cair, seu acesso chega no e-mail',
    recusadoTitulo: 'O pagamento não foi *aprovado*',
    recusado: 'Nada foi cobrado. Você pode tentar de novo com outro cartão ou no Pix.',
    tentar: 'Voltar ao checkout',
    duvida: 'Ficou com alguma dúvida?',
    voltar: 'Voltar para a página',
  },
}
