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
    titulo: 'Que bom ter você na *HORA*',
    passos: [
      'Assim que o pagamento for confirmado, você recebe no e-mail o seu usuário e uma senha provisória.',
      'Entre pelo link do e-mail e troque a senha no primeiro acesso.',
      'Pagou no Pix? A confirmação costuma chegar em poucos minutos.',
    ],
    duvida: 'Ficou com alguma dúvida?',
    voltar: 'Voltar para a página',
  },
}
