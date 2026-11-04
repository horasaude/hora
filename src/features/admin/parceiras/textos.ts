export const PRAZOS = [1, 3, 6, 12] as const
export type Prazo = (typeof PRAZOS)[number]

export const t = {
  botao: 'Cadastrar parceira',
  titulo: 'Cadastrar parceira',
  nome: 'Nome',
  email: 'E-mail',
  prazo: 'Acesso por',
  meses: (n: number) => (n === 1 ? '1 mês' : `${n} meses`),
  cadastrar: 'Cadastrar e enviar e-mail',
  cadastrando: 'Cadastrando',
  fechar: 'Fechar',
  pronto: (email: string) => `Pronto. Enviamos o e-mail para ${email} criar a senha.`,
  semEmail: (email: string) =>
    `Acesso liberado, mas o e-mail para ${email} não saiu. Use Reenviar e-mail na ficha dela.`,
  etiqueta: 'Parceira',
  secao: 'Parceria',
  reenviar: 'Reenviar e-mail',
  reenviando: 'Enviando',
  reenviado: 'E-mail enviado.',
  erros: {
    nome: 'Preencha o nome',
    email: 'Confira o e-mail',
    ja_tem_acesso: 'Essa pessoa já tem acesso pago ao ORA.',
    equipe: 'Esse e-mail é de alguém da equipe.',
    falha: 'Não foi possível cadastrar. Tente de novo.',
    reenviar: 'Não foi possível enviar. Tente de novo.',
  },
}
