// Textos das partes do tema no painel (cada profissional cria a sua parte aqui).

export const doTema = {
  aulas: 'Aulas',
  cardapios: 'Cardápios',
  tipos: 'Tipos de treino',
  treinos: 'Treinos',
  desafio: 'Desafio do tema',
  materiais: 'Materiais para baixar',
  novoCardapio: '+ Novo cardápio',
  novoTreino: '+ Novo treino',
  novoDesafio: '+ Novo desafio',
  editarMateriais: 'Arquivos do tema',
  vazio: 'Nada ainda.',
  abre: 'Abre no dia da aluna',
  dura: 'Dura',
  dias: (n: number) => (n === 1 ? '1 dia' : `${n} dias`),
}
