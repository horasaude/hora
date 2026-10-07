// Textos do ranking. Os componentes só leem daqui.

export const textos = {
  titulo: 'Ranking',
  abas: { mes: 'Mês', ano: 'Ano' },
  abasRotulo: 'Período do ranking',
  voce: '(você)',
  rodape: 'Ranking por apelido · peso nunca conta',
  carregando: 'Carregando o ranking',
  erro: 'Não foi possível carregar o ranking.',
  tentar: 'Tentar de novo',
  vazio: 'Ninguém pontuou neste período ainda. O primeiro check-in já coloca você na lista.',
  posicaoDe: (n: number) => `${n}º lugar`,
  pontos: (n: number) => `${n.toLocaleString('pt-BR')} pts`,
  minha: {
    titulo: { mes: 'Sua posição no mês', ano: 'Sua posição no ano' },
    pontosMes: 'pontos no mês',
    pontosAno: 'pontos no ano',
    falta: (n: number) => `Faltam ${n} pts para subir uma posição`,
    topo: 'Você está no topo. Continue assim.',
    oculta: 'Você escolheu não aparecer no ranking. Só você vê a sua posição.',
  },
  inicio: {
    titulo: 'Ranking do mês',
    ver: 'Ver ranking',
    semPontos: 'Faça o primeiro check-in para entrar no ranking.',
  },
  ultimo: (pontos: number, acao: string, motivo: string | null) => {
    const onde: Record<string, string> = {
      treino_foto: 'no último treino',
      agua: 'na água',
      cardio: 'no cardio',
      tarefa: 'na tarefa',
      foto_refeicao: 'na refeição',
      aula_concluida: 'na última aula',
      duvida_forum: 'no fórum',
      duvida_util: 'no fórum',
      live: 'na última live',
      indicacao: 'na indicação',
      desafio_checkin: 'no desafio',
      desafio_bonus: 'no bônus do desafio',
      ajuste: 'em ajuste das profissionais',
    }
    return `+${pontos} pts ${onde[acao] ?? (motivo ? `em ${motivo}` : 'na última ação')}`
  },
}
