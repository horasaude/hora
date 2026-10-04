// Popup de compra e página de obrigada.

export const compra = {
  titulo: 'Garanta a sua *vaga*',
  fechar: 'Fechar',
  carregando: 'Carregando',
  plano: 'Como você quer pagar?',
  opcoes: {
    parcelado: 'no cartão, parcelado',
    pix: 'à vista no Pix',
    recorrente: 'no cartão recorrente',
  },
  nome: 'Seu nome',
  email: 'Seu e-mail',
  whatsapp: 'Seu WhatsApp',
  site: 'Deixe em branco',
  botao: 'Ir para o pagamento',
  indo: 'Indo para o pagamento',
  concordo: ['Ao continuar, você concorda com os ', ' e a ', '.'] as const,
  erros: {
    nome: 'Escreva seu nome',
    email: 'Confira o e-mail',
    whatsapp: 'Confira o WhatsApp com DDD',
    plano: 'Escolha como quer pagar',
  },
  semLink: 'O pagamento por aqui ainda não está disponível.',
  chamarWhatsApp: 'Falar no WhatsApp',
  obrigada: {
    titulo: 'Que bom ter você na *HORA*',
    passos: [
      'Assim que o pagamento for confirmado, você recebe um e-mail com o seu acesso.',
      // TODO(clientes): data do lançamento.
      'A plataforma abre no lançamento. Fique de olho no seu e-mail e no WhatsApp.',
      'Pagou no Pix? A confirmação costuma chegar em poucos minutos.',
    ],
    duvida: 'Ficou com alguma dúvida?',
    voltar: 'Voltar para a página',
  },
}
