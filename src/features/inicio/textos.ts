// Textos do Início. Os componentes só leem daqui.

export const textos = {
  painel: 'Painel das profissionais',
  forum: 'Ir para o fórum',
  loja: 'Ir para a loja',
  aula: { titulo: 'Aula de hoje', abrir: (t: string) => `Abrir a aula de hoje: ${t}` },
  live: (quando: string, tema: string) => `Live ${quando} · ${tema}`,
  resumo: {
    pontos: 'pontos no mês',
    seguidos: 'dias seguidos',
    ranking: 'no ranking',
    posicao: (n: number) => `${n}º`,
  },
  semAcesso: 'Seu acesso começa assim que o pagamento for confirmado.',
}
