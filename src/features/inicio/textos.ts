// Textos do Início. Os componentes só leem daqui.

export const textos = {
  painel: 'Painel das profissionais',
  aula: { titulo: 'Aula de hoje', abrir: (t: string) => `Abrir a aula de hoje: ${t}` },
  resumo: {
    pontos: 'pontos no mês',
    seguidos: 'dias seguidos',
    ranking: 'no ranking',
    posicao: (n: number) => `${n}º`,
  },
  semAcesso: 'Seu acesso começa assim que o pagamento for confirmado.',
}
