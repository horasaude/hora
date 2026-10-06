// Textos provisórios. TODO(clientes): revisão jurídica antes do lançamento.

export type Documento = {
  titulo: string
  atualizado: string
  secoes: { titulo: string; texto: string }[]
}

const contato = 'TODO(clientes): e-mail de contato'

export const termos: Documento = {
  titulo: 'Termos de uso',
  atualizado: 'Atualizado em 05/10/2026',
  secoes: [
    {
      titulo: 'Quem somos',
      texto:
        'A HORA é uma comunidade de acompanhamento em saúde e hábitos, inscrita no CNPJ 52.877.749/0001-15. Estes termos valem para o uso deste site e da plataforma HORA.',
    },
    {
      titulo: 'O que você contrata',
      texto:
        'Acesso por 12 meses (13 meses nas compras feitas no dia 24/10, durante a oferta do ORA) a trilhas de conteúdo, lives, check-ins, ranking e comunidade. O acesso é pessoal e não pode ser compartilhado.',
    },
    {
      titulo: 'Pagamento',
      texto:
        'O pagamento é feito pelo Mercado Pago, à vista no Pix, parcelado no cartão ou em cobrança mensal recorrente. O acesso é liberado depois da confirmação do pagamento.',
    },
    {
      titulo: 'Garantia e cancelamento',
      texto:
        'Você pode pedir a devolução integral em até 7 dias depois da compra. No plano mensal vale a fidelidade de 12 meses depois desse prazo. O contrato completo é enviado por e-mail depois da compra.',
    },
    {
      titulo: 'Conteúdo e saúde',
      texto:
        'O conteúdo da HORA é educativo e não substitui consulta individual. Siga as orientações do seu médico para condições de saúde específicas.',
    },
    {
      titulo: 'Convivência',
      texto:
        'Na comunidade, trate todas com respeito. Conteúdo ofensivo, propaganda ou divulgação de dados de outras pessoas pode levar à suspensão do acesso.',
    },
    { titulo: 'Contato', texto: contato },
  ],
}

export const privacidade: Documento = {
  titulo: 'Política de privacidade',
  atualizado: 'Atualizado em 05/10/2026',
  secoes: [
    {
      titulo: 'Quais dados coletamos',
      texto:
        'Na compra: nome, e-mail, WhatsApp, a forma de pagamento escolhida e de onde você chegou ao site (como o nome da campanha). Na plataforma: os dados que você mesma registra, como check-ins, fotos e medidas.',
    },
    {
      titulo: 'Para que usamos',
      texto:
        'Para liberar o seu acesso, falar com você sobre a compra e a comunidade, e entender quais campanhas trazem pessoas até a HORA. Medidas e fotos de evolução são suas e nunca entram em ranking.',
    },
    {
      titulo: 'Com quem compartilhamos',
      texto:
        'Com os serviços que fazem a HORA funcionar: Mercado Pago (pagamento), Supabase (banco de dados) e Vercel (hospedagem). Não vendemos seus dados.',
    },
    {
      titulo: 'Pagamento',
      texto:
        'Os dados do cartão e do Pix ficam com o Mercado Pago. A HORA não recebe nem guarda número de cartão.',
    },
    {
      titulo: 'Seus direitos',
      texto:
        'Pela LGPD, você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo contato abaixo.',
    },
    { titulo: 'Contato', texto: contato },
  ],
}
