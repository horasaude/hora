// Textos provisórios. TODO(clientes): revisão jurídica antes do lançamento.

export type Documento = {
  titulo: string
  atualizado: string
  secoes: { titulo: string; texto: string }[]
}

const contato =
  'Fale com a gente pelo e-mail contato@comunidadeora.com.br ou pelo WhatsApp (34) 99148-3885.'

export const termos: Documento = {
  titulo: 'Termos de uso',
  atualizado: 'Atualizado em 05/10/2026',
  secoes: [
    {
      titulo: 'Quem somos',
      texto:
        'A ORA é uma comunidade de acompanhamento em saúde e hábitos, inscrita no CNPJ 52.877.749/0001-15. Estes termos valem para o uso deste site e da plataforma ORA.',
    },
    {
      titulo: 'O que você contrata',
      texto:
        'Acesso por 12 meses (13 meses nas compras feitas no dia 24/10, durante a oferta do ORA) a trilhas de conteúdo, lives, check-ins, ranking e comunidade. O acesso é pessoal e não pode ser compartilhado.',
    },
    {
      titulo: 'Pagamento',
      texto:
        'O pagamento é feito pelo Asaas, à vista no Pix, parcelado no cartão ou em cobrança mensal recorrente. O acesso é liberado depois da confirmação do pagamento.',
    },
    {
      titulo: 'Garantia e cancelamento',
      texto:
        'O cancelamento é pedido na plataforma, em Perfil > Minha conta. Em até 7 dias depois da compra, a devolução é integral e o acesso termina na hora. Depois desse prazo, o plano escolhido segue até o fim dos 12 meses, com as cobranças combinadas, e não é renovado. Ao fim dos 12 meses não há cobrança automática: enviamos um e-mail convidando para renovar. O contrato completo é enviado por e-mail depois da compra.',
    },
    {
      titulo: 'Conteúdo e saúde',
      texto:
        'O conteúdo da ORA é educativo e não substitui consulta individual. Siga as orientações do seu médico para condições de saúde específicas.',
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
        'Para liberar o seu acesso, falar com você sobre a compra e a comunidade, e entender quais campanhas trazem pessoas até a ORA. Medidas e fotos de evolução são suas e nunca entram em ranking.',
    },
    {
      titulo: 'Com quem compartilhamos',
      texto:
        'Com os serviços que fazem a ORA funcionar: Asaas (pagamento), Supabase (banco de dados) e Vercel (hospedagem). Não vendemos seus dados.',
    },
    {
      titulo: 'Pagamento',
      texto:
        'O cartão é digitado no checkout da ORA e enviado direto ao Asaas por conexão segura, só para fazer a cobrança. A ORA não guarda número de cartão; os dados do cartão e do Pix ficam com o Asaas.',
    },
    {
      titulo: 'Seus direitos',
      texto:
        'Pela LGPD, você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo contato abaixo.',
    },
    { titulo: 'Contato', texto: contato },
  ],
}

export const atualizadoEm = (data: string) => `Atualizado em ${data}`
